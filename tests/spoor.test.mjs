import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import ts from 'typescript';

const directory = mkdtempSync(join(tmpdir(), 'spoor-unit-'));
for (const name of [
  'types',
  'config',
  'target',
  'report',
  'transport',
  'HttpSpoorClient',
  'download',
  'copy',
  'summary',
]) {
  const source = readFileSync(`src/spoor/${name}.ts`, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  });
  writeFileSync(
    join(directory, `${name}.mjs`),
    outputText.replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'"),
  );
}
globalThis.EventSource = class {};
const load = (name) =>
  import(pathToFileURL(join(directory, `${name}.mjs`)).href);
const { mapReport } = await load('report');
const { parseTarget } = await load('target');
const { fetchResponse } = await load('transport');
const { HttpSpoorClient } = await load('HttpSpoorClient');
const { exportFilename } = await load('download');
const { summaryText } = await load('summary');
after(() => rmSync(directory, { recursive: true, force: true }));
const rawReport = () => ({
  schema_version: '1.1',
  target: { type: 'user' },
  summary: {
    display_name: 'example',
    total_public_repositories: 2,
    distinct_emails_observed: 1,
    public_keys_found: 0,
    account_created: null,
    primary_languages: [['Rust', 100]],
  },
  coverage: { is_partial: false },
  provider_status: { github: { status: 'ok' }, gitleak: { status: 'skipped' } },
  repositories: [{ languages: null, hygiene: null }, {}],
  identities: [
    { email_type: 'git_hub_system' },
    { email_type: 'git_hub_no_reply' },
    { email_type: 'domain_email' },
  ],
});

test('schema 1.1 uses canonical identity counts and tolerates absent repository fields', () => {
  const result = mapReport('id', rawReport());
  assert.equal(
    result.fields.find((field) => field.key === 'identities').value,
    1,
  );
  assert.equal(result.status, 'complete');
  assert.ok(!result.fields.some((field) => field.key === 'created'));
  assert.deepEqual(
    result.fields.find((field) => field.key === 'languages').value,
    ['Rust'],
  );
  const optional = rawReport();
  optional.summary = { display_name: 'empty' };
  optional.provider_status = null;
  assert.deepEqual(mapReport('id', optional).fields, []);
  assert.throws(() =>
    mapReport('id', { ...rawReport(), schema_version: '1.0' }),
  );
});

test('partial, cached, warning and rate-limited coverage remain visible', () => {
  for (const status of ['partial', 'rate_limited', 'unavailable']) {
    const raw = rawReport();
    raw.provider_status.github.status = status;
    assert.equal(mapReport('id', raw).status, 'partial');
  }
  const raw = rawReport();
  raw.provider_status.github.status = 'cached';
  raw.warnings = ['provider warning'];
  assert.equal(mapReport('id', raw).coverage[0].status, 'cached');
  assert.equal(mapReport('id', raw).hasWarnings, true);
  raw.coverage.is_partial = true;
  assert.equal(mapReport('id', raw).status, 'partial');
});

test('accepted targets normalize without allowing other origins or extra URL components', () => {
  for (const input of [
    'Voldigoade',
    'github.com/Voldigoade',
    'https://github.com/Voldigoade/',
  ])
    assert.equal(parseTarget(input).value, 'Voldigoade');
  for (const input of [
    'torvalds/linux',
    'github.com/torvalds/linux',
    'https://github.com/torvalds/linux.git',
  ])
    assert.equal(parseTarget(input).kind, 'repository');
  for (const input of [
    '',
    'https://example.invalid/a',
    'a/b/c',
    'a?x=1',
    '-user',
    'a/..',
  ])
    assert.throws(() => parseTarget(input));
});

test('transport maps real error codes and never supplies a fixture fallback', async (t) => {
  for (const [status, code, expected] of [
    [400, 'invalid_target', 'invalidTarget'],
    [404, 'not_found', 'notFound'],
    [409, 'report_not_ready', 'notReady'],
    [202, 'in_progress', 'notReady'],
    [422, 'lookup_failed', 'provider'],
    [429, 'rate_limit_exceeded', 'rateLimited'],
    [500, 'internal_error', 'provider'],
  ]) {
    t.mock.method(
      globalThis,
      'fetch',
      async () =>
        new Response(JSON.stringify({ code }), {
          status,
          headers: { 'Retry-After': '12' },
        }),
    );
    await assert.rejects(
      fetchResponse('https://example.invalid', new AbortController().signal),
      (error) => error.code === expected && error.retryAfter === 12,
    );
    t.mock.restoreAll();
  }
  t.mock.method(globalThis, 'fetch', async () => {
    throw new TypeError('offline');
  });
  await assert.rejects(
    fetchResponse('https://example.invalid', new AbortController().signal),
    { code: 'network' },
  );
  t.mock.restoreAll();
  t.mock.method(
    globalThis,
    'fetch',
    (_, options) =>
      new Promise((_, reject) =>
        options.signal.addEventListener('abort', () =>
          reject(options.signal.reason),
        ),
      ),
  );
  const keepAlive = delay(50);
  await assert.rejects(
    fetchResponse(
      'https://example.invalid',
      new AbortController().signal,
      {},
      10,
    ),
    { code: 'timeout' },
  );
  await keepAlive;
});

test('client sends fast mode, encodes IDs and recovers completion after SSE disconnect', async (t) => {
  const streams = [];
  let statusCalls = 0;
  const events = [];
  class Stream {
    listeners = new Map();
    closed = false;
    constructor() {
      streams.push(this);
    }
    addEventListener(name, handler) {
      this.listeners.set(name, handler);
    }
    close() {
      this.closed = true;
    }
  }
  t.mock.property(globalThis, 'EventSource', Stream);
  t.mock.method(globalThis, 'fetch', async (_, options) => {
    if (options.method === 'POST') {
      assert.equal(JSON.parse(options.body).mode, 'fast');
      return Response.json(
        { id: 'lookup', status: 'pending' },
        { status: 202 },
      );
    }
    statusCalls++;
    return Response.json({
      id: 'lookup',
      status: statusCalls > 1 ? 'completed' : 'running',
    });
  });
  const client = new HttpSpoorClient('https://example.invalid/v1', {
    requestTimeoutMs: 100,
    lookupTimeoutMs: 200,
    pollIntervalMs: 10,
  });
  assert.equal(
    (
      await client.startLookup(
        parseTarget('Voldigoade'),
        'fast',
        new AbortController().signal,
      )
    ).status,
    'pending',
  );
  for (const format of ['pdf', 'md', 'json', 'txt', 'svg'])
    assert.equal(
      await client.getExportUrl('a/b', format),
      `https://example.invalid/v1/lookups/a%2Fb/export/${format}`,
    );
  const unsubscribe = client.subscribeToLookup(
    'lookup',
    (event) => events.push(event),
    (error) => assert.fail(error.code),
  );
  streams.at(-1).listeners.get('provider.completed')({
    data: JSON.stringify({
      event: 'provider_completed',
      data: { provider: 'github', details: 'real event' },
    }),
  });
  streams.at(-1).onerror();
  await delay(45);
  assert.ok(
    events.some(
      (event) =>
        event.type === 'progress' && event.line.detail === 'real event',
    ),
  );
  assert.equal(events.filter((event) => event.type === 'finished').length, 1);
  assert.equal(streams.at(-1).closed, true);
  const calls = statusCalls;
  unsubscribe();
  await delay(20);
  assert.equal(statusCalls, calls);
});

test('subscription timeout and cancellation stop streams and ignore late events', async (t) => {
  const streams = [];
  const events = [];
  const failures = [];
  class Stream {
    listeners = new Map();
    constructor() {
      streams.push(this);
    }
    addEventListener(name, handler) {
      this.listeners.set(name, handler);
    }
    close() {}
  }
  t.mock.property(globalThis, 'EventSource', Stream);
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ id: 'id', status: 'running' }),
  );
  const client = new HttpSpoorClient('https://example.invalid/v1', {
    requestTimeoutMs: 100,
    lookupTimeoutMs: 25,
    pollIntervalMs: 5,
  });
  const close = client.subscribeToLookup(
    'id',
    (event) => events.push(event),
    (error) => failures.push(error.code),
  );
  close();
  streams.at(-1).listeners.get('provider.started')({
    data: '{"provider":"github"}',
  });
  await delay(35);
  assert.deepEqual(events, []);
  assert.deepEqual(failures, []);
  client.subscribeToLookup(
    'id',
    (event) => events.push(event),
    (error) => failures.push(error.code),
  );
  await delay(40);
  assert.deepEqual(failures, ['timeout']);
});

test('Copy contains only the localized visible summary; export filenames are safe', () => {
  const report = mapReport('private-lookup-id', rawReport());
  const text = summaryText(report, 'en');
  assert.match(text, /example\nGitHub user\nComplete/);
  assert.match(text, /Rust/);
  assert.doesNotMatch(
    text,
    /private-lookup-id|schema_version|identities|provider_status|email_type/,
  );
  assert.equal(
    exportFilename('inline; filename="report.pdf"', 'fallback.pdf'),
    'report.pdf',
  );
  assert.equal(
    exportFilename(
      "attachment; filename*=UTF-8''rapport%20public.md",
      'fallback.md',
    ),
    'rapport public.md',
  );
  assert.equal(
    exportFilename('attachment; filename="../bad.txt"', 'safe.txt'),
    '..-bad.txt',
  );
  assert.equal(exportFilename(null, 'safe.json'), 'safe.json');
});

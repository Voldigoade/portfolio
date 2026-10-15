# Spoor integration

The public portfolio uses Spoor **v0.1.3**, report schema **1.1**, inspected at commit `6b9833b56ce6035a19df47370f4d5cd758aafaf9`:

- [README](https://github.com/Voldigoade/spoor/blob/6b9833b56ce6035a19df47370f4d5cd758aafaf9/README.md)
- [Embed guide](https://github.com/Voldigoade/spoor/blob/6b9833b56ce6035a19df47370f4d5cd758aafaf9/docs/EMBED.md)
- [TypeScript reference client](https://github.com/Voldigoade/spoor/blob/6b9833b56ce6035a19df47370f4d5cd758aafaf9/packages/spoor-client/src/index.ts)
- [Server handlers](https://github.com/Voldigoade/spoor/blob/6b9833b56ce6035a19df47370f4d5cd758aafaf9/crates/spoor-server/src/routes.rs)
- [Canonical report](https://github.com/Voldigoade/spoor/blob/6b9833b56ce6035a19df47370f4d5cd758aafaf9/crates/spoor-core/src/report.rs)

The guide and reference client still illustrate schema 1.0. The current canonical Rust report defines 1.1; the adapter follows that implementation.

## Boundary and configuration

`src/spoor/config.ts` centralizes the public service origin, paths and deadlines. The browser talks directly to `https://api--spoor--xsw6djgrvwtl.code.run/v1` with exact-origin CORS. The portfolio remains statically generated. No provider tokens, analysis logic or backend credentials belong here. A future same-origin proxy can change the base URL without changing the UI.

The UI uses `startLookup`, `subscribeToLookup`, `getReport` and `getExportUrl`. The public client is always `HttpSpoorClient`. `MockSpoorClient` is restricted to development-only preview routes; both the routes and fixture branch are removed from production. Network errors never cause a fixture fallback.

| Operation | Endpoint                                                       |
| --------- | -------------------------------------------------------------- |
| Start     | `POST /v1/lookups` with `{target, mode: "fast", enrich: true}` |
| Status    | `GET /v1/lookups/:id`                                          |
| Progress  | `GET /v1/lookups/:id/events`                                   |
| Report    | `GET /v1/lookups/:id/report`                                   |
| File      | `GET /v1/lookups/:id/export/:format`                           |

The portfolio only starts fast lookups. It does not expose deep mode. The backend handles optional, budget-protected GitLeak enrichment. Start returns 202 with the lookup ID; statuses are pending, running, completed and failed.

## Progress and cancellation

The adapter listens for named SSE events: `lookup.started`, `target.resolved`, `provider.started`, `provider.completed`, `provider.warning`, `scan.progress`, `analysis.completed` and `lookup.failed`. Both `{event, data}` envelopes and bare event data are accepted. At most three current progress lines appear, sourced from actual events.

The server broadcasts without replay and can announce completion before storing the report. Real status polling runs immediately and once per second until completion, including after an SSE disconnect. Only completed status triggers report retrieval. There is no simulated progress or minimum loading duration.

Individual requests time out after 20 seconds; active lookups time out after 120 seconds. Cancel, unmount or a new submission aborts pending requests, closes SSE and clears timers. Session guards ignore late responses. Cancellation stops browser observation; it does not cancel server work already started.

## Report mapping and errors

`report.ts` requires schema 1.1 and maps the canonical summary. Null/omitted repository languages and hygiene are not interpreted by the frontend. Counts use the backend summary, which excludes GitHub system identities from observed addresses. The frontend preserves backend identity classification and provenance rather than reclassifying addresses. Optional summary fields disappear gracefully.

Coverage and provider limitations preserve partial status. Cached providers and warnings are retained in the display model. The compact page includes the backend profile/avatar, optional bio/followers, observed public identity evidence, activity and separate scan/provider coverage. It excludes system identities, inferences and locations. Observed addresses are not represented as current contacts.

400 invalid target, 404 missing lookup, 422 failed lookup, 429 rate limit, 500/provider failures, network loss and timeout have localized recoverable errors. Both 202 `in_progress` and 409 `report_not_ready` are recognized. Rate-limit responses retain Retry-After seconds without automatically restarting work. After an SSE disconnect, the same lookup continues through polling. Transient network/timeout/5xx status failures retry at bounded exponential intervals (up to six consecutive failures, at most eight seconds between checks) within the 120-second deadline. Report retrieval retries transient or not-ready responses up to three times. Lookup creation is never automatically retried.

Copy uses the same formatted fields as the visible localized summary. Export downloads actual backend bytes for PDF, Markdown, JSON, TXT and SVG. Content-Disposition filenames are used when CORS exposes the header; otherwise safe target-based filenames are used. Empty/HTML responses are rejected. No substitute exports are generated client-side.

## Privacy and verification

Requests omit credentials, disable caching and send no referrer. Inputs/results stay in component memory; there is no persistence or analytics. The privacy pages describe transmission to the external API. The CSP allows connections only to self and the configured public API.

`npm test` covers mapping, optional data, errors, timeouts, cancellation, missed SSE completion, filenames and Copy text. `npm run test:browser` checks production pages, layout, accessibility, keyboard/touch behavior and isolated transport failures. These intercepted cases are not called real E2E.

`SPOOR_REAL_E2E=1 npm run test:e2e` deliberately triggers real backend work. Set `PORTFOLIO_BASE_URL` and an external `PORTFOLIO_QA_OUTPUT` directory. It checks a real user, repository, nonexistent target, named SSE, Copy and all five non-empty backend files. Generated reports and screenshots must stay outside the repository.

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { submitContactAction } from "../src/lib/server/contact-actions";

const originalFetch = globalThis.fetch;
const originalKey = process.env.WEB3FORMS_ACCESS_KEY;
let requests: Array<{
  body: Record<string, unknown>;
  signal: AbortSignal | null;
}>;
const valid = (email = "writer@example.test") => ({
  name: "  Example Writer  ",
  email,
  country: " France ",
  businessInquiry: " Repository question ",
  projectDetails: " A question about the public project documentation. ",
});

beforeEach(() => {
  process.env.WEB3FORMS_ACCESS_KEY = "test-only-server-key";
  requests = [];
  globalThis.fetch = (async (
    _url: string | URL | Request,
    init?: RequestInit,
  ) => {
    requests.push({
      body: JSON.parse(String(init?.body)),
      signal: init?.signal ?? null,
    });
    return Response.json({
      success: true,
      message: "provider-secret-response",
    });
  }) as unknown as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.WEB3FORMS_ACCESS_KEY;
  else process.env.WEB3FORMS_ACCESS_KEY = originalKey;
});

describe("contact server trust boundary", () => {
  test("rejects invalid required fields and email before calling provider", async () => {
    for (const input of [
      null,
      {},
      { ...valid(), name: "  " },
      { ...valid(), email: "bad" },
      { ...valid(), projectDetails: "short" },
    ]) {
      const result = await submitContactAction(input as never);
      expect(result.success).toBe(false);
    }
    expect(requests).toHaveLength(0);
  });

  test("rejects oversized fields, impossible dates and a populated honeypot", async () => {
    for (const input of [
      { ...valid(), name: "x".repeat(101) },
      { ...valid(), projectDetails: "x".repeat(5001) },
      { ...valid(), expectedStartDate: "2026-02-30" },
      { ...valid(), expectedStartDate: "2026-99-99" },
      {
        ...valid(),
        expectedStartDate: "2026-10-20",
        expectedEndDate: "2026-10-19",
      },
      { ...valid(), website: "https://spam.example" },
    ])
      expect((await submitContactAction(input)).success).toBe(false);
    expect(requests).toHaveLength(0);
  });

  test("normalizes input, bounds request and returns only an application result", async () => {
    expect(
      await submitContactAction(valid("  Normalized@EXAMPLE.test  ")),
    ).toEqual({ success: true, message: "Message sent." });
    expect(requests[0].body.name).toBe("Example Writer");
    expect(requests[0].body.email).toBe("normalized@example.test");
    expect(requests[0].body.country).toBe("France");
    expect(requests[0].signal).toBeInstanceOf(AbortSignal);
  });

  test("does not use a client-public provider key when server key is missing", async () => {
    delete process.env.WEB3FORMS_ACCESS_KEY;
    const oldPublicKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY = "must-not-be-used";
    try {
      const result = await submitContactAction(
        valid("unconfigured@example.test"),
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain("GitHub");
      expect(requests).toHaveLength(0);
    } finally {
      if (oldPublicKey === undefined)
        delete process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      else process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY = oldPublicKey;
    }
  });

  test("hides provider errors, malformed responses and thrown secrets", async () => {
    for (const [index, response] of [
      () =>
        Response.json(
          { success: false, message: "secret-key-and-email" },
          { status: 400 },
        ),
      () => new Response("not-json", { status: 502 }),
      () => {
        throw new Error("secret-key-and-email");
      },
    ].entries()) {
      globalThis.fetch = (async () => response()) as unknown as typeof fetch;
      const result = await submitContactAction(
        valid(`provider-${index}@example.test`),
      );
      expect(result).toEqual({
        success: false,
        message:
          "Could not send your message right now. Please try again later.",
      });
    }
  });

  test("throttles repeated normalized email attempts within one process", async () => {
    expect(
      (await submitContactAction(valid("limited@example.test"))).success,
    ).toBe(true);
    expect(
      (await submitContactAction(valid(" LIMITED@example.test "))).success,
    ).toBe(false);
    expect(requests).toHaveLength(1);
  });

  test("aborts a stalled provider request after eight seconds", async () => {
    let signal: AbortSignal | undefined;
    globalThis.fetch = ((_url: string | URL | Request, init?: RequestInit) =>
      new Promise((_resolve, reject) => {
        signal = init?.signal ?? undefined;
        signal?.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        );
      })) as unknown as typeof fetch;
    expect(
      (await submitContactAction(valid("timeout@example.test"))).success,
    ).toBe(false);
    expect(signal?.aborted).toBe(true);
  }, 10_000);
});

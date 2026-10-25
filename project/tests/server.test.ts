import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { createEnquiryHandler } from "../server/enquiries.ts";
import { emptyEnquiry, validateEnquiry } from "../src/data/enquiry.ts";

const valid = {
  ...emptyEnquiry,
  name: "Enquiry Test",
  email: "visitor@example.test",
  nature: "Content strategy",
  message: "Please discuss a research assignment.",
  consent: true,
  website: "",
};
async function harness(
  run: (h: {
    get: () => Promise<Response>;
    post: (
      body: unknown,
      headers?: Record<string, string>,
    ) => Promise<Response>;
    challenge: () => Promise<string>;
    calls: Record<string, unknown>[];
    result: (value: unknown, status?: number) => void;
    advance: (ms: number) => void;
    url: string;
  }) => Promise<void>,
  overrides: Record<string, string | undefined> = {},
) {
  let clock = 1792800000000;
  const calls: Record<string, unknown>[] = [];
  let result: unknown;
  let dbStatus = 200;
  const handler = createEnquiryHandler({
    env: {
      NODE_ENV: "production",
      VERCEL: "1",
      VERCEL_URL: "preview.vercel.app",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SECRET_KEY: "sb_secret_test",
      ENQUIRY_SIGNING_SECRET:
        "test-only-signing-secret-more-than-32-characters",
      ...overrides,
    },
    now: () => clock,
    fetch: async (_url, options) => {
      const body = JSON.parse(String(options?.body));
      assert.equal(
        (options?.headers as Record<string, string>).apikey,
        "sb_secret_test",
      );
      assert.equal(
        (options?.headers as Record<string, string>).Authorization,
        undefined,
      );
      calls.push(body);
      return Response.json(
        result ?? { status: "saved", id: body.p_request_id },
        { status: dbStatus },
      );
    },
  });
  const server = createServer((req, res) => {
    void handler(req, res);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}`;
  const headers = {
    Origin: "https://www.baliandpartners.in",
    "Content-Type": "application/json",
    "x-vercel-forwarded-for": "203.0.113.5",
  };
  const get = () => fetch(url, { headers });
  try {
    await run({
      url,
      get,
      post: (body, extra = {}) =>
        fetch(url, {
          method: "POST",
          headers: { ...headers, ...extra },
          body: JSON.stringify(body),
        }),
      challenge: async () => {
        const r = await get();
        const data = await r.json();
        clock += 1500;
        return data.challenge;
      },
      calls,
      result: (value, status = 200) => {
        result = value;
        dbStatus = status;
      },
      advance: (ms) => {
        clock += ms;
      },
    });
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

test("unconfigured endpoint fails closed without a receipt", async () => {
  await harness(
    async (h) => {
      assert.equal((await h.get()).status, 503);
      assert.equal((await h.post(valid)).status, 503);
      assert.equal(h.calls.length, 0);
    },
    { SUPABASE_SECRET_KEY: undefined },
  );
});
test("request method, origin, content type and body size are enforced", async () => {
  await harness(async (h) => {
    assert.equal((await fetch(h.url, { method: "DELETE" })).status, 405);
    assert.equal(
      (await h.post(valid, { Origin: "https://attacker.example" })).status,
      403,
    );
    assert.equal((await h.post(valid, { Origin: "null" })).status, 403);
    assert.equal(
      (await h.post(valid, { "Sec-Fetch-Site": "cross-site" })).status,
      403,
    );
    assert.equal(
      (await h.post(valid, { "Content-Type": "text/plain" })).status,
      415,
    );
    assert.equal((await h.post({ message: "a".repeat(13000) })).status, 413);
    assert.equal(h.calls.length, 0);
  });
});
test("signed challenges reject tampering, expiry, honeypots and changed clients", async () => {
  await harness(async (h) => {
    const challenge = await h.challenge();
    const body = { ...valid, challenge, requestId: randomUUID() };
    assert.equal(
      (await h.post({ ...body, challenge: challenge.slice(0, -1) + "z" }))
        .status,
      400,
    );
    assert.equal(
      (await h.post(body, { "x-vercel-forwarded-for": "203.0.113.6" })).status,
      400,
    );
    assert.equal(
      (await h.post({ ...body, website: "spam.example" })).status,
      400,
    );
    h.advance(31 * 60_000);
    assert.equal((await h.post(body)).status, 400);
    const fresh = (await (await h.get()).json()).challenge;
    assert.equal((await h.post({ ...body, challenge: fresh })).status, 429);
    assert.equal(h.calls.length, 0);
  });
});
test("independent server validation rejects consent, category, length and callback errors", async () => {
  await harness(async (h) => {
    const challenge = await h.challenge();
    const body = { ...valid, challenge, requestId: randomUUID() };
    for (const patch of [
      { consent: false },
      { nature: "unapproved" },
      { message: "a".repeat(1501) },
      { email: "bad" },
      { contactPreference: "callback", phone: "123" },
      { name: "\u0000" },
    ]) {
      const r = await h.post({ ...body, ...patch });
      assert.equal(r.status, 422);
      assert.equal((await r.json()).received, undefined);
    }
    assert.equal(h.calls.length, 0);
  });
});
test("receipt requires durable database confirmation and contains no personal details", async () => {
  await harness(async (h) => {
    const requestId = randomUUID();
    const challenge = await h.challenge();
    const body = {
      ...valid,
      name: "  Enquiry Test  ",
      email: " Visitor@Example.TEST ",
      challenge,
      requestId,
    };
    const response = await h.post(body);
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), {
      received: true,
      reference: requestId,
    });
    assert.equal(response.headers.get("cache-control"), "no-store");
    const call = h.calls[0];
    assert.equal(
      (call.p_payload as Record<string, string>).email,
      "visitor@example.test",
    );
    assert.match(String(call.p_client_hash), /^[a-f0-9]{64}$/);
    assert.ok(!JSON.stringify(call).includes("203.0.113.5"));
    h.result({ status: "duplicate", id: requestId });
    assert.equal((await h.post(body)).status, 200);
    assert.equal(h.calls[0].p_payload_hash, h.calls[1].p_payload_hash);
    h.result({ status: "conflict" });
    assert.equal((await h.post({ ...body, message: "Changed" })).status, 409);
    h.result({ status: "rate_limited" });
    const limited = await h.post(body);
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get("retry-after"), "3600");
  });
});
test("database failures and malformed acknowledgements never produce success", async () => {
  await harness(async (h) => {
    const body = {
      ...valid,
      challenge: await h.challenge(),
      requestId: randomUUID(),
    };
    for (const [result, status] of [
      [{ error: "private database error" }, 500],
      [{ status: "saved", id: randomUUID() }, 200],
      [{}, 200],
    ] as const) {
      h.result(result, status);
      const r = await h.post(body);
      assert.equal(r.status, 503);
      assert.deepEqual(await r.json(), { error: "temporarily_unavailable" });
    }
  });
});
test("callback submissions permit no email and preserve phone and requested window", async () => {
  await harness(async (h) => {
    const response = await h.post({
      ...valid,
      email: "",
      contactPreference: "callback",
      phone: "+91 98765 43210",
      callbackWindow: "Morning · 9 am–12 pm IST",
      challenge: await h.challenge(),
      requestId: randomUUID(),
    });
    assert.equal(response.status, 201);
    const payload = h.calls[0].p_payload as Record<string, string>;
    assert.equal(payload.phone, "+91 98765 43210");
    assert.equal(payload.email, "");
  });
  assert.equal(
    validateEnquiry({ ...valid, phone: "old callback number" }).values.phone,
    "",
  );
});

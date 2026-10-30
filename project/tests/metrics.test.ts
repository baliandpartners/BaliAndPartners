import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createMetricsHandler } from "../server/metrics.ts";

test("measurement accepts only anonymous bounded events and honours browser privacy", async () => {
  const calls: unknown[] = [];
  const handler = createMetricsHandler(
    {
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SECRET_KEY: "sb_secret_test",
    },
    async (_url, options) => {
      calls.push(JSON.parse(String(options?.body)));
      return new Response("null");
    },
  );
  const server = createServer((req, res) => void handler(req, res));
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}`;
  const send = (body: unknown, headers: Record<string, string> = {}) =>
    fetch(url, {
      method: "POST",
      headers: {
        Origin: "https://www.baliandpartners.in",
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
  try {
    assert.equal((await fetch(url)).status, 405);
    assert.equal(
      (
        await send(
          { event: "page_view", route: "/" },
          { Origin: "https://other.example" },
        )
      ).status,
      403,
    );
    for (const body of [
      null,
      [],
      { event: "personal-email", route: "/" },
      { event: "page_view", route: "/contact?name=person" },
      { event: "page_view", route: "/", email: "private@example.test" },
    ])
      assert.equal((await send(body)).status, 400);
    assert.equal(
      (await send({ event: "page_view", route: "/", extra: "x".repeat(1000) }))
        .status,
      413,
    );
    for (const header of ["DNT", "Sec-GPC"])
      assert.equal(
        (await send({ event: "page_view", route: "/" }, { [header]: "1" }))
          .status,
        204,
      );
    assert.equal(calls.length, 0);
    assert.equal(
      (await send({ event: "page_view", route: "/expertise" })).status,
      204,
    );
    assert.deepEqual(calls, [{ p_event: "page_view", p_route: "/expertise" }]);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

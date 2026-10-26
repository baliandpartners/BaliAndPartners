import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";

const payload = {
  name: "Database Test",
  organisation: "",
  email: "db@example.test",
  phone: "",
  contactPreference: "email",
  callbackWindow: "",
  nature: "Content strategy",
  message: "Database acceptance fixture",
  consent: true,
  privacyVersion: "2026-10-24",
};
const hash = (character: string) => character.repeat(64);

test("PostgreSQL schema enforces private access, atomic quotas, retries and workflow constraints", async (t) => {
  const db = new PGlite();
  try {
    await db.exec(
      "create role anon; create role authenticated; create role service_role bypassrls;",
    );
    const source = await readFile(
      new URL("../supabase/contact_submissions.sql", import.meta.url),
      "utf8",
    );
    // PGlite runs PostgreSQL locally but has no scheduler; production pg_cron is verified separately.
    const core = source.split("-- Supabase supports pg_cron;")[0] + "\ncommit;";
    await db.exec(core);
    const submit = async (
      id: string,
      data = payload,
      client = hash("a"),
      contact = hash("b"),
      digest = hash("c"),
    ) => {
      const result = await db.query<{
        result: { status: string; id?: string };
      }>(
        "select public.submit_website_enquiry($1::uuid,$2::jsonb,$3,$4,$5) as result",
        [id, JSON.stringify(data), digest, client, contact],
      );
      return result.rows[0].result;
    };
    await t.test(
      "anon and authenticated cannot select, insert, update, delete or invoke the RPC",
      async () => {
        for (const role of ["anon", "authenticated"]) {
          await db.exec(`set role ${role}`);
          for (const sql of [
            "select * from public.contact_submissions",
            "insert into public.contact_submissions(id) values(gen_random_uuid())",
            "update public.contact_submissions set status='closed'",
            "delete from public.contact_submissions",
            "select * from public.enquiry_rate_events",
          ]) {
            await assert.rejects(db.exec(sql), /permission denied/);
          }
          await assert.rejects(submit(randomUUID()), /permission denied/);
          await db.exec("reset role");
        }
      },
    );
    await t.test(
      "service-only RPC saves once, returns duplicate receipt and rejects changed retries",
      async () => {
        const id = randomUUID();
        await db.exec("set role service_role");
        assert.equal((await submit(id)).status, "saved");
        assert.equal((await submit(id)).status, "duplicate");
        assert.equal(
          (
            await submit(
              id,
              { ...payload, message: "Different" },
              hash("a"),
              hash("b"),
              hash("d"),
            )
          ).status,
          "conflict",
        );
        await db.exec("reset role");
        const rows = await db.query<{ count: number }>(
          "select count(*)::int as count from public.contact_submissions where id=$1",
          [id],
        );
        assert.equal(rows.rows[0].count, 1);
      },
    );
    await t.test(
      "contact quota persists across requests and duplicate retries do not consume it",
      async () => {
        for (let i = 0; i < 2; i++)
          assert.equal((await submit(randomUUID())).status, "saved");
        assert.equal((await submit(randomUUID())).status, "rate_limited");
        assert.equal(
          (
            await db.query<{ count: number }>(
              "select count(*)::int as count from public.enquiry_rate_events",
            )
          ).rows[0].count,
          3,
        );
      },
    );
    await t.test(
      "IP quota blocks after five accepted requests even for different contacts",
      async () => {
        for (let i = 0; i < 5; i++)
          assert.equal(
            (await submit(randomUUID(), payload, hash("d"), hash(String(i))))
              .status,
            "saved",
          );
        assert.equal(
          (await submit(randomUUID(), payload, hash("d"), hash("e"))).status,
          "rate_limited",
        );
      },
    );
    await t.test(
      "database constraints reject oversized messages and missing callback details",
      async () => {
        await assert.rejects(
          submit(
            randomUUID(),
            { ...payload, message: "x".repeat(1501) },
            hash("e"),
            hash("f"),
          ),
          /check constraint/,
        );
        await assert.rejects(
          submit(
            randomUUID(),
            { ...payload, email: "", contactPreference: "callback" },
            hash("e"),
            hash("f"),
          ),
          /check constraint/,
        );
        await assert.rejects(
          submit(
            randomUUID(),
            { ...payload, consent: false },
            hash("e"),
            hash("f"),
          ),
          /Invalid submission/,
        );
      },
    );
    await t.test(
      "callbacks are stored for private follow-up and valid workflow statuses",
      async () => {
        const id = randomUUID();
        assert.equal(
          (
            await submit(
              id,
              {
                ...payload,
                email: "",
                phone: "+91 98765 43210",
                contactPreference: "callback",
                callbackWindow: "Any working-hour time",
              },
              hash("e"),
              hash("f"),
            )
          ).status,
          "saved",
        );
        await db.query(
          "update public.contact_submissions set status='in_progress',internal_notes='Call requested' where id=$1",
          [id],
        );
        const row = (
          await db.query<{ email: null; phone: string; status: string }>(
            "select email,phone,status from public.contact_submissions where id=$1",
            [id],
          )
        ).rows[0];
        assert.equal(row.email, null);
        assert.equal(row.status, "in_progress");
        await assert.rejects(
          db.query(
            "update public.contact_submissions set status='unknown' where id=$1",
            [id],
          ),
          /check constraint/,
        );
      },
    );
    await t.test(
      "retention deletes old new/closed requests while retaining active follow-up",
      async () => {
        await db.exec(
          "alter table public.contact_submissions disable trigger enquiry_updated_at; update public.contact_submissions set updated_at=now()-interval '181 days'; alter table public.contact_submissions enable trigger enquiry_updated_at;",
        );
        await db.exec(
          "delete from public.contact_submissions where status in ('new','closed') and updated_at < now()-interval '180 days'",
        );
        const rows = await db.query<{ status: string }>(
          "select status from public.contact_submissions",
        );
        assert.equal(rows.rows.length, 1);
        assert.equal(rows.rows[0].status, "in_progress");
      },
    );
  } finally {
    await db.close();
  }
});

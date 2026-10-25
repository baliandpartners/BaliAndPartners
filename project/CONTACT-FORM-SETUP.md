# Enquiry and callback system

The website uses a same-origin Vercel function (`/api/enquiries`) and a private Supabase database. There is no email-draft step and no public database key in the browser. A receipt appears only after the database confirms storage.

## Owner inbox

Project: **Bali Partners Enquiries**, Mumbai (`ap-south-1`), reference `mztwwqfoyiaihktugaqb`.

Open https://supabase.com/dashboard/project/mztwwqfoyiaihktugaqb/editor and choose **contact_submissions**. Only authorised Supabase administrators can view these records. Sort by `created_at` descending, or filter `status = new`. Each row includes the reference, name, organisation, email or callback number, preferred callback window in IST, category, message and consent timestamp.

Change `status` from `new` to `in_progress` while handling a request, then `closed`. Use `internal_notes` for brief follow-up notes; avoid copying sensitive case material into this inbox. `updated_at` changes automatically. Check the inbox regularly: this release records requests but does not send email notifications or place phone calls. A requested callback time is not a confirmed appointment.

The existing paused ContactForm project is untouched. An authentic founder portrait still needs to be supplied before the typographic fallback can be replaced.

## Server configuration

Vercel requires encrypted **server-only** variables:

- `SUPABASE_URL`: the active project's HTTPS URL.
- `SUPABASE_SECRET_KEY`: secret API key or legacy service-role key.
- `ENQUIRY_SIGNING_SECRET`: at least 32 random characters for form challenges and keyed abuse-control hashes.

Never prefix these with `VITE_`, commit them, or paste them into chat. Preview credentials are scoped to the feature branch; production is configured only after successful real preview verification. Vercel builds from `project`, using the repository's `npm run build` and `dist` configuration. API functions are built separately by Vercel.

`supabase/contact_submissions.sql` is a migration for a **fresh** project. It is not a reset script: do not rerun it on a populated schema. It creates private tables, the service-only submission RPC, constraints, transactional quotas, timestamps and a pg_cron retention job. The schema has been applied to the project above. Future changes need a separate versioned migration.

## Request handling and privacy

GET issues a short-lived signed challenge bound to the client network identifier. POST requires an approved same-origin request, JSON within 12 KB, a valid challenge, an empty honeypot, field validation and explicit consent. Requests made immediately after challenge issuance are rejected briefly. On Vercel the server uses the platform-managed client-address header, not the caller's ordinary forwarded-for header.

The database transaction permits at most five submissions per network identifier/hour, three per contact identifier/hour and 100 overall/hour. These are modest-volume inbox limits, not a claim to stop every bot. Hashed abuse identifiers are retained for at most 24 hours; raw IP addresses are not written to these tables. Vercel may retain its own operational logs under its policies.

An idempotency UUID plus payload hash ensures retries of the same request return the original receipt without duplicate rows. Changed content with the same reference is rejected. The client preserves unsent form values in memory during errors, disables editing/submission while sending and never puts enquiry contents in local storage or query strings. Database and server errors are not disclosed to visitors.

New/closed enquiries without an update are deleted after 180 days by the scheduled `website-enquiry-retention` job. Active `in_progress` requests are retained for follow-up and should be reviewed periodically. Check the job in Supabase Cron and confirm it remains active; do not disable retention without reviewing the privacy notice. Free-plan availability is subject to Supabase's limits and pause policies.

## Verification and recovery

- `npm run build`, `npm run lint`, `npm run test:server`, `TEST_SITE_MODE=production npm run test:e2e`.
- `test:server` exercises HTTP validation and PostgreSQL constraints/RLS/transaction behaviour through PGlite. It excludes the scheduler because PGlite has no pg_cron; the actual Supabase job is verified separately.
- Browser form tests mock API responses to exercise waiting, success, errors, callback validation, consent and retry IDs. They do not prove live persistence.
- Before release, use an authorised synthetic enquiry and callback on the hosted preview, verify each private row, retry the identical request to verify one row, verify anonymous read/write/RPC denial, check Cron and remove only those synthetic records. Repeat a smoke test on production after deployment.
- A failed database acknowledgement produces an error, not a success message. Direct email/telephone links remain available for recovery.

The snapshot/static preview server can run the same API locally with server environment variables. Without them it deliberately returns 503 and the form explains unavailability. For frontend-only tests use the explicit API contract fixtures; never deploy a mock persistence service.

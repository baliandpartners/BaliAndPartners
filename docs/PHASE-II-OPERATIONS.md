# Phase II operations

## Enquiries and structured project briefs

Use the authorised Supabase dashboard for **Bali Partners Enquiries**, Table Editor → `contact_submissions`. Filter status `new`, inspect the non-confidential message and optional `project_brief`, then use `in_progress` and `internal_notes` for follow-up and `closed` when finished. Email/callback preference and callback window remain separate from the brief. Requests are not confirmed appointments or engagements. Keep the existing daily 180-day new/closed retention and review active records regularly. No automated email notification or external CRM is configured.

The public form only calls the same-origin Vercel API. Browser roles have no database read or write grants. Server validation, signed browser-session challenges, honeypot, persistent atomic quotas, payload limits and UUID-based idempotency cover all enquiry modes. Optional project details use five bounded enumerations. API failures retain the user's details in the current page and never claim successful receipt.

## Publishing without source-code edits

Supabase Table Editor → `publication_records` is the private editorial workspace. Use named authorised administrator accounts, enable MFA and give project access only to people trusted with enquiries and editorial records. This release does not create public admin accounts or a browser-facing privileged dashboard.

1. Create a `draft` record with an `editorial_owner` and the public article JSON in `document`. Internal notes go in `internal_notes`, never inside public article fields. Follow `project/src/data/publication.ts` for the contract. Required public fields include unique lowercase slug, title, category, excerpt, description, standfirst, sections, author, dates, jurisdiction, verified sources, qualifications and disclaimer. Optional tags (up to eight, 40 characters each), relatedSlugs, reviewedAt and updatedAt are supported.
2. Move to `in_review`. Verify sources against actual authorities, confirm permission and authorship, and obtain the required substantive review. Do not insert invented client work, authorities or testimonials. Samples remain separately labelled and excluded from indexing.
3. After review, set `reviewed_by`, `reviewed_at`, `rights_confirmed=true`, and `status=approved`. The document must be `kind=publication`, `label=Legal perspective`, `approved=true`, with an explicit `indexable` boolean. Any change to the document resets its record to `in_review` and clears approval evidence. Save content changes first, then approve in a separate update.
4. Set status `published` only when ready for public release. In Vercel, redeploy the latest **main** production deployment **without using the existing build cache**. Build-time collection fetches only published, rights-confirmed records; it validates public content and generates article pages, metadata, canonical URLs and sitemap. No code edit is needed. Until redeployment succeeds, the current website remains unchanged.
5. Verify the new article URL, dates, source links, related articles and sitemap on production. A failed build leaves the previous deployment live. To withdraw an article, set `archived` and redeploy. To revise it, edit the document, complete the new review, publish and redeploy. Preserve publishedAt; set updatedAt to the actual revision date. Do not backdate review evidence.

Only allowlisted public fields are written to the generated build file. Owner, reviewer identity, internal notes, keys and draft records are excluded. The generated file is ignored by Git. Production builds fail if the database is unavailable or a published article is invalid. Collection is limited to fewer than 1,000 published records; increase deliberately with pagination if needed. Related links must resolve to another published article or existing sample. No real legal publications have been invented to populate this foundation.

## Anonymous measurement

Table Editor → `website_metrics_daily` contains UTC day, normalised route, event and count. No raw event log, visitor identifier, contact details, query string, referrer or raw IP is stored by this measurement system. Article routes are grouped. A page view includes SPA navigation; repeated visits are not deduplicated. Web Vitals use the maintained `web-vitals` library and count good/needs-improvement/poor bands for the original document route. These counts are not a percentile report and are not unique visitors.

The privacy page provides an opt-out; browser Do Not Track and Global Privacy Control take priority. When browser storage is unavailable measurement is disabled. Enquiry conversion events are emitted only after a confirmed API receipt; client-reported events are directional and can include retries, automated traffic or blocking. For authoritative received-request totals use `contact_submissions`, grouped by created_at and response preference/project_brief. Do not treat anonymous conversion counts as billing or audit data.

The metrics API accepts a strict allowlist of two fields, requires a recognised origin and caps each daily counter. Public roles cannot inspect or modify aggregate tables or call the RPC. A daily job deletes aggregates older than 400 days. Vercel infrastructure logs remain subject to the hosting provider's own policies; application handlers do not log bodies or credentials.

## Release and rollback

Apply `phase_two.sql` once after the original enquiry schema, then `phase_two_retention.sql`. Both are additive to the current private system; the revised enquiry RPC accepts the previous privacy version and clients without project fields. Deploy a tested feature preview, verify real general/callback/project submissions and remove only synthetic test records, then merge the exact tested SHA to main. Keep Vercel Deployment Protection enabled; revoke temporary test bypasses.

Rollback the website with Vercel Instant Rollback to the recorded previous successful deployment. Do not drop new columns/tables or delete legitimate submissions. The original client remains compatible with the expanded database. Publishing changes require their own review/redeploy and can be rolled back to the previous generated snapshot. The separate invitation-only portal proposal is in `CLIENT-PORTAL-PROPOSAL.md`; no portal is deployed.

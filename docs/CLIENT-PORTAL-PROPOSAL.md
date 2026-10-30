# Invitation-only client portal — Phase III technical proposal

Status: architecture only. No portal routes, invitations, accounts or file-upload endpoints are deployed by Phase II.

## Fit with the current platform

Keep the public React/Vite site and Vercel deployment. A separate application on a dedicated portal subdomain can use Supabase Auth, PostgreSQL and private Storage, with Vercel server functions for privileged operations. A separate Supabase project is preferable for confidentiality, operational isolation and independent retention; the current project can accommodate the schema technically, but combining public lead intake and client work increases the impact of a configuration error. Confirm service limits, data location, contractual requirements, backups and operating budget before implementation.

## Identity and invitation lifecycle

Disable public sign-up. A staff administrator creates an invitation for an explicitly named organisation, project and role. Store a hash of a single-use, short-lived invitation token, never a reusable password. Accepting an invitation requires verified email ownership; never infer membership from an email domain. Expire and revoke invitations. Require MFA for staff administrators and offer or mandate it for clients according to the engagement. Use secure, HttpOnly session cookies, CSRF protection, refresh-token rotation, inactivity limits and immediate membership revocation. Choose and configure an approved transactional email provider before enabling invitations or resets.

## Tenant boundaries and permissions

Use organisations, memberships, projects, project_memberships, topics, milestones, draft_versions, review_comments, approvals, deliverables and audit_events. Every project-owned record includes organisation_id and project_id, protected by foreign keys. PostgreSQL RLS checks authenticated auth.uid() against active membership and the exact project grant. Membership changes must go through authorised server functions, never a client-editable profile field.

Roles: client viewer (read approved deliverables), client reviewer (review assigned drafts), client approver (explicit approval authority), staff contributor (assigned projects), project lead (workflow and membership requests), administrator (account operations). Scope staff access to assigned organisations too. A service-role key bypasses RLS: reserve it for narrowly checked administrative jobs, not ordinary user reads. Public enquiry records must never become portal records automatically or be visible to clients.

## Files and confidential material

Private Storage buckets only; paths include opaque organisation/project identifiers. Storage RLS verifies project membership. Generate short-lived download URLs only after authorisation, with no sensitive titles in URLs. Enforce file size and type limits, inspect actual MIME/content, quarantine uploads, scan for malware, and deny executable/active content. Render previews in a sandboxed, separate origin if necessary. Do not place documents in public Vercel assets, application logs, analytics, email bodies or browser persistent storage. Define deletion, legal holds and backup expiry per engagement. Confirm subprocessors, location, encryption and access obligations before accepting client materials.

## Workflow and audit

Topics move from submitted to scoped to accepted; a topic submission does not itself commission work. Projects have agreed milestones and owners. Drafts are immutable, numbered versions with checksums. Comments and approvals point to a specific version, not a mutable current file. Final approval requires an explicit action by an authorised approver, with a confirmation showing the exact document version. Subsequent edits create a new version and invalidate its approval state. Record server-generated audit events for invitations, membership changes, uploads, downloads, review transitions and approvals. Limit audit access; avoid copying document contents into logs.

## Reliability and operations

Use idempotent mutations, database transactions and background work for scanning and notification. Keep audit history append-only through application permissions. Establish backups, restoration drills, incident response, key rotation, monitoring and dependency updates. Set service-level expectations from an agreed support model; do not advertise response or recovery guarantees before measuring them. Notification failure must not undo a saved review or silently lose an approval.

## Required security acceptance

Test two independent organisations and all role combinations. Attempt cross-tenant reads, inserts, updates, deletes, RPCs and Storage access by guessed UUID/path and expired signed URL. Test revoked membership with an existing session, concurrent invitation acceptance, account recovery, CSRF, upload polyglots, stored script injection, stale-version approvals and duplicate retries. Verify public/anonymous roles cannot enumerate any portal resource. Run a separate security review and restore test before real confidential work is accepted.

## Delivery order

1. Confirm confidentiality, tenancy, retention, users, administrators and operational responsibility; agree a threat model and data map.
2. Build invitations, MFA, membership RLS and audit in an isolated staging environment; pass cross-tenant tests.
3. Add topics, milestones and immutable draft reviews without file uploads; test workflow and permissions.
4. Add scanned private uploads and deliverables; verify download controls and retention.
5. Pilot with a small, explicitly invited client group and non-sensitive test material. Complete security review, backup drill and operational handoff before broader release.

Further Phase III candidates: an editorial admin interface with scoped roles and preview/approval screens; opt-in submission notifications through an approved provider; a staff enquiry queue with assignment and reminders; richer consent-aware reporting. These should build on the private database and publishing contract delivered in Phase II.

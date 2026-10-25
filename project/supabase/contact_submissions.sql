-- Apply once to a NEW active Supabase project using the SQL Editor or Management API.
-- No browser role may read OR write this database. Only the server RPC accepts submissions.
begin;

create table public.contact_submissions (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  organisation text check (organisation is null or char_length(organisation) <= 120),
  email text check (email is null or (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  phone text check (phone is null or (char_length(phone) <= 32 and phone ~ '^[+0-9 ().-]+$' and char_length(regexp_replace(phone, '[^0-9]', '', 'g')) between 7 and 15)),
  contact_preference text not null check (contact_preference in ('email', 'callback')),
  callback_window text check (callback_window is null or callback_window in ('Any working-hour time', 'Morning · 9 am–12 pm IST', 'Afternoon · 12–5 pm IST')),
  nature text not null check (nature in ('Legal research & analysis', 'Legal content & editorial', 'Thought leadership', 'Content strategy', 'Professional communications', 'A broader conversation')),
  message text not null check (char_length(btrim(message)) between 1 and 1500),
  consent_at timestamptz not null default now(),
  privacy_version text not null check (privacy_version = '2026-10-24'),
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  internal_notes text not null default '' check (char_length(internal_notes) <= 5000),
  payload_hash text not null check (payload_hash ~ '^[a-f0-9]{64}$'),
  check ((contact_preference = 'email' and email is not null and phone is null and callback_window is null)
    or (contact_preference = 'callback' and phone is not null and callback_window is not null))
);
create index contact_submissions_inbox on public.contact_submissions(status, created_at desc);
alter table public.contact_submissions enable row level security;
revoke all on public.contact_submissions from public, anon, authenticated;
-- Supabase dashboard administrators retain management access; never expose the service key.
grant select, insert, update, delete on public.contact_submissions to service_role;

create table public.enquiry_rate_events (
  request_id uuid primary key,
  client_hash text not null check (client_hash ~ '^[a-f0-9]{64}$'),
  contact_hash text not null check (contact_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
create index enquiry_rate_events_time on public.enquiry_rate_events(created_at);
alter table public.enquiry_rate_events enable row level security;
revoke all on public.enquiry_rate_events from public, anon, authenticated;
grant select, insert, delete on public.enquiry_rate_events to service_role;

create function public.touch_enquiry_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end;
$$;
revoke all on function public.touch_enquiry_updated_at() from public, anon, authenticated;
create trigger enquiry_updated_at before update on public.contact_submissions
for each row execute function public.touch_enquiry_updated_at();

create function public.submit_website_enquiry(
 p_request_id uuid, p_payload jsonb, p_payload_hash text, p_client_hash text, p_contact_hash text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare existing_hash text;
begin
  if p_payload->>'consent' is distinct from 'true' or p_payload->>'privacyVersion' is distinct from '2026-10-24'
    or p_payload_hash !~ '^[a-f0-9]{64}$' or p_client_hash !~ '^[a-f0-9]{64}$' or p_contact_hash !~ '^[a-f0-9]{64}$'
  then raise exception 'Invalid submission'; end if;
  -- Low-volume public inbox: one transaction lock makes rate limits/idempotency atomic.
  perform pg_catalog.pg_advisory_xact_lock(194206, 1);
  select payload_hash into existing_hash from public.contact_submissions where id = p_request_id;
  if found then
    if existing_hash = p_payload_hash then return jsonb_build_object('status', 'duplicate', 'id', p_request_id); end if;
    return jsonb_build_object('status', 'conflict');
  end if;
  delete from public.enquiry_rate_events where created_at < now() - interval '24 hours';
  if (select count(*) from public.enquiry_rate_events where created_at > now() - interval '1 hour') >= 100
    or (select count(*) from public.enquiry_rate_events where client_hash = p_client_hash and created_at > now() - interval '1 hour') >= 5
    or (select count(*) from public.enquiry_rate_events where contact_hash = p_contact_hash and created_at > now() - interval '1 hour') >= 3
  then return jsonb_build_object('status', 'rate_limited'); end if;
  insert into public.contact_submissions
    (id, name, organisation, email, phone, contact_preference, callback_window, nature, message, privacy_version, payload_hash)
  values
    (p_request_id, p_payload->>'name', nullif(p_payload->>'organisation', ''), nullif(p_payload->>'email', ''),
     nullif(p_payload->>'phone', ''), p_payload->>'contactPreference', nullif(p_payload->>'callbackWindow', ''),
     p_payload->>'nature', p_payload->>'message', p_payload->>'privacyVersion', p_payload_hash);
  insert into public.enquiry_rate_events(request_id, client_hash, contact_hash) values (p_request_id, p_client_hash, p_contact_hash);
  return jsonb_build_object('status', 'saved', 'id', p_request_id);
end;
$$;
revoke all on function public.submit_website_enquiry(uuid,jsonb,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_website_enquiry(uuid,jsonb,text,text,text) to service_role;

-- Supabase supports pg_cron; fail the migration if retention cannot be scheduled.
create extension if not exists pg_cron;
select cron.schedule('website-enquiry-retention', '17 3 * * *', $job$
  delete from public.enquiry_rate_events where created_at < now() - interval '24 hours';
  delete from public.contact_submissions where status in ('new', 'closed') and updated_at < now() - interval '180 days';
$job$);
commit;

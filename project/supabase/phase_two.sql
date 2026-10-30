-- Additive Phase II migration. Apply once after contact_submissions.sql.
begin;
alter table public.contact_submissions add column project_brief jsonb;
alter table public.contact_submissions drop constraint contact_submissions_privacy_version_check;
alter table public.contact_submissions add constraint contact_submissions_privacy_version_check check (privacy_version in ('2026-10-24','2026-10-30'));
alter table public.contact_submissions add constraint project_brief_valid check (project_brief is null or (
 jsonb_typeof(project_brief) = 'object' and octet_length(project_brief::text) < 2000
 and project_brief ?& array['profession','scope','engagement','volume','timeline']
 and project_brief - array['profession','scope','engagement','volume','timeline'] = '{}'::jsonb
 and project_brief->>'profession' in ('Law firm','Partner or senior advocate','Chambers','Legal publisher','In-house legal team','Other professional team')
 and project_brief->>'scope' in ('A defined document or question','A series of related pieces','An existing content library','Help defining the brief')
 and project_brief->>'engagement' in ('One-off assignment','Recurring support')
 and project_brief->>'volume' in ('One piece or research note','2–5 pieces','6 or more pieces','To be agreed')
 and project_brief->>'timeline' in ('Within two weeks','Within a month','Over the next quarter','Flexible / to be agreed')
 and not jsonb_path_exists(project_brief, '$.* ? (@ == null)')
));
create or replace function public.submit_website_enquiry(
 p_request_id uuid, p_payload jsonb, p_payload_hash text, p_client_hash text, p_contact_hash text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare existing_hash text;
begin
  if p_payload->>'consent' is distinct from 'true' or coalesce(p_payload->>'privacyVersion', '') not in ('2026-10-24', '2026-10-30')
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
    (id, name, organisation, email, phone, contact_preference, callback_window, nature, message, privacy_version, payload_hash, project_brief)
  values
    (p_request_id, p_payload->>'name', nullif(p_payload->>'organisation', ''), nullif(p_payload->>'email', ''),
     nullif(p_payload->>'phone', ''), p_payload->>'contactPreference', nullif(p_payload->>'callbackWindow', ''),
     p_payload->>'nature', p_payload->>'message', p_payload->>'privacyVersion', p_payload_hash, p_payload->'projectBrief');
  insert into public.enquiry_rate_events(request_id, client_hash, contact_hash) values (p_request_id, p_client_hash, p_contact_hash);
  return jsonb_build_object('status', 'saved', 'id', p_request_id);
end;
$$;
revoke all on function public.submit_website_enquiry(uuid,jsonb,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_website_enquiry(uuid,jsonb,text,text,text) to service_role;


create table public.publication_records (
 id uuid primary key default gen_random_uuid(),
 status text not null default 'draft' check (status in ('draft','in_review','approved','published','archived')),
 editorial_owner text not null check (char_length(btrim(editorial_owner)) between 1 and 120),
 reviewed_by text,
 reviewed_at timestamptz,
 rights_confirmed boolean not null default false,
 document jsonb not null default '{}'::jsonb check (jsonb_typeof(document) = 'object' and octet_length(document::text) <= 100000),
 internal_notes text not null default '' check (char_length(internal_notes)<=5000),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 check (status not in ('approved','published') or (reviewed_by is not null and char_length(btrim(reviewed_by)) > 0 and reviewed_at is not null and rights_confirmed and coalesce(document->>'kind', '') = 'publication' and coalesce(document->>'approved', '') = 'true'))
);
alter table public.publication_records enable row level security;
revoke all on public.publication_records from public, anon, authenticated;
grant select on public.publication_records to service_role;
create function public.guard_publication_review() returns trigger language plpgsql set search_path = '' as $$
begin
 new.updated_at := now();
 if new.document is distinct from old.document then
  new.status := 'in_review'; new.reviewed_by := null; new.reviewed_at := null; new.rights_confirmed := false;
 end if;
 return new;
end; $$;
revoke all on function public.guard_publication_review() from public, anon, authenticated;
create trigger publication_review before update on public.publication_records for each row execute function public.guard_publication_review();
commit;

begin;
create table public.website_metrics_daily (
 day date not null default (now() at time zone 'UTC')::date,
 route text not null,
 event text not null,
 count bigint not null default 0 check (count between 0 and 100000),
 primary key(day,route,event)
);
alter table public.website_metrics_daily enable row level security;
revoke all on public.website_metrics_daily from public,anon,authenticated;
grant select on public.website_metrics_daily to service_role;
create function public.record_website_metric(p_event text,p_route text) returns void
language plpgsql security definer set search_path='' as $$
begin
 if p_event not in ('page_view','discovery_complete','brief_start','brief_received','enquiry_received','callback_received','lcp_good','lcp_needs_improvement','lcp_poor','cls_good','cls_needs_improvement','cls_poor','inp_good','inp_needs_improvement','inp_poor')
 or p_route not in ('/','/expertise','/expertise/legal-research','/expertise/legal-content-editorial','/expertise/thought-leadership','/expertise/content-strategy','/expertise/professional-communications','/approach','/insights','/insights/article','/about','/contact','/privacy','/terms','/404')
 or p_event is null or p_route is null then raise exception 'Invalid measurement'; end if;
 insert into public.website_metrics_daily(day,route,event,count) values ((now() at time zone 'UTC')::date,p_route,p_event,1)
 on conflict(day,route,event) do update set count = least(public.website_metrics_daily.count+1,100000);
end; $$;
revoke all on function public.record_website_metric(text,text) from public,anon,authenticated;
grant execute on function public.record_website_metric(text,text) to service_role;
commit;

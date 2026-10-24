-- Run in the SQL Editor of a NEW active Supabase project.
-- Website submissions can be INSERTED anonymously but cannot be read publicly.
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  organisation text check (organisation is null or char_length(organisation) <= 120),
  email text not null check (char_length(email) between 3 and 254),
  nature text not null check (char_length(nature) between 1 and 100),
  message text not null check (char_length(message) between 1 and 1500)
);
alter table public.contact_submissions enable row level security;
revoke all on public.contact_submissions from anon, authenticated;
grant insert on public.contact_submissions to anon;
drop policy if exists "Website visitors may submit an enquiry" on public.contact_submissions;
create policy "Website visitors may submit an enquiry"
  on public.contact_submissions for insert to anon
  with check (true);
-- There are intentionally NO public SELECT, UPDATE or DELETE policies.
-- View incoming submissions privately in Supabase Dashboard > Table Editor.
-- Rate limiting and bot mitigation are recommended before production launch.

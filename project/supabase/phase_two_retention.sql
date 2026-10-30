-- Run after phase_two.sql; fails if the existing Supabase scheduler is unavailable.
select cron.schedule('website-metrics-retention', '27 3 * * *', $job$
 delete from public.website_metrics_daily where day < (now() at time zone 'UTC')::date - 400;
$job$);

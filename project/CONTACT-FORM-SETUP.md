# Contact form integration

A new active Supabase project is needed. The previous project named `ContactForm` cannot be restored because it has been paused for more than 400 days.

1. Create a new active Supabase project and run [contact_submissions.sql](./supabase/contact_submissions.sql) in its SQL Editor.
2. In Vercel, set **Root Directory** to `project`, build command `npm run build`, output directory `dist`.
3. In Vercel project environment variables set `VITE_SUPABASE_URL` to your new project URL and `VITE_SUPABASE_PUBLISHABLE_KEY` to its **publishable** key. Do not use any secret or service-role key.
4. Redeploy. Confirm a real test enquiry arrives in Supabase Table Editor. Verify unauthenticated read access is denied before production use.
5. Add abuse protection (CAPTCHA, rate limiting, or server-side submission proxy) to reduce spam. Do not publish an admin listing of submissions.

Current integration returns a clear error and offers email if the database is unconfigured or unavailable. The frontend never has admin database permissions.

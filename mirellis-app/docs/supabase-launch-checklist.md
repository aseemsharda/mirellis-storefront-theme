# Supabase launch checklist

This app is intentionally not considered data-connected until every item below is complete.

1. Create or select a Supabase project for Mirellis.
2. Add these Vercel environment variables in development, preview and production, then pull them locally:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Link the repository to that Supabase project and apply `supabase/migrations/20260825143225_mirellis_user_journey.sql`.
4. In Supabase Auth URL Configuration, set the Site URL to `https://app.mirellis.in` and add the production and preview URLs to Redirect URLs.
5. Keep the standard Supabase email templates unless a custom SMTP provider is intentionally configured. The app uses the standard magic-link flow so new free-plan projects work without template customization.
6. Confirm email sign-in, cross-device route restore, own-row-only access, sign-out, and the inability to read another user’s rows through the Data API.

Never place a Supabase `service_role` or secret key in a `NEXT_PUBLIC_` variable.

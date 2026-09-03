# Supabase setup

Phase 1 needs a Supabase project for email/password authentication. Use your own project. Do not copy keys from another environment.

## Create a project

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a new project.
3. Wait until the database is ready.

## Enable email authentication

1. Go to **Authentication → Providers → Email**.
2. Enable **Email**.
3. For local development you may disable **Confirm email**. Leave it enabled if you want to test the `/auth/callback` confirmation flow.

## URL configuration

Under **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

Add production URLs later when you deploy.

## Application keys

From **Project Settings → API Keys**:

| LetsVideo env var | Supabase dashboard name |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (formerly the anon key) |

Copy `.env.example` to `.env.local` and paste those two values.

Do not put the secret key (formerly `service_role`) in any `NEXT_PUBLIC_` variable. Phase 1 does not use it.

## What you do not need yet

- Database migrations
- Storage buckets
- Edge Functions
- Row Level Security policies for family tables (those arrive in Phase 2)

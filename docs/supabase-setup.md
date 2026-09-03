# Supabase setup

LetsVideo uses Supabase for authentication and family metadata. Use your own project. Do not copy keys from another environment.

## Create a project

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a new project.
3. Wait until the database is ready.

## Enable email authentication

1. Go to **Authentication → Providers → Email**.
2. Enable **Email**.
3. For local development you may disable **Confirm email**. Leave it enabled if you want to test the `/auth/callback` confirmation flow.

Invite emails still work when Confirm email is off. `inviteUserByEmail` sends its own invite message.

## URL configuration

Under **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000`
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/**`

The wildcard helps invite redirects that include a `next=/accept-invite/...` query parameter.

## Application keys

From **Project Settings → API Keys**:

| LetsVideo env var | Supabase dashboard name |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (formerly the anon key) |
| `SUPABASE_SECRET_KEY` | Secret key (formerly the service_role key) |
| `NEXT_PUBLIC_APP_URL` | Your app origin, e.g. `http://localhost:3000` |

Put these in `.env` or `.env.local`.

Never put `SUPABASE_SECRET_KEY` in any `NEXT_PUBLIC_` variable. It is only used on the server for sending invites.

## Apply Phase 2 migrations

1. Open Supabase Dashboard → **SQL Editor**.
2. Paste the contents of [`supabase/migrations/20260903000000_family_system.sql`](../supabase/migrations/20260903000000_family_system.sql).
3. Run the script.

The script is idempotent (`if not exists` / `create or replace` / `drop policy if exists`), so it is safe to re-run if `profiles` or other objects already exist.

If an old table uses `varchar` ids (from earlier prototypes), the script renames it to `*_legacy_varchar` and creates the new UUID tables. Old data is kept under the legacy name and is not used by the app.

This creates:

- `profiles`
- `families`
- `family_members`
- `family_invitations`
- RLS policies
- helper functions `create_family` and `accept_family_invitation`

If you already signed up before applying the migration, the script backfills your `profiles` row from `auth.users`.

## Invite email template tip

Confirming the invite email only creates/logs in the auth user. Joining the family happens when the app accepts the invitation token.

Recommended Invite template link:

```html
<a href="{{ .ConfirmationURL }}">Accept the invite</a>
```

`ConfirmationURL` already includes the `redirect_to` we pass from the app (`/auth/callback?next=/accept-invite/...`).

If redirects ignore that value, also check that Redirect URLs include `http://localhost:3000/**`.

After a successful invite click, the app should auto-accept and open the family. If the invitee only lands on `/home`, they will see **Pending invitations for you** and can accept from there.

### Re-inviting the same email

`inviteUserByEmail` only sends an Invite email the **first** time that address is created in Auth. If you cancel a pending family invitation and invite the same email again, Supabase will usually **not** send another Invite email because the auth user already exists.

In that case the Members page shows an accept link to copy. Open:

`http://localhost:3000/accept-invite/<token>`

First-time invitees can **create a password and join** on that page even if the email link expired. People who already set a password can switch to **Sign in & join**.

## What you do not need yet

- Storage buckets
- Edge Functions
- AWS resources
- AI features

# Development

## Commands

```bash
npm install
cp .env.example .env.local
# edit .env.local — see docs/supabase-setup.md

npm run dev
npm run lint
npm run typecheck
npm run build
```

`npm run dev` starts Next.js only. It does not apply Terraform or run database migrations.

## Environment

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

If these are missing, creating a Supabase client throws an error that names the variables and points at this setup. AWS keys must not be added to `.env.local`.

## Local URLs

| Path | Who can open it |
| --- | --- |
| `/` | Anyone |
| `/login`, `/signup` | Signed-out users (signed-in users are redirected to `/home`) |
| `/home` | Signed-in users |
| `/auth/callback` | Supabase email confirmation |

## Checks before a pull request

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build`
4. Sign up, sign out, and sign in against your own Supabase project

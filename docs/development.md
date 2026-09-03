# Development

## Commands

```bash
npm install
cp .env.example .env.local
# edit .env.local — see docs/supabase-setup.md

# Apply supabase/migrations/*.sql in the Supabase SQL Editor before using families

npm run dev
npm run lint
npm run typecheck
npm run build
```

`npm run dev` starts Next.js only. It does not apply Terraform or database migrations automatically.

## Environment

Required in `.env` / `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY` is required for sending family invitations. AWS keys must not be added here.

## Local URLs

| Path | Who can open it |
| --- | --- |
| `/` | Anyone |
| `/login`, `/signup` | Signed-out users |
| `/home` | Signed-in users |
| `/family/[familyId]` | Family members |
| `/family/[familyId]/members` | Family members |
| `/accept-invite/[token]` | Signed-in invitee |
| `/auth/callback` | Supabase email / invite confirmation |

## Phase 2 smoke test

1. Apply the family migration in the SQL Editor.
2. Sign in and create a family on `/home`.
3. Open **Members** and invite a second email.
4. Accept the invite from that account via the email link or the accept URL.
5. Confirm the second user can open the family and cannot invite unless their role is owner/admin.

## Phase 3 infrastructure

```bash
cd infrastructure/environments/default
terraform init
terraform plan
# terraform apply only when you intentionally want AWS resources
```

See [aws-setup.md](aws-setup.md).

## Checks before a pull request

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build`
4. Create family, invite, accept, and remove/cancel against your own Supabase project
5. If you touched Terraform: `terraform plan` in `infrastructure/environments/default`

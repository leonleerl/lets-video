# LetsVideo

LetsVideo is a private, self-hosted family video platform. Clone the repository, connect your own AWS and Supabase accounts, and run a YouTube-like library that only your family can see.

It is not a public social network. It does not depend on any personal domain. You deploy it with your own cloud accounts.

AI features are intentionally out of scope until the core video platform works.

## Architecture

```text
                        Next.js
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
         Supabase      Media API      CloudFront
         (auth +       (Terraform     (Terraform
          metadata)     stub API)      private CDN)
```

**Now (Phase 1–3):** Next.js App Router, Supabase Auth, family spaces / invitations / RLS, and Terraform for the AWS media backbone (S3, SQS, Lambda stubs, API Gateway, CloudFront).

**Later:** multipart upload, real MediaConvert jobs, signed HLS playback, likes, albums, tags.

See [docs/architecture.md](docs/architecture.md) and [docs/aws-setup.md](docs/aws-setup.md).

## Prerequisites

- Node.js 20+
- npm
- A Supabase project you control
- For Phase 3 infrastructure: AWS CLI + Terraform `>= 1.5`

## Quick start

```bash
git clone https://github.com/leonleerl/lets-video.git
cd lets-video
npm install
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SECRET_KEY=
```

Apply [`supabase/migrations/20260903000000_family_system.sql`](supabase/migrations/20260903000000_family_system.sql) in the Supabase SQL Editor. Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Supabase dashboard steps are in [docs/supabase-setup.md](docs/supabase-setup.md). Day-to-day commands are in [docs/development.md](docs/development.md). AWS infrastructure is in [docs/aws-setup.md](docs/aws-setup.md).

## AWS infrastructure (Phase 3)

```bash
cd infrastructure/environments/default
terraform init
terraform plan
# terraform apply   # only when you want real AWS resources
```

## Security

- Never commit AWS keys, Supabase secret keys, or `.env.local`.
- Never expose `SUPABASE_SECRET_KEY` (or any server secret) with a `NEXT_PUBLIC_` prefix.
- AWS credentials belong in the standard credential chain (CLI profile, SSO, environment) — not in application env files.

## Cost

The AWS design is serverless so idle cost stays low. Until you `terraform apply`, local development only needs Next.js and Supabase. After apply, S3 / CloudFront / API Gateway / Lambda create small ongoing costs even before uploads.

## Contributing

This repository is being rebuilt in phases. Please do not add AI providers, FastAPI services, or AWS shortcuts until the matching phase.

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
         (auth +       (later)        (later)
          metadata)
```

**Now (Phase 1):** Next.js App Router, Supabase Auth, environment validation, marketing and signed-in shells.

**Later:** family spaces and RLS, AWS S3 / MediaConvert / CloudFront HLS, likes, albums, tags.

See [docs/architecture.md](docs/architecture.md).

## Prerequisites

- Node.js 20+
- npm
- A Supabase project you control

AWS CLI and Terraform are not required until the infrastructure phase.

## Quick start

```bash
git clone https://github.com/leonleerl/lets-video.git
cd lets-video
npm install
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Supabase dashboard steps are in [docs/supabase-setup.md](docs/supabase-setup.md). Day-to-day commands are in [docs/development.md](docs/development.md).

## Security

- Never commit AWS keys, Supabase secret keys, or `.env.local`.
- Never expose `SUPABASE_SECRET_KEY` (or any server secret) with a `NEXT_PUBLIC_` prefix.
- AWS credentials belong in the standard credential chain (CLI profile, SSO, environment) — not in application env files.

## Cost

The long-term AWS design is serverless so idle cost stays low. Phase 1 only uses Next.js locally and a Supabase project.

## Contributing

This repository is being rebuilt in phases. Please do not add AI providers, FastAPI services, or AWS shortcuts until the matching phase.

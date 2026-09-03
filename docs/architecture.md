# Architecture

LetsVideo is a self-hosted private family video platform. Application identity and relational data live in Supabase. Media storage, transcoding, and private playback will live on AWS.

## Current status

Phase 1–3 are complete:

- Next.js App Router at the repository root
- Supabase browser / server / proxy / admin clients
- Email and password authentication
- Profiles, families, memberships, invitations
- Row Level Security and security-definer helpers
- Family dashboard, member management, invite accept flow
- Environment validation for public and secret Supabase values
- Terraform for AWS media backbone (S3, SQS, MediaConvert role, Lambda stubs, API Gateway, CloudFront)

Not built yet:

- Direct-to-S3 multipart upload
- Real MediaConvert job submission and status → DB updates
- HLS playback with signed cookies
- Social features (likes, comments, albums, tags)
- Installer CLI
- Any AI features

## Target system

```text
                        Next.js
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
         Supabase      Media API      CloudFront
             |             |             |
             |             v             v
             |         S3 Source      S3 Media
             |             |
             |             v
             |            SQS → Lambda → MediaConvert
             |
             +------ application metadata
```

Next.js owns UI, auth session cookies, and later server-side authorization helpers. Supabase owns users and family metadata with RLS. AWS owns large files and the transcode pipeline. There is no always-on FastAPI or ECS service.

## Application layout

```text
app/
  (marketing)/              public landing page
  (auth)/                   login and signup
  home/                     family list + create
  family/[familyId]/         family dashboard and members
  accept-invite/[token]/    accept invitation
  auth/callback/            PKCE / invite confirmation
lib/
  supabase/                 browser, server, proxy, admin clients
  family/                   queries, actions, types
  env.ts                    public + secret env validation
proxy.ts                    session refresh and route guards
supabase/migrations/        SQL for profiles/families/RLS
infrastructure/             Terraform modules + default environment
functions/                  Lambda stubs (media-api, submit/status)
```

Provider-specific code stays behind `lib/supabase` and `lib/family`. UI components do not import the AWS SDK. AWS setup steps are in [aws-setup.md](aws-setup.md).

## Auth and family flow

1. Browser signs in or signs up with the Supabase publishable key.
2. `@supabase/ssr` stores the session in cookies.
3. `proxy.ts` calls `getUser()` on each matched request so tokens refresh before a Server Component renders.
4. Protected routes: `/home`, `/family/*`. `/accept-invite/*` is public so invitees can open the link before signing in.
5. Creating a family calls `create_family()` and inserts the owner membership.
6. Invites create a `family_invitations` row, then use `inviteUserByEmail` with the secret key.
7. Accepting an invite calls `accept_family_invitation(token)` after email match checks.

## Why the Python API was removed

The previous FastAPI app called Supabase with the service role key and had no authentication. That bypasses Row Level Security and is not a production foundation. Business data will be accessed from Next.js and, later, from AWS Lambdas that verify a user JWT.

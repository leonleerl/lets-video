# Architecture

LetsVideo is a self-hosted private family video platform. Application identity and relational data live in Supabase. Media storage, transcoding, and private playback will live on AWS.

## Current status

Phase 1 is complete:

- Next.js App Router at the repository root
- Supabase browser / server / proxy clients
- Email and password authentication
- Marketing page, login, signup, and a signed-in `/home` shell
- Environment validation for public Supabase values

Not built yet:

- Families, memberships, invitations, and Row Level Security
- AWS infrastructure (S3, CloudFront, MediaConvert, Lambda, SQS)
- Direct-to-S3 multipart upload
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

## Application layout (Phase 1)

```text
app/
  (marketing)/     public landing page
  (auth)/          login and signup
  home/            signed-in placeholder
  auth/callback/   PKCE email confirmation
lib/
  supabase/        browser, server, and proxy clients
  env.ts           public env validation
  auth/            sign-out action and error messages
proxy.ts           Next.js 16 session refresh and route guards
```

Provider-specific code stays behind `lib/supabase`. UI components do not import the AWS SDK.

## Auth flow

1. Browser signs in or signs up with the Supabase publishable key.
2. `@supabase/ssr` stores the session in cookies.
3. `proxy.ts` calls `getUser()` on each matched request so tokens refresh before a Server Component renders.
4. Unauthenticated visits to `/home` redirect to `/login`.
5. Email confirmation returns through `/auth/callback`, which exchanges the PKCE code for a session.

The Supabase secret key is not read in Phase 1.

## Why the Python API was removed

The previous FastAPI app called Supabase with the service role key and had no authentication. That bypasses Row Level Security and is not a production foundation. Business data will be accessed from Next.js and, later, from AWS Lambdas that verify a user JWT.

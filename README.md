# Let's Video — Overall Project Plan

## 1. Project Vision

Let's Video is a video streaming platform Starter Kit built on AWS cloud architecture. Its goal is to help users quickly stand up:

- A private family video site
- An internal company training video platform
- A cross-border video sharing platform
- A private video knowledge base
- A team video management system

Users don't need to build a complex video system from scratch. They only need to run:

```bash
npx create-letsvideo-app
```

to instantly get a fully working video streaming platform.

------

# 2. Core Goals

The core philosophy of Let's Video:

> Empower developers and teams to quickly own their own private video platform on AWS.

The focus of this project is NOT a "generic video website", but rather:

# An AWS-native video streaming platform.

The project showcases:

- Cloud Engineering
- DevOps
- Infrastructure as Code
- Serverless Architecture
- Event-driven Architecture
- Full Stack Development
- AI Workflow

------

# 3. Tech Stack

## Frontend

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- shadcn/ui

------

## Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Redis

------

## Cloud Services (AWS)

- AWS S3
- AWS CloudFront
- AWS Lambda
- AWS MediaConvert
- AWS Transcribe

------

## Infrastructure Management

- Terraform

------

## Containerization

- Docker
- Docker Compose

------

## AI & Agents (Future)

- OpenAI API
- Claude API
- LangGraph
- RAG
- Vector Database

------

# 4. Core Features

## 1. Video Upload System

Users can:

- Upload MP4 videos
- Manage video catalogs
- Delete videos
- Edit video metadata

Videos are automatically uploaded to AWS S3.

------

## 2. Automatic HLS Transcoding System

After a video is uploaded:

```text
S3 Upload
   ↓
Lambda Trigger
   ↓
MediaConvert
   ↓
HLS files generated
```

Output:

```text
.m3u8
.ts
```

This enables:

- Adaptive bitrate streaming
- Low latency playback overseas
- Reduced buffering
- Cross-border viewing support

------

# 5. Global Playback Optimization

Through:

- AWS CloudFront CDN
- HLS Streaming
- S3 Private Bucket

We achieve:

- Optimized access from China
- Optimized access from Japan
- Optimized access from Australia
- Optimized access from the US

So users around the world can watch smoothly.

------

# 6. User System

## Root User (Administrator)

At project initialization:

```bash
Root Username:
Root Password:
```

The administrator can:

- Create users
- Delete users
- Manage videos
- Delete comments
- Reset passwords

------

## Regular Users

Regular users can:

- Sign in
- Change their password
- Upload videos
- Like videos
- Comment on videos
- Delete their own comments

------

# 7. Comment System

Supports:

- Video comments
- Deleting comments
- Liking comments (future)
- Replying to comments (future)

Database models:

```text
User
Video
Comment
Like
```

------

# 8. Subtitle System (Key Feature)

## Automatic Subtitle Generation

Workflow:

```text
Upload Video
   ↓
AWS Transcribe
   ↓
Subtitles generated
```

Supported languages:

- Japanese
- Chinese
- English

------

## AI Subtitle Translation

In the future, via:

- OpenAI
- Claude

We will enable:

```text
JA → ZH
EN → JA
EN → ES
```

for automatic multi-language subtitle translation.

------

# 9. AI Features (Future Focus)

## 1. AI Video Summarization

After upload, automatically generate:

- Video title
- Video description
- Video tags
- Video keywords

------

## 2. AI Video Search

Users can search:

```text
Tokyo Disneyland
Family Trip 2025
Sushi
```

The system uses:

- Subtitle search
- Embeddings
- Vector Database
- RAG

to return relevant videos.

------

## 3. AI Video Timeline Search

For example, searching:

```text
"Sushi"
```

returns:

```text
00:12:33 "Sushi" appears
```

Similar to YouTube transcript search.

------

# 10. LangGraph Use Cases

## AI Workflow Pipeline

```text
Upload Video
   ↓
Video Transcoding
   ↓
Subtitle Generation
   ↓
Subtitle Translation
   ↓
AI Summary Generation
   ↓
Tag Generation
```

------

## AI Video Agent (Future)

User asks:

```text
"Find me the video of Tokyo Tower"
```

The Agent automatically:

- Searches subtitles
- Searches metadata
- Searches embeddings
- Returns the video and timestamp

------

# 11. The Role of Terraform (Core Highlight)

Terraform is used to:

- Automatically create S3 Buckets
- Automatically create CloudFront distributions
- Automatically create IAM Roles
- Automatically create Lambda functions
- Automatically configure MediaConvert permissions

Users only need to run:

```bash
terraform apply
```

to get the full AWS infrastructure ready.

------

# 12. Docker Usage

## Docker Containerization

Containerizes:

- The Next.js application
- The PostgreSQL database

------

## Docker Compose

Users can simply run:

```bash
docker compose up -d
```

to launch the entire project.

This delivers:

- Fast deployment
- Consistent local development environments
- Lower environment setup difficulty

------

# 13. CLI Initialization Tool (Key Feature)

Recommended usage:

```bash
npx create-letsvideo-app
```

Initialization flow:

```text
✔ AWS Region?
✔ S3 Bucket?
✔ CloudFront Domain?
✔ Database URL?
✔ Root Username?
✔ Root Password?
```

Automatically handles:

- Creating `.env`
- Prisma initialization
- Creating the Root User
- Terraform initialization
- Docker setup

------

# 14. Recommended System Architecture

```text
User
 ↓
Next.js App (Docker)
 ↓
PostgreSQL
 ↓
AWS S3
 ↓
Lambda + MediaConvert
 ↓
CloudFront CDN
```

------

# 15. Recommended Project Structure

```text
lets-video/
├── apps/
│   └── web/
│
├── packages/
│   ├── ui/
│   ├── cli/
│   └── terraform/
│
├── prisma/
│
├── infrastructure/
│   └── terraform/
│
├── lambda/
│
├── langgraph/
│
└── docker/
```

------

# 16. Future Roadmap

## 1. Multi-tenant

Future support for:

```text
companyA
companyB
familyC
```

Letting multiple organizations share a single platform.

------

## 2. AI-Generated Highlights

Automatically generate:

- Highlight clips
- AI-recommended segments
- Smart thumbnails

------

## 3. SaaS

Eventually:

- Users won't need their own AWS account
- Users can sign up and use the platform directly
- The platform provisions cloud resources for them

Evolving into:

# "The Vercel for video"

------

# 17. Recommended npm Package Layout

## CLI

```text
create-letsvideo-app
```

------

## Core

```text
@letsvideo/core
```

------

## UI

```text
@letsvideo/ui
```

------

## Terraform Modules

```text
@letsvideo/terraform
```

------

# 18. Capabilities the Project Truly Demonstrates

Let's Video is more than just a video website.

It demonstrates:

- Cloud Engineering
- DevOps
- Infrastructure as Code
- Serverless Architecture
- Event-driven Systems
- Full-stack Development
- AI Workflow Design
- Global video streaming architecture

It is a mid-to-senior level cloud-native project.

------

# 19. Final Positioning

# Let's Video

## "An AWS-native private video streaming platform"

A platform that is:

- Self-hostable
- Globally streamable
- AI-ready
- Serverless-ready
- Terraform-ready
- Docker-ready
- LangGraph-ready

A video platform Starter Kit.

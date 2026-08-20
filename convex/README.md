# PATCHBAY Convex backend

PATCHBAY now uses Convex as its application database and realtime backend.

## Setup

1. Install dependencies: `npm install`
2. Authenticate/configure Convex: `npx convex dev`
3. Set the generated `NEXT_PUBLIC_CONVEX_URL` in the Next.js environment.
4. Deploy Convex functions with `npx convex deploy`.

The schema replaces the previous Prisma/PostgreSQL data layer. Projects, files, conversations, messages, AI provider configurations, generations, and deployments are modeled as Convex tables.

## Security

Never expose provider API keys to the browser. Store only encrypted key material or server-side secret references in Convex. Validate project/user ownership inside every mutation and query.

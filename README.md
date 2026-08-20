# PATCHBAY 🚀

PATCHBAY is a production-oriented, mobile-first AI web app builder. Users describe an application, select an AI provider/model, generate structured source files, iterate through builder chat, inspect files, preview the result, and deploy.

## Architecture

- **Next.js + TypeScript** — application UI and server routes
- **Tailwind CSS + Framer Motion** — responsive product UI
- **Convex** — primary application database, queries, mutations, realtime synchronization, and backend functions
- **AI provider abstraction** — OpenAI, Gemini, DeepSeek, Groq, OpenRouter, and GLM
- **Isolated runtime** — generated applications must be built/executed outside the PATCHBAY server process
- **Vercel** — deployment target

## Convex is the source of truth

Do not add new Prisma/PostgreSQL persistence code. The application data model lives in `convex/schema.ts`.

### Convex tables

| Table | Purpose |
|---|---|
| `users` | PATCHBAY accounts |
| `aiProviders` | User AI-provider configuration |
| `projects` | Generated applications |
| `projectFiles` | Generated source files |
| `conversations` | Builder sessions |
| `messages` | Builder messages |
| `generations` | AI generation jobs/status |
| `deployments` | Deployment records/status/URLs |

### Convex modules

- `convex/schema.ts` — schema and indexes
- `convex/auth.ts` — user lookup helpers
- `convex/projects.ts` — project and file mutations
- `convex/files.ts` — realtime file queries/mutations
- `convex/aiProviders.ts` — provider configuration
- `convex/conversations.ts` — conversations/messages
- `convex/generations.ts` — generation jobs
- `convex/deployments.ts` — deployment records
- `convex/http.ts` — Convex HTTP router

## Local development

```bash
npm install
npx convex dev
npm run dev
```

Keep the Convex dev process running while developing so schema/functions and generated `convex/_generated` bindings stay synchronized.

Configure the generated Convex deployment URL as:

```env
NEXT_PUBLIC_CONVEX_URL=...
```

Production Convex deployment:

```bash
npm run convex:deploy
```

## Security requirements

1. **Never expose raw AI API keys to client components.**
2. Store only encrypted/protected key material or server-side secret references.
3. Every private Convex query/mutation must verify user ownership before reading or modifying private records.
4. Generated application code is untrusted and must run in an isolated sandbox/runtime.
5. Never execute generated code in the PATCHBAY Next.js/Convex process.
6. Never put Vercel, GitHub, or AI credentials into generated files.
7. Validate generated file paths and enforce project boundaries.

## Builder flow

1. User onboarding
2. AI provider connection
3. Project prompt
4. Provider/model selection
5. Structured generation
6. Convex persistence
7. Streaming builder conversation
8. Realtime generated-file updates
9. Isolated live preview
10. Iteration/patching
11. Save project
12. Deploy
13. Share

## Deployment environment

Typical server-side secrets include:

```env
CONVEX_DEPLOY_KEY=...
VERCEL_TOKEN=...
GITHUB_TOKEN=...
```

Never expose these values through `NEXT_PUBLIC_*` variables.

## Current migration status

**Database migration: Convex-first.** The Convex schema and core realtime data APIs are implemented. Remaining application integration should use the Convex generated client/functions rather than Prisma.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run convex:dev
npm run convex:deploy
```

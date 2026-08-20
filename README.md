# PATCHBAY 🚀

PATCHBAY is a mobile-first AI-powered web app builder: describe an idea, choose an AI provider, generate a structured application, iterate through streaming chat, inspect generated files, preview the result, and deploy.

## Current architecture

- Next.js + TypeScript + Tailwind CSS + Framer Motion
- **Convex** for the application database, queries, mutations, and realtime data
- Convex schema for users, AI providers, projects, project files, conversations, messages, generations, and deployments
- Per-user project ownership model
- Server-side protection for AI provider credentials
- OpenAI, Gemini, DeepSeek, Groq, OpenRouter and GLM provider abstraction
- Structured AI project generation
- Streaming project chat
- Project/file persistence through Convex
- Vercel deployment workflow
- Responsive PATCHBAY composer and builder UI

## Convex setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Authenticate and create/configure your Convex development deployment:

   ```bash
   npx convex dev
   ```

3. Convex generates the deployment configuration and `convex/_generated` files. Configure the resulting `NEXT_PUBLIC_CONVEX_URL` for the Next.js application.

4. Start Next.js:

   ```bash
   npm run dev
   ```

5. Deploy Convex functions/schema to production:

   ```bash
   npm run convex:deploy
   ```

## Data model

The Convex schema is the source of truth for application persistence. The main tables are:

- `users` — PATCHBAY accounts
- `aiProviders` — user provider configurations and encrypted/server-protected key material
- `projects` — generated applications
- `projectFiles` — generated source files
- `conversations` — builder conversations
- `messages` — user/assistant/system messages
- `generations` — AI generation jobs and status
- `deployments` — deployment records and URLs

## Security

Generated applications are **untrusted code**. They must be built and executed in an isolated sandbox/runtime and never directly inside the PATCHBAY application process.

AI provider credentials must remain server-side. Never expose raw API keys to browser components, generated source files, logs, or client-side state. Convex queries and mutations must validate user/project ownership before reading or changing private data.

## AI providers

PATCHBAY supports an abstraction layer for multiple AI providers. Provider credentials are configured through the application and stored using protected server-side handling. The UI should never receive raw stored keys.

## Deployment

Set `VERCEL_TOKEN` server-side to enable the Vercel deployment workflow. Deployment credentials must never be written into generated project files.

## Development commands

```bash
npm run dev
npm run build
npm run start
npm run convex:dev
npm run convex:deploy
```

## Migration status

The persistence layer is being migrated from the original PostgreSQL/Prisma implementation to Convex. New persistence code should use Convex rather than Prisma. Do not introduce new Prisma models or database calls.

# PATCHBAY

PATCHBAY is a mobile-first AI-powered web app builder: describe an idea, choose an AI provider, generate a structured application, iterate through streaming chat, inspect generated files, and deploy.

## Included

- Next.js + TypeScript + Tailwind + Framer Motion
- PostgreSQL + Prisma persistence
- Credentials authentication with hashed passwords
- Per-user project authorization
- Encrypted provider API keys at rest
- OpenAI, Gemini, DeepSeek, Groq, OpenRouter and GLM provider abstraction
- Structured AI project generation
- Streaming project chat
- Project library
- Vercel deployment workflow
- Responsive PATCHBAY composer and builder UI

## Local setup

1. Copy `.env.example` to `.env.local` and configure PostgreSQL, `AUTH_SECRET`, and `API_KEY_ENCRYPTION_KEY`.
2. Install dependencies with `npm install`.
3. Run `npm run db:push`.
4. Start with `npm run dev`.

Generated applications must be treated as untrusted code. The production architecture should execute generated builds in an isolated sandbox rather than in the PATCHBAY application process.

## Provider setup

Create an account, then add a provider/API key through the provider settings API. Raw keys are never returned to the browser and are encrypted before database storage.

## Deployment

Set `VERCEL_TOKEN` server-side to enable the deployment endpoint. Deployment credentials are never written into generated project files.

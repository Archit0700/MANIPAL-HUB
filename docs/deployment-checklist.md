# Deployment Checklist

## Database (Neon or similar Postgres)
- Create a new Postgres project and database (for Neon, choose the `ai` compute template).
- Enable the `vector` extension: `CREATE EXTENSION IF NOT EXISTS vector;`.
- Create a non-admin user for the application and grant usage on the database.
- Update the connection string to include `?schema=public` and share it with the API configuration.

## API (Render Web Service)
- Repository: this monorepo, root build command `pnpm install --frozen-lockfile`.
- Start command: `pnpm --filter @campus/api start` (or `pnpm --filter @campus/api start:prod` after implementing a prod build).
- Environment variables:
  - `DATABASE_URL` (Neon connection string).
  - `PORT` (Render provides one automatically, use `$PORT`).
  - `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL`, `OPENAI_EMBEDDING_MODEL`, `OPENAI_BASE_URL` (if using Azure/OpenAI proxy).
- Add a build step or deploy hook to run `pnpm --filter @campus/api prisma migrate deploy` before the service boots.
- Optional: add a post-deploy job that runs `pnpm --filter @campus/api prisma:seed` and `pnpm --filter @campus/api rag:ingest` if embeddings should be refreshed automatically.

## Web (Vercel)
- Framework preset: Next.js. Install using `pnpm install --frozen-lockfile`.
- Build command: `pnpm --filter @campus/web build`.
- Output: `.next` handled by Vercel.
- Environment variables:
  - `NEXT_PUBLIC_API_BASE_URL` -> Render API URL (for example `https://api-yourapp.onrender.com/api`).
- Configure preview/prod environment variables separately if the API base URL differs per stage.

## Secrets and Operations
- Store OpenAI keys in the platform secret manager (Render/Vercel/Neon) and never commit them.
- Rotate the OpenAI key periodically and redeploy to refresh the environment.
- Schedule a job or GitHub action to re-run `rag:ingest` when source documents change.
- Monitor the Render service logs for Prisma migration output during deployments.

## Local Production Smoke Test
- Copy `.env.example` files to actual `.env` files and adjust values.
- Run `pnpm install`, then `pnpm run stack:bootstrap` (VS Code task) to prepare the database.
- Start dev servers with `pnpm run stack:dev` or run `pnpm --filter @campus/api start:dev` and `pnpm --filter @campus/web dev` separately.
- Confirm `/articles`, `/faqs`, `/events`, `/map`, and `/chat` render correctly and the chat endpoint returns answers when OpenAI credentials are configured.

# basarai Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-08

## Active Technologies
- Dockerfile, Bash (entrypoint); modifies Python 3.13 backend + TypeScript/Next.js 14 frontend configs + Docker (multi-stage build), tini (PID 1 init), Node.js 20, Python 3.13, uvicorn (002-dockerization)
- N/A (no database changes) (002-dockerization)

- Python 3.13 (backend), TypeScript 5.x (frontend) + FastAPI 0.109+, Next.js 14 (App Router), @supabase/ssr, @supabase/supabase-js, PyJWT, supabase-py, shadcn/ui, Tailwind CSS (001-foundation)

## Project Structure

```text
backend/
frontend/
supabase/
```

## Commands

```bash
# Backend
cd backend && pytest && ruff check .

# Frontend
cd frontend && npm run dev
```

## Code Style

Python 3.13 (backend), TypeScript 5.x (frontend): Follow standard conventions

## Recent Changes
- 002-dockerization: Added Dockerfile, Bash (entrypoint); modifies Python 3.13 backend + TypeScript/Next.js 14 frontend configs + Docker (multi-stage build), tini (PID 1 init), Node.js 20, Python 3.13, uvicorn

- 001-foundation: Added Python 3.13 (backend), TypeScript 5.x (frontend) + FastAPI 0.109+, Next.js 14 (App Router), @supabase/ssr, @supabase/supabase-js, PyJWT, supabase-py, shadcn/ui, Tailwind CSS

<!-- MANUAL ADDITIONS START -->

## Workflow

- Feature specs live in `specs/<feature-id>/` (e.g., `specs/001-foundation/spec.md`)
- Use speckit slash commands (`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`) for the full feature lifecycle
- Feature branches follow `NNN-feature-name` convention (e.g., `002-dockerization`)
- Always run `/speckit.analyze` after generating tasks to check cross-artifact consistency

## Supabase

- Local dev: `supabase start` from project root; migrations are in `supabase/migrations/`
- Known issue: SQL migration order matters — if `supabase start` fails, check migration file timestamps and dependencies
- Config: `supabase/config.toml`

## Deployment

- Target platform: Bunny Magic (container hosting)
- Single-container strategy: both frontend (Next.js) and backend (FastAPI) in one image
- HTTPS termination handled by platform; container serves HTTP only

## Code Review

- CodeRabbit is configured for PR reviews — expect automated review comments on PRs
- Address CodeRabbit feedback in dedicated fix commits (e.g., `fix: address CodeRabbit review feedback`)

<!-- MANUAL ADDITIONS END -->

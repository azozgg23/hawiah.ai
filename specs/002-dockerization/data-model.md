# Data Model: Application Containerization

**Branch**: `002-dockerization` | **Date**: 2026-02-22

This feature does not introduce database schema changes. The "data model" consists of configuration entities and file artifacts.

## Configuration Entities

### Build-Time Arguments

Variables passed via `--build-arg` during image build. Inlined into the frontend bundle.

| Argument | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (baked into client JS) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (baked into client JS) |

### Runtime Environment Variables

Variables passed via `-e` or `--env-file` at container start.

| Variable | Required | Default | Used By | Purpose |
|----------|----------|---------|---------|---------|
| `SUPABASE_URL` | Yes | — | Backend | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | — | Backend | Server-side Supabase access |
| `SUPABASE_ANON_KEY` | Yes | — | Backend | Public Supabase key |
| `SUPABASE_JWT_SECRET` | Yes | — | Backend | JWT token verification |
| `STORAGE_BUCKET` | No | `brand-assets` | Backend | Supabase storage bucket name |
| `ADMIN_EMAILS` | No | (empty) | Backend | Comma-separated operator emails |

### Internal (Fixed) Configuration

These values are fixed inside the container and not user-configurable.

| Setting | Value | Rationale |
|---------|-------|-----------|
| Backend host | `127.0.0.1` | Internal-only; not reachable from outside container |
| Backend port | `8000` | Internal-only; convention from Phase 1 |
| Frontend host | `0.0.0.0` | Publicly accessible from outside container |
| Frontend port | `3000` | Single exposed port; convention from Phase 1 |
| API proxy path | `/api/*` → `http://127.0.0.1:8000/*` | Next.js rewrites; same-container loopback |

## File Artifacts

### New Files (to be created)

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build definition for the single container image |
| `.dockerignore` | Excludes unnecessary files from build context |
| `scripts/container-entrypoint.sh` | Process supervisor: env validation, startup ordering, signal handling |
| `docs/docker.md` | Deployment runbook for Bunny Magic |

### Modified Files

| File | Change |
|------|--------|
| `frontend/next.config.mjs` | Add `output: 'standalone'` for containerized production builds |

## State Diagram: Container Lifecycle

```
[Container Start]
       │
       ▼
 ┌─────────────┐
 │ Validate Env │──── Missing vars ──→ [Exit 1 with error list]
 └─────────────┘
       │ All present
       ▼
 ┌─────────────┐
 │ Start Backend│
 └─────────────┘
       │
       ▼
 ┌─────────────────┐
 │ Poll /health     │──── Timeout ──→ [Exit 1: backend failed to start]
 │ (wait for ready) │
 └─────────────────┘
       │ Healthy
       ▼
 ┌──────────────┐
 │ Start Frontend│
 └──────────────┘
       │
       ▼
 ┌──────────────┐
 │ Running       │◄─── HEALTHCHECK polls both services
 │ (wait -n)     │
 └──────────────┘
      │ │
      │ └── Process crash ──→ [Kill other, Exit 1]
      │
      └── SIGTERM/SIGINT ──→ [Kill both, Exit 0]
```

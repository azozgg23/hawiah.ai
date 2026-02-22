# Basar AI

Multi-brand social image generator. Built with Next.js 14, FastAPI, and Supabase.

## Prerequisites

- Node.js 18+
- Python 3.13+
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)

## Supabase Setup

### Local (development)

```bash
npx supabase start
```

Copy the `API URL`, `anon key`, `service_role key`, and `JWT secret` from the output into your `.env` files (see below).

Apply migrations:

```bash
npx supabase db push
```

### Live (production)

Link your project:

```bash
npx supabase link --project-ref <your-project-ref>
```

Get `URL`, `anon key`, `service_role key`, and `JWT secret` from the [Supabase Dashboard](https://supabase.com/dashboard) under Settings > API.

Push migrations:

```bash
npx supabase db push
```

## Backend Setup

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
STORAGE_BUCKET=brand-assets
ADMIN_EMAILS=admin@example.com
HOST=127.0.0.1
PORT=8000
```

Install and run:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=/api
NEXT_SERVER_API_URL=http://127.0.0.1:8000
```

Install and run:

```bash
npm install
npm run dev
```

## Docker

```bash
make build && make up
```

See [docs/docker.md](docs/docker.md) for details.

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make build` | Build Docker image |
| `make up` | Build and run container |
| `make down` | Stop and remove container |
| `make logs` | Tail container logs |
| `make restart` | Restart container |
| `make shell` | Shell into running container |
| `make health` | Check container health |
| `make clean` | Remove container and image |
| `make dev` | Show local dev instructions |
| `make dev-backend` | Run backend locally |
| `make dev-frontend` | Run frontend locally |
| `make lint` | Lint backend + frontend |
| `make test` | Run backend tests |

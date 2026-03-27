# Recruiting AI

Full-stack **Applicant Tracking System (ATS)**–style platform: recruiters manage companies, jobs, candidates, and pipelines; job seekers use a separate candidate auth flow and public job board.

| Area | Folder | Stack |
|------|--------|--------|
| API | `recruiting-ai-backend` | Ruby 3.1, Rails 7 API-only, PostgreSQL, JWT |
| Web app | `recruiting-ai-frontend` | React, Vite, Tailwind, React Router |
| Specs | `ai-prompts` | Backend & UI specification markdown |

Product behavior is documented in `ai-prompts/RECRUITING_AI_BACKEND_SPEC.md` and `ai-prompts/RECRUITING_AI_UI_SPEC.md`.

---

## Run with Docker (recommended)

**Compose project name:** `recruiting-ai` (declared in the root `docker-compose.yml` and in the small `docker-compose.yml` files under `recruiting-ai-backend/` and `recruiting-ai-frontend/` so the name stays `recruiting-ai` when you run Compose from those subfolders).

**Requirements:** Docker + Compose v2; host ports **5432**, **3000**, and **5173** free (or override in `.env`).

### Start the stack

From the **repository root** (next to `docker-compose.yml`):

```bash
cp .env.example .env    # optional; defaults work for local dev
make start              # background: docker compose up -d --build
```

Or attach in the foreground (logs in the terminal; **Ctrl+C** stops the stack):

```bash
make up                 # docker compose up --build
```

Or use Compose directly: `docker compose up --build`.

First boot runs migrations and seeds. Ensure `recruiting-ai-backend/config/master.key` exists, or set **`RAILS_MASTER_KEY`** in `.env`.

### URLs

| What | URL |
|------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Rails API | http://localhost:3000 |
| Health | http://localhost:3000/up |

With the default Compose env, the browser uses **`VITE_API_URL=http://localhost:5173/api`** and Vite proxies **`/api`** to the backend (see `.env.example`).

### Common commands (run from repo root)

| Command | Purpose |
|---------|---------|
| `make start` | **Run** the stack in the background (`docker compose up -d --build`) |
| `make stop` | **Stop** the stack (`docker compose down`; keeps volumes) |
| `make restart` | `stop` then `start` |
| `make up` | Run in the **foreground** with logs (Ctrl+C stops) |
| `make logs` | Follow logs from all services |
| `make console` | Open **Rails console** in the backend container |
| `docker compose exec backend bin/rails console` | Same as `make console` |
| `docker compose ps` | Show service status |
| `docker compose down -v` | Stop and **delete** Postgres volume (wipes DB) |

### Rails console

Use the **Makefile** or Compose (not raw `docker exec` unless you know the container is on `recruiting-ai-network`):

```bash
make console
```

Equivalent:

```bash
docker compose exec backend bin/rails console
```

Works from the **repo root** or from **`recruiting-ai-backend/`** (include compose file).

The app connects to Postgres at host **`db`** (Compose service name). If you see **`could not translate host name "db"`**, recreate the stack from the repo root: `docker compose down && docker compose up -d`, then check: `docker compose exec backend getent hosts db`.

### Environment (`.env`)

| Variable | Role |
|----------|------|
| `COMPOSE_PROJECT_NAME` | Should match `recruiting-ai` |
| `SECRET_KEY_BASE` | Rails / JWT signing in dev (long random string) |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Database credentials |
| `VITE_API_URL` | Frontend API base (Docker default: `http://localhost:5173/api`) |
| `CORS_ORIGINS` | Origins allowed for direct browser → API calls |

### Port conflicts

If **5432**, **3000**, or **5173** are taken, set in `.env` for example:

```env
POSTGRES_PORT=5433
BACKEND_PORT=3001
FRONTEND_PORT=5174
```

---

## Run without Docker

- **Backend:** `cd recruiting-ai-backend` → `bundle install`, `rails db:prepare`, `rails s` (needs local PostgreSQL; set `DATABASE_HOST` / credentials in `config/database.yml` or env as needed).
- **Frontend:** `cd recruiting-ai-frontend` → `npm install`, `npm run dev` with **`VITE_API_URL=http://localhost:3000`**.
- **Rails console:** `cd recruiting-ai-backend` → `bin/rails console` (or `bin/rails c`).

See READMEs inside each app folder for more detail.

# Recruiting AI

A full-stack **Applicant Tracking System (ATS)**–style recruiting platform: recruiters manage companies, jobs, candidates, and pipelines; external candidates can browse jobs and apply using a separate auth flow. This repository holds the **API**, the **web app**, shared **AI prompts / specs**, and **Docker** orchestration.

## What’s in this repo

| Area | Folder | Stack |
|------|--------|--------|
| Backend API | `recruiting-ai-backend` | Ruby 3.1, Rails 7 API, PostgreSQL, JWT |
| Web UI | `recruiting-ai-frontend` | React, Vite, Tailwind, React Router |
| Product specs | `ai-prompts` | Backend and UI specification markdown |
| Containers | `docker-compose.yml` (root) | Postgres + Rails + Vite dev servers |

Detailed API and UI behavior are described in `ai-prompts/RECRUITING_AI_BACKEND_SPEC.md` and `ai-prompts/RECRUITING_AI_UI_SPEC.md`. Each app folder may also have its own README.

---

## Run with Docker

Docker Compose starts **PostgreSQL**, the **Rails** API, and the **Vite** dev server with live-reload volumes. Compose project name: **`recruiting-ai`**.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2  
- Ports **5432**, **3000**, and **5173** available on the host (or override them—see below)

### Quick start

From **this directory** (the folder that contains `docker-compose.yml`):

```bash
cp .env.example .env
docker compose up --build
```

The first backend boot runs migrations and seeds (development data). Rails needs a valid **`config/master.key`** in `recruiting-ai-backend` (or set **`RAILS_MASTER_KEY`** in `.env`) if your encrypted credentials require it.

### URLs

| Service | URL |
|---------|-----|
| Frontend (Vite) | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:3000](http://localhost:3000) |
| Health check | [http://localhost:3000/up](http://localhost:3000/up) |

With the default Docker setup, the browser talks to the API either at **port 3000** or through the Vite **`/api`** proxy (see `VITE_API_URL` in `.env.example`).

### Environment

Copy **`.env.example`** to **`.env`** and adjust as needed. Notable variables:

- **`COMPOSE_PROJECT_NAME`** — matches the Compose project (`recruiting-ai`)
- **`SECRET_KEY_BASE`** — long random string for Rails/JWT in development
- **`POSTGRES_*`** — database user, password, and database name
- **`VITE_API_URL`** — frontend API base URL (Docker default uses the Vite `/api` proxy)
- **`CORS_ORIGINS`** — allowed browser origins for direct API calls

### Port conflicts

If something already uses **5432**, **3000**, or **5173**, set alternate host ports in `.env`:

```env
POSTGRES_PORT=5433
BACKEND_PORT=3001
FRONTEND_PORT=5174
```

### Stop and remove containers

```bash
docker compose down
```

To also remove named volumes (this deletes the Postgres data volume):

```bash
docker compose down -v
```

---

## Run without Docker

Use two terminals: one for `recruiting-ai-backend` (`bundle install`, `rails db:prepare`, `rails s`) and one for `recruiting-ai-frontend` (`npm install`, `npm run dev`), with a local PostgreSQL instance and `VITE_API_URL=http://localhost:3000`. See the READMEs inside each app folder for more detail.

# Recruiting AI — Frontend (React App)

React dashboard for the Recruiting AI platform. Includes the internal recruiter UI and a separate candidate-facing job board + application tracking experience.

---

## Tech stack

- **React** (Vite)
- **React Router** (protected routes + role-protected routes)
- **Axios** (API client with JWT injection)
- **Tailwind CSS** (modern SaaS theme: blue / white / dark grey)
- **Context API + Hooks** (auth + feature hooks)
- **lucide-react** (icons)

---

## Setup

From the frontend folder:

```bash
cd recruiting-ai-frontend
npm install
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

---

## API base URL configuration

The frontend uses `VITE_API_URL` as the Rails API base URL.

- Default: `http://localhost:3000`
- Configure via `.env` (see `.env.example`)

Example:

```bash
VITE_API_URL=http://localhost:3000
```

---

## Folder structure (high level)

```
src/
  components/   # Navbar, Sidebar, tables, modals, route guards, etc.
  context/      # AuthContext (recruiter) + CandidateAuthContext (candidate)
  hooks/        # feature hooks (jobs, candidates, applications, interviews, dashboard, etc.)
  pages/        # route pages (recruiter + candidate)
  services/     # axios clients (api.js, candidateApi.js)
  lib/          # permissions matrix + helpers
```

---

## Features

### Recruiter / internal UI

- **Auth**: recruiter login/signup, JWT stored in localStorage, logout
- **RBAC UI**: sidebar + route access are filtered by `user.roles` (backend remains source of truth)
- **Dashboard & reports**: summary, pipeline, analytics
- **Companies**: list/create (Admin-only for create)
- **Users**: view/invite users (Admin/Recruiter)
- **Jobs**: list/create/edit/close (Admin/Recruiter)
- **Candidates**: list/add/edit, resume link, AI score (Admin/Recruiter)
- **Applications**: list/filter, status updates (Recruiter + Hiring Manager can update)
- **Interviews**: list/schedule (Admin/Recruiter)
- **Feedback**: view/submit (interviewers limited to assigned interviews)
- **Settings & Profile**: profile edit + password change

### Candidate-facing UI

- **Job board**: browse published jobs with filters
- **Candidate auth**: signup/login (separate token storage)
- **Apply for jobs**: resume URL + cover note
- **Track application status**: status, AI score, interview details (when scheduled)

---

## Notes

- If you see API errors like “API unreachable…”, ensure the Rails API is running and `VITE_API_URL` matches its port.
- Specs live in the repo root: `RECRUITING_AI_UI_SPEC.md` and `RECRUITING_AI_BACKEND_SPEC.md`.

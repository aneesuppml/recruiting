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
- **Company verification (pending/rejected tenants)**: users can log in while `company_status=pending` or `company_status=rejected`, but the UI restricts access to only Profile, the company verification page, and (when needed) the company switcher.
- **Company switching (multi-company ownership)**: admins who own multiple companies can switch the active tenant via the Navbar `CompanySwitcher`, which updates `active_company_id`/`company_status` and causes the app to send `X-Company-ID` on API requests.
- **Pending page:** `/pending-approval` (fetches company + admin details from `GET /company/status` and shows pending vs rejected messaging)
- **Dashboard & reports**: summary, pipeline, analytics
- **Companies**: list/create (Admin-only for create)
- **Users**: view/invite users (Admin/Recruiter)
- **Jobs**: list/create/edit/close (Admin/Recruiter)
- **Candidates**: list/add/edit, resume link, AI score (Admin/Recruiter)
- **Applications**: list/filter, status updates (Recruiter + Hiring Manager can update)
- **Interviews**: list/schedule (Admin/Recruiter)
- **Feedback**: view/submit (interviewers limited to assigned interviews)
- **Settings & Profile**: profile edit + password change

### Super Admin module

- Platform-wide module under `/super-admin/*` with a dedicated layout and header/profile menu.
- Super Admin can manage companies/users across all tenants and view system analytics.

### Candidate-facing UI

- **Job board**: browse active jobs with filters.
  - When candidate is authenticated: jobs come from `GET /candidate/jobs` and details from `GET /candidate/jobs/:id` (scoped by candidate `company_id` when present).
  - Otherwise: use the public job board endpoints.
- **Candidate auth**: signup/login (separate token storage)
- **Apply for jobs**: resume URL + cover note
- **Track application status**: status, AI score, interview details (when scheduled)

---

## Notes

- If you see API errors like “API unreachable…”, ensure the Rails API is running and `VITE_API_URL` matches its port.
- Specs live in the repo root: `RECRUITING_AI_UI_SPEC.md` and `RECRUITING_AI_BACKEND_SPEC.md`.

## Pending tenant navigation

- After successful login, the app redirects based on `user.company_status`:
  - `active` → `/dashboard`
  - `pending` or `rejected` → `/pending-approval`
- While pending/rejected, navigation/sidebar and route guards prevent access to main modules (Jobs, Candidates, Applications, Interviews, Feedback, Reports, Companies, Users, Settings hub). Company switching may still be available via the header.
- Logout works normally via the profile dropdown.

# Recruiting AI — Backend (Rails API)

Rails API backend for a multi-tenant Recruiting/ATS platform. Provides recruiter/internal APIs (JWT `user_id`) and separate candidate/job-seeker APIs (JWT `candidate_id`).

---

## Tech stack

- **Ruby / Rails**: Rails 7 API-only
- **Database**: PostgreSQL
- **Auth**: JWT (bcrypt + `JwtService`)

---

## Setup

From the backend folder:

```bash
cd recruiting-ai-backend
bundle install
rails db:create db:migrate
rails server
```

The API will run on `http://localhost:3000` by default.

---

## Environment variables

Rails uses standard environment variables for DB and secrets.

### Database (PostgreSQL)

Configure via `config/database.yml` using typical Rails env vars such as:

- `DATABASE_URL` (recommended), or
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### JWT secret

JWT signing uses `Rails.application.credentials.secret_key_base`.

Provide it via one of:

- `SECRET_KEY_BASE` environment variable, or
- Rails credentials (`config/credentials.yml.enc`)

---

## API endpoints overview

All endpoints return JSON. Recruiter/internal endpoints require `Authorization: Bearer <token>` unless noted.

### Auth (recruiters/internal users)

- `POST /signup`
- `POST /login`
- `GET /profile`
- `PATCH /profile`

Responses include `user` and `token`. `user.roles` is returned for RBAC.

#### Company verification (pending tenants)

`POST /signup` creates a new tenant `Company` in `pending` status and associates the registering user to it.

- Registration now accepts a `user` payload containing:
  - Admin user details: `name`, `email`, `password`, `password_confirmation`
  - Company details (tenant onboarding): `company_name`, required unique `domain`, optional `company_size`, optional `industry`
  - Address: `address_line1`, optional `address_line2`, `city`, `state`, `country`, `postal_code`
  - Contact: `contact_email`, `contact_phone`
- On successful signup the API returns `pending: true` and also a JWT `token`. The UI uses that session to render `/pending-approval`, but the backend continues to enforce restricted access while the tenant is `pending` or `rejected`.
- `POST /login` behavior:
  - Allowed: company status `pending`
  - Blocked: company status `rejected` (403)
- While authenticated and the company is `pending` or `rejected`, restricted API access is enforced:
  - Allowed (based on active tenant context):
    - `GET /profile`, `PATCH /profile`
    - `GET /company/status`
    - `GET /companies` (company switching UI)
  - Everything else returns `403` with a clear error (e.g. `Company Pending Approval`)

### Companies & users

- Multi-company ownership:
  - Company ownership is enforced via `admin_user_id`.
  - When a user selects an “active company”, the frontend sends `X-Company-ID: <active_company_id>` so the backend knows which tenant context to apply.
  - Auth/profile payloads include `active_company_id` and `company_status` so the UI can redirect appropriately.
- `GET /companies`
- `GET /companies/:id` (when the user has access to that tenant)
- `POST /companies` (creates a new tenant in `pending` status; the logged-in admin becomes the tenant admin)
- `PUT /companies/:id` (Super Admin can update tenant `active/status`)
- `GET /companies/:company_id/users`
- `POST /companies/:company_id/users`

#### Company status (authenticated)

- `GET /company/status`  
  Returns the current company details (including pending address/contact info) and the admin user (name/email) for the pending UI.

### Jobs

- `GET /jobs`
- `GET /jobs/:id`
- `POST /jobs`
- `PUT /jobs/:id`
- `DELETE /jobs/:id`
- `GET /jobs/:id/top_candidates`

### Candidates (internal candidate records)

- `GET /candidates`
- `GET /candidates/:id`
- `POST /candidates`
- `PUT /candidates/:id`
- `DELETE /candidates/:id`
- `POST /candidates/:id/parse_resume`

### Applications

- `GET /applications`
- `GET /applications/:id`
- `POST /applications`
- `PUT /applications/:id`
- `DELETE /applications/:id`

### Interviews

- `GET /interviews`
- `GET /interviews/:id`
- `POST /interviews`
- `PUT /interviews/:id`
- `DELETE /interviews/:id`

### Feedback

- `GET /feedback/:interview_id`
- `POST /feedbacks`
- `GET /feedbacks/:id`
- `PUT /feedbacks/:id`
- `DELETE /feedbacks/:id`

### Dashboard / analytics

- `GET /dashboard/summary`
- `GET /dashboard/pipeline`
- `GET /dashboard/reports`

### Super Admin (platform-wide)

- `GET /super-admin/companies`
- `POST /super-admin/companies`
- `PUT /super-admin/companies/:id`
- `GET /super-admin/users`
- `GET /super-admin/analytics/summary`

### Candidate-side (external job seekers)

No recruiter token required:

- `POST /candidate/signup`
- `POST /candidate/login`
- `GET /public/jobs`
- `GET /public/jobs/:id`

Candidate token required:

- `GET /candidate/jobs`
- `GET /candidate/jobs/:id`
- `GET /candidate/dashboard`
- `GET /candidate/applications/:id`
- `POST /candidate/applications`

---

## Role-based access control (RBAC)

RBAC is enforced server-side for all protected endpoints (403 on forbidden actions).

### Recruiter/internal roles

- **Admin**: full access to all modules
- **Recruiter**: manage jobs/candidates/applications, schedule interviews, manage company users
- **Hiring Manager**: view jobs/candidates/applications, participate in interview decisions/feedback
- **Interviewer**: view only assigned interviews, submit feedback, limited access

### Super Admin

- **Super Admin** can access `/super-admin/*` and manage companies/users across all tenants.

### Company verification gating (pending tenants)

- When the *active tenant context* has `status=pending` or `status=rejected`, the backend blocks restricted endpoints and returns `403 Forbidden` with a JSON error.
- Pending/rejected users can still access:
  - `GET /profile`, `PATCH /profile`
  - `GET /company/status`
  - `GET /companies` (company switching)

### Candidates

Candidates are a separate identity (candidate auth + `/candidate/*` endpoints). They are not a `User` role.

---

## Notes

- **CORS** is configured permissively for local development in `config/initializers/cors.rb`.
- See the platform specs in the repo root: `RECRUITING_AI_BACKEND_SPEC.md` and `RECRUITING_AI_UI_SPEC.md`.

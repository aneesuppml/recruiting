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
cd recruiting-ai
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

### Companies & users

- `GET /companies`
- `GET /companies/:id`
- `POST /companies`
- `GET /companies/:company_id/users`
- `POST /companies/:company_id/users`

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

### Candidate-side (external job seekers)

No recruiter token required:

- `POST /candidate/signup`
- `POST /candidate/login`
- `GET /public/jobs`
- `GET /public/jobs/:id`

Candidate token required:

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

### Candidates

Candidates are a separate identity (candidate auth + `/candidate/*` endpoints). They are not a `User` role.

---

## Notes

- **CORS** is configured permissively for local development in `config/initializers/cors.rb`.
- See the platform specs in the repo root: `RECRUITING_AI_BACKEND_SPEC.md` and `RECRUITING_AI_UI_SPEC.md`.

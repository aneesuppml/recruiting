# Recruiting AI — Backend API Specification

> **Living document.** Update this spec when requirements or behavior change (e.g. auth rules, new modules, fixes).

---

Create a new Rails API-only project for a recruiting platform.

**Project name:** recruiting-ai  

**Repo folder name (this workspace):** `recruiting-ai-backend` (backend) and `recruiting-ai-frontend` (frontend).

**Docker (optional):** A root-level **`docker-compose.yml`** (project name **`recruiting-ai`**) runs PostgreSQL, the Rails API, and the Vite dev server together. **`recruiting-ai-backend/docker-compose.yml`** and **`recruiting-ai-frontend/docker-compose.yml`** each set **`name: recruiting-ai`** and **`include`** the root file so `docker compose` run from those subfolders does not rename the project to the folder name. Container names: **`recruiting-ai-db`**, **`recruiting-ai-backend`**, **`recruiting-ai-frontend`**; network **`recruiting-ai-network`**; service DNS names inside Compose remain **`db`**, **`backend`**, **`frontend`**. Root **`README.md`** documents start/stop, env, ports, and **`make console`** (Rails console). Copy **`.env.example`** to **`.env`** at the repo root and run `docker compose up --build`. See **Docker Compose (development)** below.

**Target stack:**
- Ruby 3.1.x
- Rails 7.x
- PostgreSQL database

Assume the environment is compatible and the Rails project has been successfully created.

This project will be an API-first backend for a recruiting system that developers will consume. A simple admin UI may be added later, but for now focus only on building clean, modular backend APIs.

The system should resemble a modern Applicant Tracking System (ATS) similar to Greenhouse, Lever, Ashby, or Kula AI.

Follow a modular and RESTful architecture so additional modules can easily be added later.

**Important DB/query constraints:** This app runs on PostgreSQL. Avoid `default_scope` (especially ordering) because it can break aggregate/group queries. Use explicit ordering scopes (e.g. `scope :recent`) and in any `group`/`count` analytics query, remove ordering via `.unscope(:order)` / `.reorder(nil)` before `group`.

**Architecture rule — internal vs external:** Keep **internal users** (recruiters, admins, hiring managers) in the **User** model with existing JWT auth. **External candidates** (job seekers) use the **Candidate** model and separate candidate auth (JWT with `candidate_id`). Do not mix recruiters and candidates in the same model.

---

## Step 1 — Authentication Setup

Implement JWT-based authentication first.

**Generate the following:**

1. **Update Gemfile:**
   - bcrypt (for password hashing)
   - jwt (for token-based authentication)
   - rack-cors (if using a CORS initializer; required for Rack::Cors)

2. **User Model**  
   **Fields:**
   - email
   - password_digest  

   **Requirements:**
   - has_secure_password
   - email validation
   - unique email constraint

3. **JWT Service / Module:**
   - Token encode(payload, exp: default_expiration)
   - Accept payload as a single positional argument (Hash)
   - Example: `JwtService.encode({ user_id: user.id })`
   - Token decode
   - Token expiration support (exp in payload)

4. **AuthController**  
   **Endpoints:**
   - POST /signup
   - POST /login  

   **Responsibilities:**
   - user signup
   - user login
   - JWT token generation
   - error handling  

   **Important:** In Rails API-only apps DO NOT add `skip_before_action :verify_authenticity_token`.

5. **Routes configuration:**
   - signup
   - login

**Profile (current user):**
- Add optional **name** field to User (migration).
- **ProfilesController** (authenticated): GET /profile (return current user with id, email, name, `company_id`, and **company_name** for the active company context; roles). PATCH /profile (update name, email, and optionally password; require current_password when changing password). Return same profile JSON on update so clients can refresh auth state.
- Auth login/signup user_json should include **name** when present, and also include `active_company_id` and `company_status` (so the UI can redirect to `/pending-approval` and send `X-Company-ID` for subsequent requests).

---

## Step 2 — Organizational & Multi-Tenant Management

Support multiple companies using the platform.

**Models:** Company, User, Role, Membership

**Relationships:**
- **Company** — belongs_to `admin_user` (User, optional), has_many users/memberships, has_many jobs, has_many candidates
- **User** — has_many `admin_companies` (Company where `admin_user_id == user.id`), belongs_to `company` (legacy/primary association; optional). Roles are managed via `Membership`.

**Fields:**
- **Company:** name, domain, `status` (`pending|active|rejected`), onboarding fields, and optional `admin_user_id`
- **User:** email, password_digest, name (optional), optional `company_id` (primary association) + memberships/roles

**Features:**
- Company registration
- User onboarding
- Role-based access control

**APIs:**
- POST /companies (create a new tenant/company; created companies start in `pending`)
- GET /companies (list companies the current admin user owns; Super Admin can list all)
- GET /companies/:id
- PUT /companies/:id
- POST /companies/:id/users
- GET /companies/:id/users

**Roles:** Admin, Recruiter, Hiring Manager, Interviewer

**Authorization (company users endpoints):**
- **GET /companies/:id/users** and **POST /companies/:id/users** must be restricted to:
  - the same company the user can access (either via admin ownership using `admin_user_id` or via the user’s primary/legacy `company_id`)
  - and role: **Admin** or **Recruiter** only (`current_user.admin? || current_user.recruiter?`)
- If the user is in a different company or has role **Interviewer** (or no Admin/Recruiter role), respond with **403 Forbidden** and a JSON body such as `{ "error": "Forbidden" }`.
- This ensures only Admins and Recruiters can list or invite company users; frontends should handle 403 with a clear message (e.g. “You don’t have permission to view users for this company. Only Admins and Recruiters can.”).

---

### Active company context & switching (multi-company ownership)

- The frontend selects an “active company” (`active_company_id`) when a user owns multiple companies.
- For authenticated requests, the frontend sends `X-Company-ID: <active_company_id>` to make the backend operate on that tenant context.
- If `X-Company-ID` is missing, the backend derives the target company from admin ownership (`admin_user_id`) or the user’s primary/legacy `company_id`.

## Company Verification (Pending Tenants)

To support multi-tenant onboarding with approval:
- **Company** has a `status` field: `pending | active | rejected`
- **POST /signup** must create:
  - a new tenant `Company` with `status: "pending"`
  - the registering user associated to that company
  - assign the registering user the **Admin** role (no separate Owner role)
- Company onboarding fields on signup (must be persisted on `Company`):
  - required unique `domain`
  - address fields (`address_line1`, optional `address_line2`, `city`, `state`, `country`, `postal_code`)
  - contact fields (`contact_email`, `contact_phone`)
  - optional `company_size`, optional `industry`

### Login behavior
- `POST /login` must allow users whose company status is `pending`
- Users whose company status is `rejected` must not be able to log in

### Restricted API access while pending
- For authenticated API requests, if the *active company* status is `pending` (or `rejected`):
  - allow only:
    - `GET /profile` and `PATCH /profile` (profile is editable while pending)
    - `GET /company/status` (pending UI needs tenant + admin identity)
    - `GET /companies` (allow switching between owned companies while pending/rejected)
  - all other endpoints should return `403 Forbidden` with a JSON error such as:
    - `{ "error": "Company Pending Approval" }`

### Company status endpoint (authenticated)
- Add `GET /company/status` (current user context) returning:
  - company fields required by the pending UI:
    - company name, domain, address, contact, size/industry, status, created_at
  - admin user details for that company:
    - name and email (from `company.admin_user`)

---

## Step 3 — Job Management Module

**Generate:**

**Job Model and Migration**  
**Fields:** title, description, status, department, location, company_id, created_by (user reference), experience_level (optional), required_skills (array, optional) for public job board filtering

**Requirements:**
- validations for required fields
- belongs_to company
- belongs_to user (created_by)

**JobsController:** index, show, create, update, destroy

**Routes:** RESTful routes for jobs.

**Features:** Create job, Publish job, Track job status, Close job.

---

## Step 4 — Candidate Management Module

**Generate:**

**Candidate Model and Migration**  
**Fields:** name, email, phone, resume_url, linkedin_url, status, company_id

**Requirements:** validations for name and email; optional resume_url.

**CandidatesController:** index, show, create, update, destroy

**Routes:** RESTful routes for candidates.

**Features:** Candidate profiles, Candidate pipeline, Resume upload support.

---

## Step 5 — Application Management Module

**Generate:**

**Application Model and Migration**  
**Fields:** user_id, job_id, candidate_id, status, applied_at, resume_url, cover_note, ai_score, parsed_skills (array). Statuses include: applied, screening, shortlisted, interview, under_review, offer, hired, rejected.

**Requirements:**  
Associations: belongs_to user, belongs_to job, belongs_to candidate.

**ApplicationsController:** index, show, create, update, destroy

**Routes:** RESTful routes for applications.

**Features:** Candidate job applications, Application pipeline tracking.

---

## Step 6 — AI Resume Shortlisting

Implement AI-based candidate ranking.

**Features:** Resume parsing, Skill extraction, AI match scoring against job description.

**Fields to add (Candidate):** resume_text, skills, ai_match_score

**Workflow:**
1. Resume uploaded  
2. Text extracted  
3. AI analyzes skills  
4. Match score generated  

**Expose API:**
- POST /candidates/:id/parse_resume
- GET /jobs/:id/top_candidates

---

## Step 7 — Interview Module

**Generate:**

**Interview Model**  
**Fields:** application_id, round_type, interviewer_id, scheduled_at, status, meeting_link (optional, for candidate-facing interview details)

**Features:** Interview round configuration, Interview scheduling, Interview tracking.

**APIs:** POST /interviews, GET /interviews, PUT /interviews/:id

---

## Step 8 — Feedback & Rating Module

**Generate:**

**Feedback Model**  
**Fields:** interview_id, rating, strengths, weaknesses, recommendation

**Features:** Structured feedback, Candidate rating, Hiring decision support.

**Routes:** POST /feedback, GET /feedback/:interview_id

---

## Step 9 — Dashboard & Analytics

Provide analytics endpoints.

**Metrics:** total jobs, active jobs, candidates per job, interview conversion rate, hiring rate.

**Create:** DashboardController

**Endpoints:**
- GET /dashboard/summary
- GET /dashboard/pipeline
- GET /dashboard/reports

---

## Candidate-side (external job seekers)

**Do not** use a controller namespace named `Candidate` (e.g. `Candidate::AuthController`), because it clashes with the **Candidate** model class in Rails constant resolution. Use flat controllers: **CandidateAuthController**, **CandidateApplicationsController**.

**Candidate model (extended for auth):**
- Add optional **password_digest**, **location**; make **company_id** optional (nil for self-signup).
- Unique email for external candidates only: unique index on `email` where `company_id IS NULL`.
- **has_secure_password** (validations: false); require password on create when company_id is nil.

**Candidate auth (no recruiter token):**
- **CandidateAuthController** (not under a Candidate module): POST **candidate/signup**, POST **candidate/login**.
- Signup: permit name, email, phone, password, password_confirmation, location, skills (array); set company_id = nil, status = "new".
- Login: find Candidate by email and company_id nil; authenticate password; return JWT with **candidate_id** (not user_id).
- **CandidateAuthenticatable** concern: decode JWT, set current_candidate from candidate_id.

**Public job board (no auth):**
- **Public::JobsController**: GET **public/jobs** (only published jobs), GET **public/jobs/:id**.
- Filter by title, location, skills, experience_level. Include company in response for show.

**Candidate-scoped job board + application APIs (candidate JWT required):**
- **CandidateJobsController**:
  - GET **candidate/jobs** (active jobs; optional filters; if `current_candidate.company_id` is present, scope to that company)
  - GET **candidate/jobs/:id** (scoped job details; return 404 if job does not belong to the candidate company when scoped)
- **CandidateApplicationsController**: GET **candidate/dashboard** (my applications with job/company), GET **candidate/applications/:id** (with interview details when scheduled), POST **candidate/applications** (job_id, resume_url, cover_note; candidate_id from current_candidate).
- Application status flow: applied → screening → shortlisted → interview → under_review → hired/rejected.
- When interview is scheduled, expose interview date/time, meeting_link, interviewer for candidate.

**Background & notifications:**
- After candidate applies: **ApplicationProcessingJob** (resume parse, skills, ai_score on application).
- On application status change: **CandidateNotificationJob** → **CandidateMailer.application_status_changed** (email candidate).

---

## Role-Based Access Control (RBAC)

**Roles:** Super Admin, Admin, Recruiter, Hiring Manager, Interviewer. (Candidates use separate candidate auth; they are not User roles.)

**Enforcement:** `Authorizable` concern in `app/controllers/concerns/authorizable.rb`. All protected endpoints run role checks and return **403 Forbidden** when the current user’s role is not allowed for that action. Auth and profile responses include **roles** (array of role names) so clients can drive UI.

### Super Admin (platform-wide)

Super Admin is the highest-level role across **all** tenants. This role is intended for platform operators and is not company-scoped.

**Company lifecycle:**
- Companies have an `active` flag (default true). Super Admin can deactivate/reactivate companies.

**Super Admin endpoints:**
- `GET /super-admin/companies`
- `POST /super-admin/companies`
- `PUT /super-admin/companies/:id`
- `GET /super-admin/users`
- `GET /super-admin/analytics/summary`

All `/super-admin/*` endpoints require the Super Admin role and are isolated from company-scoped controllers.

**Seed convenience (development):**
- Seed creates a global Super Admin user: `superadmin@example.com` / `password123`

**Permission matrix:**

| Area | Super Admin | Admin | Recruiter | Hiring Manager | Interviewer |
|------|-------------|-------|-----------|----------------|--------------|
| Super Admin module | ✓ | ✗ | ✗ | ✗ | ✗ |
| Companies (view) | ✓ | ✓ | ✓ (own) | ✓ (own) | ✗ |
| Companies (create/update) | ✓ | ✓ | ✗ | ✗ | ✗ |
| Company users | ✓ | ✓ | ✓ (same company) | ✗ | ✗ |
| Jobs (view) | ✓ | ✓ | ✓ | ✓ | ✗ |
| Jobs (create/update/destroy) | ✓ | ✓ | ✓ | ✗ | ✗ |
| Candidates (view) | ✓ | ✓ | ✓ | ✓ | ✗ |
| Candidates (manage) | ✓ | ✓ | ✓ | ✗ | ✗ |
| Applications (view) | ✓ | ✓ | ✓ | ✓ | ✗ |
| Applications (create/destroy) | ✓ | ✓ | ✓ | ✗ | ✗ |
| Applications (update/review) | ✓ | ✓ | ✓ | ✓ | ✗ |
| Interviews (view) | ✓ | ✓ | ✓ | ✓ | ✓ (assigned only) |
| Interviews (create/update/destroy) | ✓ | ✓ | ✓ | ✗ | ✗ |
| Feedback (view/submit) | ✓ | ✓ | ✓ | ✓ | ✓ (assigned only) |
| Dashboard / Reports | ✓ | ✓ | ✓ | ✓ | ✗ |
| Settings | ✓ | ✓ | ✗ | ✗ | ✗ |

**Implementation notes:**
- User model: `super_admin?`, `admin?`, `recruiter?`, `hiring_manager?`, `interviewer?`, `role_names`.
- Interviewer: interviews index returns only those where `interviewer_id == current_user.id`; show/feedback allowed only for assigned interview.
- Feedback create/update/destroy: interviewer only for feedback belonging to an interview they are assigned to.
- Seed data includes Super Admin + Hiring Manager roles and sample users.

---

## Architecture Requirements

- Keep the project modular.
- Follow RESTful conventions.
- Use clean controller structure.
- Add basic validations.
- Ensure associations between models are properly defined.
- Maintain consistency with authentication setup.
- Multi-tenant safe queries using company_id.
- Service layer for AI and business logic.

---

## Docker Compose (development)

The **workspace root** (parent of `recruiting-ai-backend` and `recruiting-ai-frontend`) contains **`docker-compose.yml`** with Compose project name **`recruiting-ai`** (`COMPOSE_PROJECT_NAME=recruiting-ai` in root `.env` matches).

**Wrapper compose files:** **`recruiting-ai-backend/docker-compose.yml`** and **`recruiting-ai-frontend/docker-compose.yml`** declare **`name: recruiting-ai`** and **`include: ../docker-compose.yml`** so developers can run `docker compose exec …` from either app folder without Compose defaulting the project name to `recruiting-ai-backend` or `recruiting-ai-frontend`.

**Rails console (Docker):** From the repo root, **`make console`** (see root **`Makefile`**) runs `docker compose exec backend bin/rails console`. The database host is the Compose service **`db`**; use Compose exec (or `make console`), not ad hoc `docker exec`, unless the backend container is confirmed attached to **`recruiting-ai-network`**. See root **`README.md`** for troubleshooting if hostname **`db`** does not resolve.

**Services:**
- **`db`** — PostgreSQL 16 (`recruiting-ai-db`), healthcheck via `pg_isready`, port `${POSTGRES_PORT:-5432}:5432`.
- **`backend`** — build context `./recruiting-ai-backend`, image tag **`recruiting-ai-backend:dev`**, **`container_name: recruiting-ai-backend`**, bind-mount for live reload, volume **`recruiting-ai-bundle-cache`** for gems. Puma listens on **`0.0.0.0:3000`**. **`depends_on`** DB with `service_healthy`.
- **`frontend`** — build context `./recruiting-ai-frontend`, image **`recruiting-ai-frontend:dev`**, **`container_name: recruiting-ai-frontend`**, separate volume for **`node_modules`**.

**Backend container environment (representative):** `RAILS_ENV=development`, `DOCKER=true` (allows `config.hosts` for the hostname `backend`), `DATABASE_HOST=db`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `SECRET_KEY_BASE` (JWT signing aligns with `Rails.application.secret_key_base` when set in development), `CORS_ORIGINS` (comma-separated; default includes `http://localhost:5173`).

**Database config:** `config/database.yml` uses **`DATABASE_HOST`** and Postgres credentials when `DATABASE_HOST` is present (Docker); without it, local socket/default OS user behavior is unchanged for non-Docker development.

**Backend image:** `recruiting-ai-backend/Dockerfile` (Ruby 3.1, Bundler 2.5+, `bundle install`). **`bin/docker-entrypoint-dev`** waits for Postgres, ensures Bundler, runs **`rails db:prepare`** and **`rails db:seed`**, then **`rails server -b 0.0.0.0 -p 3000`**. Production-style build is kept as **`Dockerfile.production`**.

**Seeds:** `db/seeds.rb` clears dev/test data in an order that avoids circular FK violations between **`companies.admin_user_id`** and **`users.company_id`** (nullify those columns before `delete_all`).

**Named volumes (examples):** `recruiting-ai-postgres-data`, `recruiting-ai-bundle-cache`, `recruiting-ai-frontend-node-modules`.

**Port conflicts:** Override in root `.env`, e.g. `POSTGRES_PORT`, `BACKEND_PORT`, `FRONTEND_PORT`.

---

## After Generating All Files

The project should be ready for:

```bash
cd recruiting-ai-backend
bundle install
rails db:create
rails db:migrate
```

**Or with Docker** (from the **parent** directory that contains `docker-compose.yml`):

```bash
cp .env.example .env   # optional
docker compose up --build
```

See the repository root **`README.md`** for URLs, environment variables, **`make console`** (Rails console), and troubleshooting.

---

## Expected Result

A clean Rails 7 API backend with:
- JWT Authentication (recruiters: user_id; candidates: candidate_id, separate endpoints)
- Current user profile (GET/PATCH /profile with name, email, company_name, password change)
- Multi-tenant company support (with Admin/Recruiter-only company users APIs)
- **Candidate-side:** candidate signup/login, public job board, candidate applications, dashboard, interview details; AI processing and email notifications on application
- **RBAC:** Admin, Recruiter, Hiring Manager, Interviewer; 403 on disallowed actions; roles in auth/profile JSON
- Job management (with experience_level, required_skills for job board)
- Candidate management
- Application tracking (resume_url, cover_note, ai_score, parsed_skills; extended statuses)
- AI resume shortlisting
- Interview scheduling (meeting_link for candidates)
- Feedback and rating system
- Analytics dashboard

---

## Deliverables for API Consumers

1. **Markdown documentation:** `docs/POSTMAN_CURL_EXAMPLES.md`  
   Include curl examples for: Auth, Profile, Candidate Auth, Public Job Board, Candidate Applications, Companies, Users, Jobs, Candidates, Applications, Interviews, Feedback, Dashboard.

2. **Postman Collection JSON:** `docs/Recruiting-AI-Postman-Collection.json`  
   The collection must include all API requests so the entire API can be imported into Postman in one step.  
   Note: Postman does not support importing markdown curl examples as a collection; a JSON collection must be generated.

---

## Seed Data (db/seeds.rb)

Generate seed data that populates realistic sample data for all models.

**Models:** Company, User, Job, Candidate, Application, Interview, Feedback

**Requirements:**
- Use the **faker** gem (add to Gemfile under the development group if not installed).
- Use realistic Faker data; respect all associations; avoid duplicate emails; wrap seeds in transactions where possible.

**Seed structure:**
- **Companies:** 3 companies (name, domain).
- **Users:** Per company: 1 Admin, 2 Recruiters, 1 Hiring Manager, 2 Interviewers (email, password, role, company_id). Password: `password123`.
- **Jobs:** 5 jobs per company (title, description, status open/closed, department, location, company_id, created_by).
- **Candidates:** 50 candidates (name, email, phone, resume_url, linkedin_url, status, ai_match_score).
- **Applications:** Each candidate applies to 1–3 jobs (candidate_id, job_id, user_id, status, applied_at). Statuses: applied, screening, interview, rejected, hired.
- **Interviews:** For applications with status "interview" (application_id, round_type, interviewer_id, scheduled_at, status). Round types: screening, technical, hr.
- **Feedback:** For completed interviews (interview_id, rating 1–5, strengths, weaknesses, recommendation). Recommendation: hire, no_hire, strong_hire.

**Command:** `rails db:seed`

---

*Last updated: Root `README.md` + `Makefile` (`make console`); wrapper `docker-compose.yml` in backend/frontend with `name: recruiting-ai` + `include`; Docker Compose (`name: recruiting-ai`, containers `recruiting-ai-*`, network/volumes `recruiting-ai-*`); backend `DATABASE_HOST`/Postgres env, `CORS_ORIGINS`, `SECRET_KEY_BASE`, `bin/docker-entrypoint-dev`, `Dockerfile` + `Dockerfile.production`; seeds FK-safe clear for `admin_user_id`/`company_id`. RBAC via `Authorizable`; `X-Company-ID`; pending restrictions; candidate jobs `GET /candidate/jobs` and `GET /candidate/jobs/:id`.*

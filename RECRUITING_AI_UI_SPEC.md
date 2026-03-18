# Recruiting AI — Frontend / UI Specification

> **Living document.** Update this spec when you get new UI requirements, design changes, or bug fixes (e.g. API error handling, new pages, components).

---

Build a React Admin UI for the recruiting-ai platform.

The backend is a Rails 7 API with the following modules:

- Authentication (JWT) — recruiters
- **Candidate auth & public job board** — job seekers (separate auth, candidate token)
- Company / Multi-tenant Management
- Users / Roles
- Jobs
- Candidates
- Applications
- Interviews
- Feedback / Ratings
- Dashboard & Analytics

The UI should consume these APIs and act as an internal recruiting dashboard similar to a modern ATS platform (Greenhouse, Lever, Ashby, or Kula AI).

---

## Frontend Stack

Use the following technologies:

- React (latest)
- Vite
- React Router
- Axios
- React Hooks
- Context API for auth state (with `updateUser` for profile sync)
- Reusable custom hooks
- TailwindCSS + shadcn/ui (or Material UI if preferred)
- **lucide-react** for all icons (no emoji icons; use a consistent icon library)

---

## UI Theme / Design Standard

Use a modern SaaS admin dashboard theme.

**Design style:**

- Clean ATS-style interface
- Light theme by default
- Minimalistic UI
- Card-based dashboards
- Sidebar navigation
- Top navigation bar
- Tables for data views
- Status badges for pipeline stages
- Charts for analytics

**Color style suggestion:**

- **Primary:** Indigo / Blue
- **Secondary:** Gray
- **Status colors:** Green → hired; Yellow → interview; Red → rejected; Blue → applied

**Use reusable UI components for:** Cards, Tables, Modals, Forms, Status badges, Charts.

**Icons:** Use **lucide-react** only. Do not use emoji for navigation, dashboard cards, or buttons. Apply consistent icon sizing (e.g. `h-5 w-5` in sidebar, `h-7 w-7` in cards).

---

## React Architecture Requirements

- Use **functional components only** (no class components).
- Use React Hooks: `useState`, `useEffect`, `useContext`, `useNavigate` (React Router).

---

## API Layer

**Create a reusable API layer:** `src/services/api.js`

Configure Axios with:

- baseURL pointing to Rails API (e.g. `import.meta.env.VITE_API_URL` or `http://localhost:3000`)
- automatic JWT token injection (e.g. from `localStorage.getItem("token")`)
- request interceptor for `Authorization: Bearer <token>`
- response error handling: on 401, clear token and dispatch auth-change **only when the request was not to /login or /signup** (so failed login/signup does not clear token and 401 from login means “invalid credentials”, not session expired)

---

## Custom Hooks

Create reusable custom hooks for API logic. Hooks must encapsulate API calls so UI components stay clean.

**Location:** `src/hooks/`

| Hook | Responsibility |
|------|----------------|
| useAuth.js | login, signup, logout, store JWT |
| useCompanies.js | company registration and user management |
| useJobs.js | fetch jobs, create job, update job, delete job |
| useCandidates.js | fetch candidates, create candidate, update candidate |
| useApplications.js | application pipeline management |
| useInterviews.js | interview scheduling and management |
| useFeedback.js | submit interview feedback |
| useDashboard.js | dashboard analytics |
| useProfile.js | fetch profile (GET /profile), update profile (PATCH /profile); sync auth via updateUser after update |
| useCandidateAuth.js | candidate signup (POST candidate/signup), candidate login (POST candidate/login); do not rethrow on error so no unhandled rejection |
| usePublicJobs.js | fetch public jobs (GET public/jobs with filters), fetch job (GET public/jobs/:id) |
| useCandidateApplications.js | fetch my applications (GET candidate/dashboard), fetch one (GET candidate/applications/:id), apply (POST candidate/applications); use **candidateApi** (candidate token) |

**Error handling in hooks:**

- For endpoints that may return **403 Forbidden** (e.g. company users): do **not** rethrow after setting error state, so callers (e.g. `useEffect`) don’t get unhandled promise rejections.
- For **login/signup** (recruiter and candidate): do **not** rethrow after setError; return null so the promise settles and the form shows the error without unhandled rejection.
- Set a clear user-facing error message on 403 (e.g. “You don’t have permission to view users for this company. Only Admins and Recruiters can.”) and reset list data (e.g. empty array) as needed.

---

## Project Folder Structure

```
src/
  components/
    Navbar.jsx
    Sidebar.jsx
    UserProfileMenu.jsx
    ProtectedRoute.jsx
    DataTable.jsx
    StatusBadge.jsx
    FormModal.jsx
    DashboardCard.jsx
  hooks/
    useAuth.js
    useCompanies.js
    useJobs.js
    useCandidates.js
    useApplications.js
    useInterviews.js
    useFeedback.js
    useDashboard.js
    useProfile.js
    useCandidateAuth.js
    usePublicJobs.js
    useCandidateApplications.js
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Companies.jsx
    Users.jsx
    Jobs.jsx
    Candidates.jsx
    Applications.jsx
    Interviews.jsx
    Feedback.jsx
    Reports.jsx
    Settings.jsx
    Profile.jsx
    candidate/
      CandidateLogin.jsx
      CandidateSignup.jsx
      JobBoard.jsx
      JobDetails.jsx
      ApplyJob.jsx
      CandidateDashboard.jsx
      ApplicationStatus.jsx
  services/
    api.js
    candidateApi.js
  context/
    AuthContext.jsx
    CandidateAuthContext.jsx
  components/
    ... (include CandidateLayout.jsx, CandidateProtectedRoute.jsx)
  App.jsx
  main.jsx
```

---

## Navbar & User Profile Menu

- **Navbar:** Logo/brand (link to dashboard) on the left; **UserProfileMenu** on the right.
- **UserProfileMenu:** Circular avatar with **initials** (from user name, or email if no name). Display **user name** next to avatar (fallback to email, then "User"). On avatar/name click: dropdown with shadow, close on outside click.
- **Dropdown items:** Profile → navigate to /settings/profile; Settings → navigate to /settings; Logout → call logout from auth context, redirect to /login. Dropdown header shows name and email.
- **Icons:** Use lucide-react (no emojis).

---

## Authentication UI

**Pages:** Login.jsx, Register.jsx

**APIs:** POST /signup, POST /login

**On login:** store JWT token in localStorage, update auth context, redirect to dashboard.

**Recruiter login/signup errors:** useAuth must not rethrow on failure; set error message and return so the form shows “Invalid email or password” (or API message) without unhandled rejection.

---

## Candidate-facing UI (job seekers)

**Separate from recruiter auth:** Use **CandidateAuthContext** (storage keys `candidateToken`, `candidate`). Use **candidateApi.js** (Axios instance that sends candidate token) for candidate-scoped endpoints. Do not mix recruiter and candidate tokens.

**Pages:** CandidateLogin.jsx, CandidateSignup.jsx, JobBoard.jsx, JobDetails.jsx, ApplyJob.jsx, CandidateDashboard.jsx, ApplicationStatus.jsx.

**Routes:** /candidate/jobs (public job board), /candidate/jobs/:id (job details), /candidate/login, /candidate/signup, /candidate/dashboard (protected), /candidate/applications/:id (protected), /candidate/apply/:jobId (protected).

**CandidateLayout:** Simple header with Job board link, My applications, Sign in/Sign up or candidate email + Logout. Use for job board and candidate dashboard pages.

**CandidateProtectedRoute:** Require candidate auth; redirect to /candidate/login if not authenticated.

**Hooks:** useCandidateAuth (signup, login; do not rethrow on error), usePublicJobs (public/jobs), useCandidateApplications (candidate/dashboard, candidate/applications; use candidateApi).

**Job board:** List active jobs with filters (title, location, skills, experience); link to job detail; “Apply” links to /candidate/apply/:jobId (requires candidate login). Apply form: resume_url, cover_note.

**Candidate dashboard:** List my applications (job title, company, applied date, status, AI score); link to application status. Application status page shows interview details (date, time, meeting link, interviewer) when scheduled.

---

## Dashboard

- Display: Total Jobs, Active Jobs, Total Candidates, Applications per Job, Interview Pipeline, Hiring Rate.
- Use charts and cards.
- **API:** GET /dashboard/summary (and any other dashboard endpoints as needed).

---

## Settings & Profile

**Pages:** Settings.jsx (hub at /settings), Profile.jsx (/settings/profile).

**Settings:** List of sections; link to Profile; placeholders for Notifications, Security (e.g. “Coming soon”).

**Profile:** Use **useProfile** (GET /profile, PATCH /profile). Display **company name** (from API), not company ID. Editable: name, email. Separate “Change password” section: current password, new password, confirm; require current_password when changing. After successful update, call **updateUser** from AuthContext so navbar and stored user stay in sync. Card-based layout, success/error messages. AuthContext must expose **updateUser(userData)** for this.

**APIs:** GET /profile, PATCH /profile (user: name, email; or current_password, password, password_confirmation).

---

## Company / User Management

**Pages:** Companies.jsx, Users.jsx

**Features:** create company, invite users, assign roles.

**APIs:** POST /companies, GET /companies/:id/users, POST /companies/:id/users.

**Permission handling:** GET and POST `/companies/:id/users` return **403 Forbidden** for users who are not Admin or Recruiter for that company. The UI must handle 403 in the company-users hook (e.g. `fetchCompanyUsers`): show a clear message (“You don’t have permission to view users for this company. Only Admins and Recruiters can.”), set users list to empty, and do not rethrow so there is no unhandled rejection when called from `useEffect`.

---

## Job Management UI

**Page:** Jobs.jsx

**Features:** job list, create job, edit job, close job.

**API:** GET /jobs, POST /jobs, PUT /jobs/:id, DELETE /jobs/:id

---

## Candidate Management UI

**Page:** Candidates.jsx

**Features:** candidate list, candidate profile, resume link, AI match score display.

**API:** GET /candidates, POST /candidates, PUT /candidates/:id

---

## Application Pipeline

**Page:** Applications.jsx

**Features:** pipeline view, candidate job applications, status updates.

**Statuses:** applied, screening, interview, rejected, hired.

---

## Interview Module

**Page:** Interviews.jsx

**Features:** interview scheduling, interview round management, interviewer assignment.

**API:** POST /interviews, GET /interviews

---

## Feedback & Rating

**Page:** Feedback.jsx

**Features:** submit interview feedback, rating system, hiring recommendation.

**API:** POST /feedback (and GET feedback where applicable)

---

## Role-Based Access Control (RBAC)

**Roles (from API):** Admin, Recruiter, Hiring Manager, Interviewer. User object from login and GET /profile includes **roles** (array of strings).

**Permission layer:** `src/lib/permissions.js` defines a permission matrix (e.g. `canViewJobs`, `canManageJobs`, `canViewDashboard`). `src/hooks/usePermissions.js` returns these flags for the current user. Use for conditional UI and route guards.

**Sidebar:** Show only nav items the user is allowed to see (e.g. Interviewer sees only Interviews and Feedback; Hiring Manager sees Dashboard, Jobs, Candidates, Applications, Interviews, Feedback, Reports; Admin sees all including Companies, Users, Settings).

**Route protection:** `RoleProtectedRoute` wraps recruiter routes. If the current path requires a permission the user doesn’t have, redirect to the first allowed path (e.g. Interviewer without dashboard access is sent to /interviews). Default route "/" and "*" redirect authenticated users to their first allowed path (not always /dashboard).

**Actions:** Hide or disable create/edit/delete buttons based on permissions (e.g. "Create job" only when `canManageJobs`; "Update status" on applications when `canUpdateApplication`; "Schedule interview" when `canManageInterviews`). Backend remains the source of truth and returns 403 for disallowed API calls.

---

## Routing

Use React Router.

**Routes (recruiter):** /login, /register, /dashboard, /companies, /users, /jobs, /candidates, /applications, /interviews, /feedback, /reports, /settings, /settings/profile

**Routes (candidate):** /candidate/jobs, /candidate/jobs/:id, /candidate/login, /candidate/signup, /candidate/dashboard, /candidate/applications/:id, /candidate/apply/:jobId

**ProtectedRoute** requires recruiter auth (redirect to /login). **RoleProtectedRoute** (used inside ProtectedRoute) enforces RBAC and redirects to the user’s first allowed path when they lack permission for the current route. **CandidateProtectedRoute** requires candidate auth (redirect to /candidate/login).

---

## Requirements Summary

- Modular React architecture
- Hooks-based API interaction
- Reusable UI components
- Clean admin dashboard layout
- Responsive design
- JWT authentication support
- Graceful handling of 403 (and other API errors) with clear user messages and no unhandled rejections in hooks
- **lucide-react** for all icons (Sidebar, Dashboard cards, FormModal close, etc.); no emoji icons
- **RBAC:** Sidebar and routes restricted by role; create/edit/delete actions hidden when user lacks permission; roles from login/profile

---

## Deliverables

Generate:

1. Full React project structure
2. All pages and components
3. Custom hooks (with proper 403/error handling where noted)
4. Axios API service
5. Router configuration

**Run instructions:**

```bash
npm install
npm run dev
```

Design the UI similar to a modern ATS recruiting dashboard used by recruiting teams.

---

*Last updated: Candidate-facing UI (CandidateAuthContext, candidateApi, JobBoard, JobDetails, ApplyJob, CandidateDashboard, ApplicationStatus, CandidateLayout, CandidateProtectedRoute); useCandidateAuth/usePublicJobs/useCandidateApplications; recruiter login/signup and candidate signup/login must not rethrow (avoid unhandled rejection); api interceptor only clears token on 401 when request was not to /login or /signup. Navbar, Profile, lucide-react as before. Update this spec when new UI requirements are given.*

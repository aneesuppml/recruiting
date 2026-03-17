# Recruiting AI – Admin UI

React admin dashboard for the Recruiting AI platform. Consumes the Rails 7 API for authentication, companies, jobs, candidates, applications, interviews, feedback, and analytics.

## Stack

- **React** (latest) with **Vite**
- **React Router** – routing and protected routes
- **Axios** – API client with JWT injection
- **Tailwind CSS** – styling (light theme, indigo/blue primary)
- **Context API** – auth state

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure API URL** (optional)

   Create a `.env` file (see `.env.example`):

   ```
   VITE_API_URL=http://localhost:3000
   ```

   If not set, the app uses `http://localhost:3000` as the API base URL.

3. **Run the Rails API**

   From the `recruiting-ai` backend:

   ```bash
   cd ../recruiting-ai
   rails server
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open the URL shown (e.g. `http://localhost:5173`).

## Build

```bash
npm run build
```

Output is in `dist/`. Preview with `npm run preview`.

## Routes

| Path           | Page        | Auth   |
|----------------|-------------|--------|
| `/login`       | Login       | Public |
| `/register`    | Register    | Public |
| `/dashboard`   | Dashboard   | Protected |
| `/companies`   | Companies   | Protected |
| `/users`       | Users       | Protected |
| `/jobs`        | Jobs        | Protected |
| `/candidates`  | Candidates  | Protected |
| `/applications`| Applications| Protected |
| `/interviews`  | Interviews  | Protected |
| `/feedback`    | Feedback    | Protected |
| `/reports`     | Reports     | Protected |

## Features

- **Auth:** Login, register, JWT in `localStorage`, logout.
- **Dashboard:** Summary cards, pipeline by status, reports (interviews, hiring rate).
- **Companies:** List, create company.
- **Users:** List users by company, invite user with role (Admin / Recruiter / Interviewer).
- **Jobs:** List, create, edit, close job; status badges.
- **Candidates:** List, add, edit; resume link, AI match score, status.
- **Applications:** List, filter by status, add application, update status (pipeline).
- **Interviews:** List, schedule interview (application, round type, interviewer, time).
- **Feedback:** View feedback by interview, submit feedback (rating, strengths/weaknesses, recommendation).
- **Reports:** Analytics (pipeline, interview conversion, hiring rate).

All protected pages use a sidebar + top navbar layout and require a valid JWT.

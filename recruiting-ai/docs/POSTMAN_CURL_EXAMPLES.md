# Recruiting AI – cURL Examples

Base URL: `http://localhost:3000`

Use the token from signup/login in the `Authorization` header for protected endpoints:  
`Authorization: Bearer <token>`

---

## Auth

### Signup

```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"user@example.com","password":"secret123","password_confirmation":"secret123"}}'
```

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"user@example.com","password":"secret123"}}'
```

---

## Companies

### Create company

```bash
curl -X POST http://localhost:3000/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"company":{"name":"Acme Corp","domain":"acme.com"}}'
```

### Get company

```bash
curl -X GET http://localhost:3000/companies/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### List companies

```bash
curl -X GET http://localhost:3000/companies \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update company

```bash
curl -X PUT http://localhost:3000/companies/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"company":{"name":"Acme Inc","domain":"acme.io"}}'
```

---

## Company users

### List company users

```bash
curl -X GET http://localhost:3000/companies/1/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add user to company

```bash
curl -X POST http://localhost:3000/companies/1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"user":{"email":"recruiter@acme.com","password":"pass123","password_confirmation":"pass123"},"role":"Recruiter"}'
```

---

## Jobs

### List jobs

```bash
curl -X GET "http://localhost:3000/jobs?status=published" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get job

```bash
curl -X GET http://localhost:3000/jobs/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create job

```bash
curl -X POST http://localhost:3000/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"job":{"title":"Senior Rails Developer","description":"Build APIs with Rails 7.","status":"published","department":"Engineering","location":"Remote"}}'
```

### Update job

```bash
curl -X PUT http://localhost:3000/jobs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"job":{"status":"closed"}}'
```

### Delete job

```bash
curl -X DELETE http://localhost:3000/jobs/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Top candidates for job

```bash
curl -X GET http://localhost:3000/jobs/1/top_candidates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Candidates

### List candidates

```bash
curl -X GET "http://localhost:3000/candidates?status=new" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get candidate

```bash
curl -X GET http://localhost:3000/candidates/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create candidate

```bash
curl -X POST http://localhost:3000/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"candidate":{"name":"Jane Doe","email":"jane@example.com","phone":"+1234567890","resume_url":"https://example.com/resume.pdf","linkedin_url":"https://linkedin.com/in/jane","status":"new"}}'
```

### Update candidate

```bash
curl -X PUT http://localhost:3000/candidates/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"candidate":{"status":"screening"}}'
```

### Delete candidate

```bash
curl -X DELETE http://localhost:3000/candidates/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Parse resume

```bash
curl -X POST http://localhost:3000/candidates/1/parse_resume \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"resume_text":"Experienced developer with Ruby, Rails, PostgreSQL and API design."}'
```

---

## Applications

### List applications

```bash
curl -X GET "http://localhost:3000/applications?job_id=1&status=applied" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get application

```bash
curl -X GET http://localhost:3000/applications/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create application

```bash
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"application":{"job_id":1,"candidate_id":1,"status":"applied","applied_at":"2025-03-17T12:00:00Z"}}'
```

### Update application

```bash
curl -X PUT http://localhost:3000/applications/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"application":{"status":"interview"}}'
```

### Delete application

```bash
curl -X DELETE http://localhost:3000/applications/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Interviews

### List interviews

```bash
curl -X GET "http://localhost:3000/interviews?application_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get interview

```bash
curl -X GET http://localhost:3000/interviews/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create interview

```bash
curl -X POST http://localhost:3000/interviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"interview":{"application_id":1,"round_type":"technical","interviewer_id":1,"scheduled_at":"2025-03-20T14:00:00Z","status":"scheduled"}}'
```

### Update interview

```bash
curl -X PUT http://localhost:3000/interviews/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"interview":{"status":"completed"}}'
```

### Delete interview

```bash
curl -X DELETE http://localhost:3000/interviews/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Feedback

### List feedback for interview

```bash
curl -X GET http://localhost:3000/feedback/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create feedback

```bash
curl -X POST http://localhost:3000/feedbacks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"feedback":{"interview_id":1,"rating":4,"strengths":"Strong technical skills","weaknesses":"Could improve communication","recommendation":"hire"}}'
```

### Get feedback

```bash
curl -X GET http://localhost:3000/feedbacks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update feedback

```bash
curl -X PUT http://localhost:3000/feedbacks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"feedback":{"rating":5,"recommendation":"strong_hire"}}'
```

### Delete feedback

```bash
curl -X DELETE http://localhost:3000/feedbacks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Dashboard

### Summary

```bash
curl -X GET http://localhost:3000/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Pipeline

```bash
curl -X GET http://localhost:3000/dashboard/pipeline \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Reports

```bash
curl -X GET http://localhost:3000/dashboard/reports \
  -H "Authorization: Bearer YOUR_TOKEN"
```

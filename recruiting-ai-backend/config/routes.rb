# frozen_string_literal: true

Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # OpenAPI / Swagger UI
  get "api-docs", to: "api_docs#ui"
  get "api-docs/openapi.yaml", to: "api_docs#openapi"

  # Auth (no authentication required)
  post "signup", to: "auth#signup"
  post "login", to: "auth#login"

  # Candidate auth (no recruiter auth required)
  post "candidate/signup", to: "candidate_auth#signup"
  post "candidate/login", to: "candidate_auth#login"

  # Public job board (no auth)
  get "public/jobs", to: "public/jobs#index"
  get "public/jobs/:id", to: "public/jobs#show", as: :public_job

  # Candidate-scoped (candidate JWT required)
  get "candidate/jobs", to: "candidate_jobs#index"
  get "candidate/jobs/:id", to: "candidate_jobs#show"
  get "candidate/dashboard", to: "candidate_applications#index"
  get "candidate/applications/:id", to: "candidate_applications#show"
  post "candidate/applications", to: "candidate_applications#create"

  # Current user profile (authenticated)
  get "profile", to: "profiles#show"
  patch "profile", to: "profiles#update"

  # Company onboarding status (authenticated)
  get "company/status", to: "companies#status"

  # Companies & company users
  resources :companies, only: %i[index show create update] do
    resources :users, only: %i[index create], controller: "company_users"
  end

  # Jobs
  resources :jobs, only: %i[index show create update destroy] do
    get "top_candidates", on: :member, to: "job_candidates#top_candidates"
  end

  # Candidates
  resources :candidates, only: %i[index show create update destroy] do
    post "parse_resume", on: :member, to: "candidate_resume#parse_resume"
  end

  # Applications
  resources :applications, only: %i[index show create update destroy]

  # Interviews
  resources :interviews, only: %i[index show create update destroy]

  # Feedback
  get "feedback/:interview_id", to: "feedbacks#index", as: :interview_feedback
  resources :feedbacks, only: %i[show create update destroy]

  # Dashboard
  get "dashboard/summary", to: "dashboard#summary"
  get "dashboard/pipeline", to: "dashboard#pipeline"
  get "dashboard/reports", to: "dashboard#reports"

  namespace :super_admin, path: "super-admin" do
    resources :companies, only: %i[index create update]
    resources :users, only: %i[index]
    get "analytics/summary", to: "analytics#summary"
  end
end

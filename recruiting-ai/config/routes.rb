# frozen_string_literal: true

Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Auth (no authentication required)
  post "signup", to: "auth#signup"
  post "login", to: "auth#login"

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
end

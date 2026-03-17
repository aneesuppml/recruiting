# frozen_string_literal: true

require "faker"

SEED_PASSWORD = "password123"

# Clear existing data in development/test only (order matters for foreign keys)
if Rails.env.development? || Rails.env.test?
  [Feedback, Interview, Application, Candidate, Job, Membership, User, Role, Company].each do |model|
    model.delete_all
  end
end

# Ensure default roles exist
%w[Admin Recruiter Interviewer].each { |name| Role.find_or_create_by!(name: name) }

admin_role = Role.find_by!(name: "Admin")
recruiter_role = Role.find_by!(name: "Recruiter")
interviewer_role = Role.find_by!(name: "Interviewer")

ActiveRecord::Base.transaction do
  # --- 1. Companies (3) ---
  companies = 3.times.map do |i|
    Company.create!(
      name: Faker::Company.unique.name,
      domain: Faker::Internet.unique.domain_word + ".com"
    )
  end

  # --- 2. Users: 1 Admin, 2 Recruiters, 2 Interviewers per company (15 total) ---
  users_by_company = {}
  companies.each do |company|
    users_by_company[company.id] = {
      admin: nil,
      recruiters: [],
      interviewers: []
    }

    admin = User.create!(
      email: "admin_#{company.id}_#{Faker::Internet.unique.email(domain: company.domain)}",
      password: SEED_PASSWORD,
      password_confirmation: SEED_PASSWORD,
      company_id: company.id
    )
    Membership.create!(user: admin, role: admin_role)
    users_by_company[company.id][:admin] = admin

    2.times do
      u = User.create!(
        email: "recruiter_#{company.id}_#{Faker::Internet.unique.email(domain: company.domain)}",
        password: SEED_PASSWORD,
        password_confirmation: SEED_PASSWORD,
        company_id: company.id
      )
      Membership.create!(user: u, role: recruiter_role)
      users_by_company[company.id][:recruiters] << u
    end

    2.times do
      u = User.create!(
        email: "interviewer_#{company.id}_#{Faker::Internet.unique.email(domain: company.domain)}",
        password: SEED_PASSWORD,
        password_confirmation: SEED_PASSWORD,
        company_id: company.id
      )
      Membership.create!(user: u, role: interviewer_role)
      users_by_company[company.id][:interviewers] << u
    end
  end

  # --- 3. Jobs: 5 per company (15 total) ---
  job_titles = [
    "Senior Software Engineer", "Frontend Developer", "Backend Engineer",
    "Full Stack Developer", "DevOps Engineer", "Product Manager",
    "Data Scientist", "UX Designer", "Engineering Manager",
    "QA Engineer", "Mobile Developer", "Security Engineer",
    "Site Reliability Engineer", "Technical Lead", "Scrum Master"
  ]
  departments = %w[Engineering Product Design Data Operations]
  locations = ["Remote", "New York, NY", "San Francisco, CA", "Austin, TX", "Chicago, IL"]

  jobs_by_company = Hash.new { |h, k| h[k] = [] }
  companies.each do |company|
    company_users = [users_by_company[company.id][:admin]] + users_by_company[company.id][:recruiters]
    5.times do |i|
      title = job_titles.sample
      job = Job.create!(
        title: title,
        description: Faker::Lorem.paragraph(sentence_count: 4),
        status: %w[published published closed].sample,
        department: departments.sample,
        location: locations.sample,
        company_id: company.id,
        created_by_id: company_users.sample.id
      )
      jobs_by_company[company.id] << job
    end
  end

  # --- 4. Candidates: 50 total, distributed across companies ---
  candidate_statuses = %w[new screening interview offer hired rejected]
  counts_per_company = [17, 17, 16]
  all_candidates = []

  companies.each_with_index do |company, idx|
    n = counts_per_company[idx]
    n.times do |i|
      c = Candidate.create!(
        name: Faker::Name.unique.name,
        email: Faker::Internet.unique.email,
        phone: Faker::PhoneNumber.phone_number,
        resume_url: "https://example.com/resumes/#{SecureRandom.hex(4)}.pdf",
        linkedin_url: "https://linkedin.com/in/#{Faker::Internet.username}",
        status: candidate_statuses.sample,
        company_id: company.id,
        resume_text: Faker::Lorem.paragraph(sentence_count: 3),
        skills: Faker::Lorem.words(number: rand(3..8)),
        ai_match_score: rand(50..100)
      )
      all_candidates << c
    end
  end

  # --- 5. Applications: each candidate applies to 1–3 jobs (same company) ---
  application_statuses = %w[applied screening interview offer hired rejected]
  applications_in_interview = []

  all_candidates.each do |candidate|
    company_jobs = jobs_by_company[candidate.company_id]
    num_apps = rand(1..3)
    jobs_to_apply = company_jobs.sample([num_apps, company_jobs.size].min)
    jobs_to_apply.each do |job|
      recruiters = users_by_company[candidate.company_id][:recruiters]
      app = Application.create!(
        candidate_id: candidate.id,
        job_id: job.id,
        user_id: recruiters.sample.id,
        status: application_statuses.sample,
        applied_at: Faker::Time.between(from: 30.days.ago, to: Time.current)
      )
      applications_in_interview << app if app.status == "interview"
    end
  end

  # --- 6. Interviews: for applications with status "interview" ---
  round_types = %w[screening technical hr]
  interview_statuses = %w[scheduled completed completed completed completed cancelled]

  interviews_completed = []
  applications_in_interview.each do |app|
    company_id = app.job.company_id
    interviewers = users_by_company[company_id][:interviewers] + users_by_company[company_id][:recruiters]
    status = interview_statuses.sample
    int = Interview.create!(
      application_id: app.id,
      round_type: round_types.sample,
      interviewer_id: interviewers.sample.id,
      scheduled_at: Faker::Time.between(from: 7.days.ago, to: 7.days.from_now),
      status: status
    )
    interviews_completed << int if status == "completed"
  end

  # --- 7. Feedback: for completed interviews ---
  recommendations = %w[strong_hire hire no_hire strong_no_hire]

  interviews_completed.each do |interview|
    Feedback.create!(
      interview_id: interview.id,
      rating: rand(1..5),
      strengths: Faker::Lorem.sentence(word_count: 6),
      weaknesses: Faker::Lorem.sentence(word_count: 4),
      recommendation: recommendations.sample
    )
  end
end

# Reset Faker unique generators so other code can use Faker after seeds
Faker::UniqueGenerator.clear

puts "Seeded: #{Company.count} companies, #{User.count} users, #{Job.count} jobs, #{Candidate.count} candidates, #{Application.count} applications, #{Interview.count} interviews, #{Feedback.count} feedbacks."

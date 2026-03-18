# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_03_18_000001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "applications", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "job_id", null: false
    t.bigint "candidate_id", null: false
    t.string "status", default: "applied", null: false
    t.datetime "applied_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "resume_url"
    t.text "cover_note"
    t.decimal "ai_score", precision: 5, scale: 2
    t.string "parsed_skills", default: [], array: true
    t.index ["candidate_id"], name: "index_applications_on_candidate_id"
    t.index ["job_id", "candidate_id"], name: "index_applications_on_job_id_and_candidate_id", unique: true
    t.index ["job_id"], name: "index_applications_on_job_id"
    t.index ["user_id"], name: "index_applications_on_user_id"
  end

  create_table "candidates", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "phone"
    t.string "resume_url"
    t.string "linkedin_url"
    t.string "status", default: "new", null: false
    t.bigint "company_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "resume_text"
    t.string "skills", default: [], array: true
    t.decimal "ai_match_score", precision: 5, scale: 2
    t.string "password_digest"
    t.string "location"
    t.index ["company_id", "email"], name: "index_candidates_on_company_id_and_email"
    t.index ["company_id"], name: "index_candidates_on_company_id"
    t.index ["email"], name: "index_candidates_on_email_when_external", unique: true, where: "(company_id IS NULL)"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name", null: false
    t.string "domain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "active", default: true, null: false
    t.index ["active"], name: "index_companies_on_active"
  end

  create_table "feedbacks", force: :cascade do |t|
    t.bigint "interview_id", null: false
    t.integer "rating", null: false
    t.text "strengths"
    t.text "weaknesses"
    t.string "recommendation", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["interview_id"], name: "index_feedbacks_on_interview_id"
  end

  create_table "interviews", force: :cascade do |t|
    t.bigint "application_id", null: false
    t.string "round_type", null: false
    t.bigint "interviewer_id"
    t.datetime "scheduled_at", null: false
    t.string "status", default: "scheduled", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "meeting_link"
    t.index ["application_id"], name: "index_interviews_on_application_id"
    t.index ["interviewer_id"], name: "index_interviews_on_interviewer_id"
  end

  create_table "jobs", force: :cascade do |t|
    t.string "title", null: false
    t.text "description", null: false
    t.string "status", default: "draft", null: false
    t.string "department"
    t.string "location"
    t.bigint "company_id", null: false
    t.bigint "created_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "experience_level"
    t.string "required_skills", default: [], array: true
    t.index ["company_id"], name: "index_jobs_on_company_id"
    t.index ["created_by_id"], name: "index_jobs_on_created_by_id"
  end

  create_table "memberships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "role_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["role_id"], name: "index_memberships_on_role_id"
    t.index ["user_id", "role_id"], name: "index_memberships_on_user_id_and_role_id", unique: true
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_roles_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "company_id"
    t.string "name"
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "applications", "candidates"
  add_foreign_key "applications", "jobs"
  add_foreign_key "applications", "users"
  add_foreign_key "candidates", "companies"
  add_foreign_key "feedbacks", "interviews"
  add_foreign_key "interviews", "applications"
  add_foreign_key "interviews", "users", column: "interviewer_id"
  add_foreign_key "jobs", "companies"
  add_foreign_key "jobs", "users", column: "created_by_id"
  add_foreign_key "memberships", "roles"
  add_foreign_key "memberships", "users"
  add_foreign_key "users", "companies"
end

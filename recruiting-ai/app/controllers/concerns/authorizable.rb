# frozen_string_literal: true

# Role-Based Access Control (RBAC).
# Admin: full access. Recruiter: manage jobs/candidates/applications/interviews/feedback, company users.
# Hiring Manager: view jobs/candidates/applications, participate in interviews/feedback, dashboard.
# Interviewer: only assigned interviews and submit feedback; no jobs, candidates, applications, company settings.
module Authorizable
  extend ActiveSupport::Concern

  def forbid!
    render json: { error: "Forbidden" }, status: :forbidden
  end

  def require_admin!
    forbid! unless current_user.admin?
  end

  def require_recruiter_or_admin!
    forbid! unless current_user.admin? || current_user.recruiter?
  end

  def require_can_manage_jobs!
    forbid! unless current_user.admin? || current_user.recruiter?
  end

  def require_can_view_jobs!
    forbid! unless current_user.admin? || current_user.recruiter? || current_user.hiring_manager?
  end

  def require_can_manage_candidates!
    forbid! unless current_user.admin? || current_user.recruiter?
  end

  def require_can_view_candidates!
    forbid! unless current_user.admin? || current_user.recruiter? || current_user.hiring_manager?
  end

  def require_can_manage_applications!
    forbid! unless current_user.admin? || current_user.recruiter?
  end

  def require_can_update_application!
    forbid! unless current_user.admin? || current_user.recruiter? || current_user.hiring_manager?
  end

  def require_can_view_applications!
    forbid! unless current_user.admin? || current_user.recruiter? || current_user.hiring_manager?
  end

  def require_can_manage_interviews!
    forbid! unless current_user.admin? || current_user.recruiter?
  end

  def require_can_view_interviews!
    forbid! unless current_user.admin? || current_user.recruiter? || current_user.hiring_manager? || current_user.interviewer?
  end

  def require_can_manage_feedback!
    forbid! unless current_user.admin? || current_user.recruiter? || current_user.hiring_manager? || current_user.interviewer?
  end

  def require_can_view_dashboard!
    forbid! unless current_user.admin? || current_user.recruiter? || current_user.hiring_manager?
  end

  def require_can_manage_company_users!
    forbid! unless current_user.admin? || current_user.recruiter?
  end

  def require_can_update_company!
    forbid! unless current_user.admin?
  end

  def require_can_create_company!
    forbid! unless current_user.admin?
  end

  def require_can_view_companies!
    forbid! unless current_user.admin? || current_user.recruiter? || current_user.hiring_manager?
  end

  def require_interviewer_assigned_to!(interview)
    return if current_user.admin? || current_user.recruiter? || current_user.hiring_manager?
    forbid! unless current_user.interviewer? && interview.interviewer_id == current_user.id
  end
end

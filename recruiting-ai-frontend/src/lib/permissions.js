/**
 * Role-Based Access Control (RBAC) permission matrix.
 * Matches backend Authorizable concern. Extend here when adding new permissions.
 */

const ROLES = {
  SuperAdmin: "Super Admin",
  Admin: "Admin",
  Recruiter: "Recruiter",
  HiringManager: "Hiring Manager",
  Interviewer: "Interviewer",
};

/** @param {string[]} roles - user.roles from API */
function hasRole(roles, role) {
  if (!Array.isArray(roles)) return false;
  return roles.includes(role);
}

/** @param {string[]} roles */
function hasAnyRole(roles, allowed) {
  return allowed.some((r) => hasRole(roles, r));
}

/**
 * @param {object} user - { roles: string[] }
 * @returns {object} Permission flags for UI and route guards
 */
export function getPermissions(user) {
  const roles = user?.roles ?? [];
  const superAdmin = hasRole(roles, ROLES.SuperAdmin);
  const admin = hasRole(roles, ROLES.Admin);
  const recruiter = hasRole(roles, ROLES.Recruiter);
  const hiringManager = hasRole(roles, ROLES.HiringManager);
  const interviewer = hasRole(roles, ROLES.Interviewer);

  return {
    // Super Admin module
    canAccessSuperAdmin: superAdmin,
    canViewSuperAdminCompanies: superAdmin,
    canManageSuperAdminCompanies: superAdmin,
    canViewSuperAdminUsers: superAdmin,
    canViewSuperAdminAnalytics: superAdmin,

    // Internal recruiter app (Super Admin is allowed to view but may not have a company context)
    canViewDashboard: superAdmin || admin || recruiter || hiringManager,
    canViewCompanies: superAdmin || admin || recruiter || hiringManager,
    canManageCompanyUsers: superAdmin || admin || recruiter,
    canViewJobs: superAdmin || admin || recruiter || hiringManager,
    canManageJobs: superAdmin || admin || recruiter,
    canViewCandidates: superAdmin || admin || recruiter || hiringManager,
    canManageCandidates: superAdmin || admin || recruiter,
    canViewApplications: superAdmin || admin || recruiter || hiringManager,
    canManageApplications: superAdmin || admin || recruiter,
    canUpdateApplication: superAdmin || admin || recruiter || hiringManager,
    canViewInterviews: superAdmin || admin || recruiter || hiringManager || interviewer,
    canManageInterviews: superAdmin || admin || recruiter,
    canManageFeedback: superAdmin || admin || recruiter || hiringManager || interviewer,
    canViewReports: superAdmin || admin || recruiter || hiringManager,
    canViewSettings: superAdmin || admin,
    canCreateCompany: superAdmin || admin,
    canUpdateCompany: superAdmin || admin,

    isSuperAdmin: superAdmin,
    isAdmin: admin,
    isRecruiter: recruiter,
    isHiringManager: hiringManager,
    isInterviewer: interviewer,
  };
}

/**
 * Path prefix to required permission (for route protection).
 * First matching prefix wins. Profile is allowed for any authenticated user.
 */
export const ROUTE_PERMISSIONS = [
  ["/super-admin/companies", "canViewSuperAdminCompanies"],
  ["/super-admin/users", "canViewSuperAdminUsers"],
  ["/super-admin/analytics", "canViewSuperAdminAnalytics"],
  ["/settings/profile", null],
  ["/dashboard", "canViewDashboard"],
  ["/companies", "canViewCompanies"],
  ["/users", "canManageCompanyUsers"],
  ["/jobs", "canViewJobs"],
  ["/candidates", "canViewCandidates"],
  ["/applications", "canViewApplications"],
  ["/interviews", "canViewInterviews"],
  ["/feedback", "canManageFeedback"],
  ["/reports", "canViewReports"],
  ["/settings", "canViewSettings"],
];

/**
 * @param {string} path - location.pathname
 * @returns {string | null} required permission key or null if no restriction
 */
export function getRequiredPermissionForPath(path) {
  for (const [prefix, permission] of ROUTE_PERMISSIONS) {
    if (path === prefix || path.startsWith(prefix + "/")) return permission;
  }
  return null;
}

/** First path the user is allowed to see (for default redirect when they lack dashboard). */
export function getDefaultPathForUser(user) {
  if (user?.company_status === "pending") return "/pending-approval";

  const perms = getPermissions(user);
  if (perms.canAccessSuperAdmin) return "/super-admin/companies";
  if (perms.canViewDashboard) return "/dashboard";
  if (perms.canViewCompanies) return "/companies";
  if (perms.canManageCompanyUsers) return "/users";
  if (perms.canViewJobs) return "/jobs";
  if (perms.canViewCandidates) return "/candidates";
  if (perms.canViewApplications) return "/applications";
  if (perms.canViewInterviews) return "/interviews";
  if (perms.canManageFeedback) return "/feedback";
  if (perms.canViewReports) return "/reports";
  if (perms.canViewSettings) return "/settings";
  // Safe fallback (doesn't require a specific permission)
  return "/settings/profile";
}

export { ROLES };

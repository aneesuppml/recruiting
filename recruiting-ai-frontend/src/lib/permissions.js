/**
 * Role-Based Access Control (RBAC) permission matrix.
 * Matches backend Authorizable concern. Extend here when adding new permissions.
 */

const ROLES = {
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
  const admin = hasRole(roles, ROLES.Admin);
  const recruiter = hasRole(roles, ROLES.Recruiter);
  const hiringManager = hasRole(roles, ROLES.HiringManager);
  const interviewer = hasRole(roles, ROLES.Interviewer);

  return {
    canViewDashboard: admin || recruiter || hiringManager,
    canViewCompanies: admin || recruiter || hiringManager,
    canManageCompanyUsers: admin || recruiter,
    canViewJobs: admin || recruiter || hiringManager,
    canManageJobs: admin || recruiter,
    canViewCandidates: admin || recruiter || hiringManager,
    canManageCandidates: admin || recruiter,
    canViewApplications: admin || recruiter || hiringManager,
    canManageApplications: admin || recruiter,
    canUpdateApplication: admin || recruiter || hiringManager,
    canViewInterviews: admin || recruiter || hiringManager || interviewer,
    canManageInterviews: admin || recruiter,
    canManageFeedback: admin || recruiter || hiringManager || interviewer,
    canViewReports: admin || recruiter || hiringManager,
    canViewSettings: admin,
    canCreateCompany: admin,
    canUpdateCompany: admin,

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
  const perms = getPermissions(user);
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
  return "/dashboard";
}

export { ROLES };

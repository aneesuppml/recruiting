import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { getPermissions, getRequiredPermissionForPath, getDefaultPathForUser } from "../lib/permissions";

/**
 * Protects routes by role: if the current path requires a permission the user
 * doesn't have, redirects to first allowed page. Use inside ProtectedRoute (auth already required).
 */
export function RoleProtectedRoute({ children }) {
  const location = useLocation();
  const { user } = useAuthContext();
  const path = location.pathname;
  const requiredPermission = getRequiredPermissionForPath(path);

  if (!user) return children; // Let ProtectedRoute handle unauthenticated
  // If roles aren't present yet (e.g. older localStorage session), avoid redirect loops.
  // Backend still enforces RBAC; UI gating becomes active once roles are available.
  if (!Array.isArray(user.roles)) return children;

  const permissions = getPermissions(user);
  if (requiredPermission == null) return children;
  if (permissions[requiredPermission]) return children;

  const defaultPath = getDefaultPathForUser(user);
  return <Navigate to={defaultPath} replace state={{ from: location, forbidden: true }} />;
}

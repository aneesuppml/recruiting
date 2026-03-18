import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { getPermissions } from "../lib/permissions";

export function SuperAdminRoute({ children }) {
  const { user } = useAuthContext();
  const location = useLocation();

  const perms = getPermissions(user);
  if (!perms.canAccessSuperAdmin) {
    return <Navigate to="/" replace state={{ from: location, forbidden: true }} />;
  }

  return children;
}


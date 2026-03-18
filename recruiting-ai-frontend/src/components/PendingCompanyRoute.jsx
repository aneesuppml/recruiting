import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const allowedPendingPaths = ["/pending-approval", "/settings/profile"];

export function PendingCompanyRoute({ children }) {
  const location = useLocation();
  const { user } = useAuthContext();

  if (!user) return children;

  // Super Admin shouldn't be constrained by pending tenant rules.
  const roles = Array.isArray(user.roles) ? user.roles : [];
  const isSuperAdmin = roles.includes("Super Admin");

  if (isSuperAdmin) return children;

  if (user.company_status !== "pending") return children;

  const path = location.pathname;
  if (allowedPendingPaths.includes(path)) return children;

  if (path.startsWith("/settings")) {
    return <Navigate to="/settings/profile" replace state={{ from: location, pending: true }} />;
  }

  return <Navigate to="/pending-approval" replace state={{ from: location, pending: true }} />;
}


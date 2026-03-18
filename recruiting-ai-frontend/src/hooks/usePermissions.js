import { useMemo } from "react";
import { useAuthContext } from "../context/AuthContext";
import { getPermissions } from "../lib/permissions";

/**
 * Returns permission flags for the current user. Use for conditional UI and route guards.
 */
export function usePermissions() {
  const { user } = useAuthContext();
  return useMemo(() => getPermissions(user), [user]);
}

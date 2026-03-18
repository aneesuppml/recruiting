import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      setToken((prev) => (prev === t ? prev : t));
      setUser((prev) => {
        const next = u ? JSON.parse(u) : null;
        // Avoid needless state updates that can cause render loops
        if (!prev && !next) return prev;
        if (
          prev &&
          next &&
          prev.id === next.id &&
          prev.email === next.email &&
          prev.name === next.name &&
          prev.company_id === next.company_id &&
          prev.active_company_id === next.active_company_id &&
          prev.company_status === next.company_status
        ) {
          // roles may be present; compare shallowly if both have roles arrays
          const prevRoles = Array.isArray(prev.roles) ? prev.roles.join("|") : "";
          const nextRoles = Array.isArray(next.roles) ? next.roles.join("|") : "";
          if (prevRoles === nextRoles) return prev;
        }
        return next;
      });
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const login = (userData, jwt) => {
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
  };

  const updateUser = (userData) => {
    if (!userData) return;
    const stored = JSON.stringify(userData);
    localStorage.setItem("user", stored);
    setUser(userData);
    window.dispatchEvent(new Event("auth-change"));
  };

  const value = { user, token, loading, login, logout, updateUser, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

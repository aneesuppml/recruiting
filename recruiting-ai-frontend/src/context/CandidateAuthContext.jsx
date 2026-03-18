import { createContext, useContext, useState, useEffect } from "react";

const CANDIDATE_TOKEN_KEY = "candidateToken";
const CANDIDATE_USER_KEY = "candidate";

const CandidateAuthContext = createContext(null);

export function CandidateAuthProvider({ children }) {
  const [candidate, setCandidate] = useState(() => {
    try {
      const stored = localStorage.getItem(CANDIDATE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(CANDIDATE_TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem(CANDIDATE_TOKEN_KEY);
    const u = localStorage.getItem(CANDIDATE_USER_KEY);
    setToken(t);
    setCandidate(u ? JSON.parse(u) : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setToken(localStorage.getItem(CANDIDATE_TOKEN_KEY));
      const u = localStorage.getItem(CANDIDATE_USER_KEY);
      setCandidate(u ? JSON.parse(u) : null);
    };
    window.addEventListener("candidate-auth-change", handleChange);
    return () => window.removeEventListener("candidate-auth-change", handleChange);
  }, []);

  const login = (candidateData, jwt) => {
    localStorage.setItem(CANDIDATE_TOKEN_KEY, jwt);
    localStorage.setItem(CANDIDATE_USER_KEY, JSON.stringify(candidateData));
    setToken(jwt);
    setCandidate(candidateData);
    window.dispatchEvent(new Event("candidate-auth-change"));
  };

  const logout = () => {
    localStorage.removeItem(CANDIDATE_TOKEN_KEY);
    localStorage.removeItem(CANDIDATE_USER_KEY);
    setToken(null);
    setCandidate(null);
    window.dispatchEvent(new Event("candidate-auth-change"));
  };

  const value = {
    candidate,
    token,
    loading,
    login,
    logout,
    isCandidateAuthenticated: !!token,
  };
  return (
    <CandidateAuthContext.Provider value={value}>
      {children}
    </CandidateAuthContext.Provider>
  );
}

export function useCandidateAuthContext() {
  const ctx = useContext(CandidateAuthContext);
  if (!ctx) throw new Error("useCandidateAuthContext must be used within CandidateAuthProvider");
  return ctx;
}

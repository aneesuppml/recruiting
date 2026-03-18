import { Navigate, useLocation } from "react-router-dom";
import { useCandidateAuthContext } from "../context/CandidateAuthContext";

export function CandidateProtectedRoute({ children }) {
  const { isCandidateAuthenticated, loading } = useCandidateAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isCandidateAuthenticated) {
    return <Navigate to="/candidate/login" state={{ from: location }} replace />;
  }

  return children;
}

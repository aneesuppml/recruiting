import { Link, useNavigate } from "react-router-dom";
import { useCandidateAuthContext } from "../context/CandidateAuthContext";
import { LayoutDashboard, Briefcase, LogOut } from "lucide-react";

export function CandidateLayout({ children }) {
  const { candidate, logout, isCandidateAuthenticated } = useCandidateAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/candidate/login");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900 shadow-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/candidate/jobs" className="text-lg font-semibold text-white hover:text-blue-200">
            Recruiting AI – Jobs
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/candidate/jobs"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white"
            >
              <Briefcase className="h-4 w-4" />
              Job board
            </Link>
            {isCandidateAuthenticated ? (
              <>
                <Link
                  to="/candidate/dashboard"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My applications
                </Link>
                <span className="text-sm text-gray-300">{candidate?.email}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/candidate/login"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  to="/candidate/signup"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

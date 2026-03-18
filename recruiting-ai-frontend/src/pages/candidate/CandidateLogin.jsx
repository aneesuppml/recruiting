import { useState } from "react";
import { Link } from "react-router-dom";
import { useCandidateAuth } from "../../hooks/useCandidateAuth";
import { ProductHeader } from "../../components/landing/ProductHeader";
import { LoginSideContent } from "../../components/landing/LoginSideContent";
import { Briefcase, CalendarDays, FileText, Sparkles, BarChart3 } from "lucide-react";

export function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, setError } = useCandidateAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white">
      <ProductHeader />

      <div className="px-4 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <LoginSideContent
            eyebrow="Candidate Experience"
            title="Browse jobs + apply in minutes"
            description="A streamlined candidate journey with AI resume shortlisting, applications tracking, interviews, and feedback."
            bullets={[
              { Icon: Briefcase, text: "Jobs / Job Board", subtext: "Search and view active roles." },
              { Icon: FileText, text: "AI Resume Shortlisting", subtext: "Ranked by AI match signals." },
              { Icon: BarChart3, text: "Applications & Status", subtext: "Track progress end-to-end." },
              { Icon: CalendarDays, text: "Interviews", subtext: "Scheduled rounds with meeting links." },
              { Icon: Sparkles, text: "Feedback & Ratings", subtext: "Structured interview feedback." },
            ]}
          />

          <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:mx-auto">
            <div className="mb-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-center">
              <h1 className="text-center text-xl font-semibold text-gray-900">Candidate Login</h1>
              <p className="mt-1 text-center text-sm text-gray-600">Browse jobs, apply, and track your pipeline</p>
            </div>

            <p className="mb-5 text-center text-sm text-gray-600">
              Are you an internal user?{" "}
              <Link to="/login/internal" className="font-medium text-blue-600 hover:text-blue-500">
                Internal login
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="candidate-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="candidate-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="candidate-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="candidate-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/candidate/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              <Link to="/candidate/jobs" className="text-blue-600 hover:text-blue-500">
                Browse jobs
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

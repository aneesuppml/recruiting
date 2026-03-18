import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ProductHeader } from "../components/landing/ProductHeader";
import { LoginSideContent } from "../components/landing/LoginSideContent";
import {
  BarChart3,
  Briefcase,
  Building2,
  ShieldCheck,
  FileText,
  CalendarDays,
} from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, setError } = useAuth();

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
            eyebrow="Internal Platform"
            title="Recruiting AI for companies & teams"
            description="Manage tenant companies, jobs, candidates, interviews, feedback and analytics — with RBAC enforced."
            bullets={[
              { Icon: ShieldCheck, text: "RBAC + Tenant Isolation", subtext: "Only allowed modules/actions for each role." },
              { Icon: Building2, text: "Companies (Multi-tenant)", subtext: "Active company context via X-Company-ID." },
              { Icon: Briefcase, text: "Jobs & Pipelines", subtext: "Status filters + top candidate ranking." },
              { Icon: FileText, text: "Candidates + AI Shortlisting", subtext: "AI score and extracted skills." },
              { Icon: CalendarDays, text: "Interviews + Feedback", subtext: "Structured rounds and ratings." },
              { Icon: BarChart3, text: "Dashboard & Analytics", subtext: "Conversion and hiring rate reporting." },
            ]}
          />

          <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:mx-auto">
            <div className="mb-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-center">
              <h1 className="text-center text-xl font-semibold text-gray-900">Internal Login</h1>
              <p className="mt-1 text-center text-sm text-gray-600">Admin / Recruiter / Hiring Manager / Interviewer</p>
            </div>

            <p className="mb-5 text-center text-sm text-gray-600">
              Are you a candidate?{" "}
              <Link to="/login/candidate" className="font-medium text-blue-600 hover:text-blue-500">
                Candidate login
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-100">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
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
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

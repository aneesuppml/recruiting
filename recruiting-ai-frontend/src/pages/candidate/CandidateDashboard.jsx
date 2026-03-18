import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCandidateApplications } from "../../hooks/useCandidateApplications";
import { StatusBadge } from "../../components/StatusBadge";
import { ClipboardList } from "lucide-react";

export function CandidateDashboard() {
  const { applications, loading, error, fetchMyApplications } = useCandidateApplications();

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">My applications</h1>
        <p className="mt-1 text-sm text-gray-500">Track the status of your job applications.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {applications.length === 0 ? (
              <li className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">You haven’t applied to any jobs yet.</p>
                <Link
                  to="/candidate/jobs"
                  className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Browse jobs
                </Link>
              </li>
            ) : (
              applications.map((app) => (
                <li key={app.id}>
                  <Link
                    to={`/candidate/applications/${app.id}`}
                    className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-indigo-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-gray-900">{app.job_title}</h2>
                        <p className="mt-0.5 text-sm text-gray-500">{app.company_name}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "—"}
                          {app.ai_score != null && ` · Match score: ${app.ai_score}%`}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

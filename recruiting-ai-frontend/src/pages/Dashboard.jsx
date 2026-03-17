import { useDashboard } from "../hooks/useDashboard";
import { DashboardCard } from "../components/DashboardCard";

export function Dashboard() {
  const { summary, pipeline, reports, loading, error } = useDashboard();

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Jobs" value={summary?.total_jobs ?? "—"} icon="💼" />
        <DashboardCard title="Active Jobs" value={summary?.active_jobs ?? "—"} icon="✅" />
        <DashboardCard title="Total Candidates" value={summary?.total_candidates ?? "—"} icon="👤" />
        <DashboardCard title="Total Applications" value={summary?.total_applications ?? "—"} icon="📋" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Pipeline by status</h2>
          {pipeline?.pipeline && Object.keys(pipeline.pipeline).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(pipeline.pipeline).map(([status, count]) => (
                <li key={status} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-600">{status}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No pipeline data</p>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Reports</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Total interviews</span>
              <span className="font-medium">{reports?.total_interviews ?? "—"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Completed interviews</span>
              <span className="font-medium">{reports?.completed_interviews ?? "—"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Interview conversion rate</span>
              <span className="font-medium">{reports?.interview_conversion_rate != null ? `${reports.interview_conversion_rate}%` : "—"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Hired count</span>
              <span className="font-medium">{reports?.hired_count ?? "—"}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Hiring rate</span>
              <span className="font-medium">{reports?.hiring_rate != null ? `${reports.hiring_rate}%` : "—"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

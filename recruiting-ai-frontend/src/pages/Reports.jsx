import { useDashboard } from "../hooks/useDashboard";
import { DashboardCard } from "../components/DashboardCard";

export function Reports() {
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
      <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total jobs" value={summary?.total_jobs ?? "—"} />
        <DashboardCard title="Active jobs" value={summary?.active_jobs ?? "—"} />
        <DashboardCard title="Total candidates" value={summary?.total_candidates ?? "—"} />
        <DashboardCard title="Total applications" value={summary?.total_applications ?? "—"} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Pipeline breakdown</h2>
          {pipeline?.pipeline && Object.keys(pipeline.pipeline).length > 0 ? (
            <ul className="space-y-3">
              {Object.entries(pipeline.pipeline).map(([status, count]) => (
                <li key={status} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="capitalize text-gray-700">{status}</span>
                  <span className="font-semibold text-indigo-600">{count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No pipeline data</p>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Interview & hiring metrics</h2>
          <ul className="space-y-3">
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
              <span className="text-gray-600">Hired</span>
              <span className="font-medium text-green-600">{reports?.hired_count ?? "—"}</span>
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

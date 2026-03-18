import { DashboardCard } from "../../components/DashboardCard";
import { useSuperAdminAnalytics } from "../../hooks/useSuperAdmin";
import { Building2, Users, Briefcase, ClipboardList, Calendar } from "lucide-react";

export function SuperAdminAnalytics() {
  const { summary, loading, error, setError } = useSuperAdminAnalytics();

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert" onAnimationEnd={() => setError(null)}>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">System Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">High-level metrics across all tenants.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Companies" value={summary?.total_companies ?? "—"} icon={<Building2 />} />
        <DashboardCard title="Active companies" value={summary?.active_companies ?? "—"} icon={<Building2 />} />
        <DashboardCard title="Users" value={summary?.total_users ?? "—"} icon={<Users />} />
        <DashboardCard title="Jobs" value={summary?.total_jobs ?? "—"} icon={<Briefcase />} />
        <DashboardCard title="Candidates" value={summary?.total_candidates ?? "—"} icon={<Users />} />
        <DashboardCard title="Applications" value={summary?.total_applications ?? "—"} icon={<ClipboardList />} />
        <DashboardCard title="Interviews" value={summary?.total_interviews ?? "—"} icon={<Calendar />} />
      </div>
    </div>
  );
}


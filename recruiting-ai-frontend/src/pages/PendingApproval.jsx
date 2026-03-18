import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthContext } from "../context/AuthContext";

function formatAddress(addr) {
  if (!addr) return "-";
  const line2 = addr.address_line2 ? `, ${addr.address_line2}` : "";
  const postal = addr.postal_code ? ` ${addr.postal_code}` : "";
  return `${addr.address_line1 || ""}${line2}, ${addr.city || ""}, ${addr.state || ""} ${addr.country || ""}${postal}`.replace(/\s+/g, " ").trim();
}

export function PendingApproval() {
  const { user, updateUser } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await api.get("/company/status");
        if (!cancelled) {
          setData(res);
          if (res?.company?.status) {
              if (user?.id) {
                updateUser({
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  company_id: user.company_id,
                  company_status: res.company.status,
                });
              }
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || "Failed to load company status");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const company = data?.company;
  const isPending = company?.status === "pending";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isPending ? "Your company is under verification" : "Your company is not ready to access the full app"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isPending ? "Your company is under verification. Access will be granted once approved." : `Current status: ${company?.status || "unknown"}.`}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      {company && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Company details</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">Company name:</span> {company.name}
              </div>
              <div>
                <span className="font-medium text-gray-900">Domain:</span> {company.domain}
              </div>
              <div>
                <span className="font-medium text-gray-900">Status:</span>{" "}
                {company.status === "pending" ? "Pending Approval" : company.status}
              </div>
              <div>
                <span className="font-medium text-gray-900">Created at:</span> {company.created_at ? String(company.created_at) : "-"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Company size:</span> {company.company_size || "-"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Industry:</span> {company.industry || "-"}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Address & contact</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">Address:</span> {formatAddress(company)}
              </div>
              <div>
                <span className="font-medium text-gray-900">Contact email:</span> {company.contact_email || "-"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Contact phone:</span> {company.contact_phone || "-"}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">Admin user</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">Name:</span> {data?.admin_user?.name || user?.name || "-"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Email:</span> {data?.admin_user?.email || user?.email || "-"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


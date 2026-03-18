import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthContext } from "../context/AuthContext";

export function CompanySwitcher() {
  const { user, updateUser } = useAuthContext();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const activeCompanyId = user?.active_company_id || user?.company_id;

  useEffect(() => {
    let cancelled = false;
    async function loadCompanies() {
      if (!user) return;
      setLoading(true);
      try {
        const { data } = await api.get("/companies");
        const list = Array.isArray(data) ? data : [];
        if (cancelled) return;
        setCompanies(list);

        // Initialize active company if missing.
        if (list.length > 0) {
          const desiredId = user?.active_company_id || user?.company_id || list[0].id;
          if (!user?.active_company_id && (!user?.company_id || user.company_id !== desiredId)) {
            const selected = list.find((c) => String(c.id) === String(desiredId)) || list[0];
            updateUser({
              ...user,
              active_company_id: selected.id,
              company_status: selected.status,
            });
          }
        }
      } catch (_) {
        if (!cancelled) setCompanies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCompanies().catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) return null;
  const roles = Array.isArray(user.roles) ? user.roles : [];
  const isSuperAdmin = roles.includes("Super Admin");
  if (isSuperAdmin) return null;
  if (loading) return null;
  if (!Array.isArray(companies) || companies.length <= 1) return null;

  const selectedId = activeCompanyId ? String(activeCompanyId) : String(companies[0]?.id);
  const selected = companies.find((c) => String(c.id) === selectedId) || companies[0];

  const handleChange = (e) => {
    const nextId = e.target.value;
    const next = companies.find((c) => String(c.id) === String(nextId));
    if (!next) return;

    updateUser({
      ...user,
      active_company_id: next.id,
      company_status: next.status,
    });

    if (next.status === "pending" || next.status === "rejected") navigate("/pending-approval");
    else navigate("/dashboard");
  };

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs font-medium text-gray-300 sm:block">Company</span>
      <select
        value={selectedId}
        onChange={handleChange}
        className="max-w-[240px] rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select active company"
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.domain || c.name}
            {" "}
            ({c.status})
          </option>
        ))}
      </select>
    </div>
  );
}


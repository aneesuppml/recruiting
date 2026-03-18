import { useState } from "react";
import { useApplications } from "../hooks/useApplications";
import { useJobs } from "../hooks/useJobs";
import { useCandidates } from "../hooks/useCandidates";
import { usePermissions } from "../hooks/usePermissions";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { FormModal } from "../components/FormModal";

const STATUSES = ["applied", "screening", "interview", "offer", "hired", "rejected"];

export function Applications() {
  const { applications, loading, error, createApplication, updateApplication, setError } = useApplications();
  const { jobs } = useJobs();
  const { candidates } = useCandidates();
  const { canManageApplications, canUpdateApplication } = usePermissions();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState({ job_id: "", candidate_id: "", status: "applied" });
  const [updating, setUpdating] = useState(null);

  const filtered = filterStatus
    ? applications.filter((a) => a.status === filterStatus)
    : applications;

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createApplication({ ...form, applied_at: new Date().toISOString() });
      setModalOpen(false);
      setForm({ job_id: "", candidate_id: "", status: "applied" });
    } catch (_) {}
  };

  const handleStatusChange = async (app, newStatus) => {
    try {
      await updateApplication(app.id, { ...app, status: newStatus });
      setUpdating(null);
    } catch (_) {}
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "job_id", label: "Job ID" },
    { key: "candidate_id", label: "Candidate ID" },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "applied_at",
      label: "Applied",
      render: (row) => (row.applied_at ? new Date(row.applied_at).toLocaleDateString() : "—"),
    },
    ...(canUpdateApplication
      ? [
          {
            key: "actions",
            label: "Update status",
            render: (row) => (
              <select
                value={row.status}
                onChange={(e) => {
                  setUpdating(row.id);
                  handleStatusChange(row, e.target.value);
                }}
                disabled={updating === row.id}
                className="rounded border border-gray-300 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {canManageApplications && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Add application
            </button>
          )}
        </div>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && !applications.length ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No applications." />
      )}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add application">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job</label>
            <select
              value={form.job_id}
              onChange={(e) => setForm((f) => ({ ...f, job_id: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Select job</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} (#{j.id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Candidate</label>
            <select
              value={form.candidate_id}
              onChange={(e) => setForm((f) => ({ ...f, candidate_id: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Select candidate</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
              Add
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

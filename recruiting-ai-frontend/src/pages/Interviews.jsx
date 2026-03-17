import { useState } from "react";
import { useInterviews } from "../hooks/useInterviews";
import { useApplications } from "../hooks/useApplications";
import { useCompanies } from "../hooks/useCompanies";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { FormModal } from "../components/FormModal";

const ROUND_TYPES = ["phone", "screening", "technical", "behavioral", "hr", "final"];
const STATUSES = ["scheduled", "completed", "cancelled", "no_show"];

export function Interviews() {
  const { interviews, loading, error, createInterview, updateInterview, setError } = useInterviews();
  const { applications } = useApplications();
  const { users } = useCompanies();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    application_id: "",
    round_type: "technical",
    interviewer_id: "",
    scheduled_at: "",
    status: "scheduled",
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createInterview({
        ...form,
        application_id: Number(form.application_id),
        interviewer_id: form.interviewer_id ? Number(form.interviewer_id) : null,
        scheduled_at: form.scheduled_at || new Date().toISOString(),
      });
      setModalOpen(false);
      setForm({ application_id: "", round_type: "technical", interviewer_id: "", scheduled_at: "", status: "scheduled" });
    } catch (_) {}
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "application_id", label: "Application ID" },
    { key: "round_type", label: "Round" },
    { key: "interviewer_id", label: "Interviewer ID" },
    {
      key: "scheduled_at",
      label: "Scheduled",
      render: (row) => (row.scheduled_at ? new Date(row.scheduled_at).toLocaleString() : "—"),
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Interviews</h1>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Schedule interview
        </button>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && !interviews.length ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable columns={columns} data={interviews} emptyMessage="No interviews scheduled." />
      )}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule interview">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Application</label>
            <select
              value={form.application_id}
              onChange={(e) => setForm((f) => ({ ...f, application_id: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Select application</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  Application #{a.id} (Job {a.job_id}, Candidate {a.candidate_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Round type</label>
            <select
              value={form.round_type}
              onChange={(e) => setForm((f) => ({ ...f, round_type: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {ROUND_TYPES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interviewer (user ID)</label>
            <input
              type="number"
              value={form.interviewer_id}
              onChange={(e) => setForm((f) => ({ ...f, interviewer_id: e.target.value }))}
              placeholder="Optional"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scheduled at</label>
            <input
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : "" }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
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
              Schedule
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

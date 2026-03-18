import { useState } from "react";
import { useFeedback } from "../hooks/useFeedback";
import { useInterviews } from "../hooks/useInterviews";
import { DataTable } from "../components/DataTable";
import { FormModal } from "../components/FormModal";

const RECOMMENDATIONS = ["strong_hire", "hire", "no_hire", "strong_no_hire"];

export function Feedback() {
  const { feedbacks, loading, error, fetchFeedbacksByInterview, createFeedback, setError } = useFeedback();
  const { interviews } = useInterviews();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [form, setForm] = useState({
    interview_id: "",
    rating: 3,
    strengths: "",
    weaknesses: "",
    recommendation: "hire",
  });

  const loadFeedbacks = (interviewId) => {
    setSelectedInterviewId(interviewId);
    if (interviewId) fetchFeedbacksByInterview(interviewId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFeedback({
        interview_id: Number(form.interview_id),
        rating: Number(form.rating),
        strengths: form.strengths,
        weaknesses: form.weaknesses,
        recommendation: form.recommendation,
      });
      setModalOpen(false);
      setForm({ interview_id: "", rating: 3, strengths: "", weaknesses: "", recommendation: "hire" });
      if (form.interview_id) fetchFeedbacksByInterview(form.interview_id);
    } catch (_) {}
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "interview_id", label: "Interview ID" },
    { key: "rating", label: "Rating" },
    { key: "strengths", label: "Strengths" },
    { key: "weaknesses", label: "Weaknesses" },
    { key: "recommendation", label: "Recommendation" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Feedback</h1>
        <div className="flex items-center gap-2">
          <select
            value={selectedInterviewId ?? ""}
            onChange={(e) => loadFeedbacks(e.target.value ? Number(e.target.value) : null)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select interview to view feedback</option>
            {interviews.map((i) => (
              <option key={i.id} value={i.id}>
                Interview #{i.id} (App {i.application_id}, {i.round_type})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Submit feedback
          </button>
        </div>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && !feedbacks.length && selectedInterviewId ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={feedbacks}
          emptyMessage={selectedInterviewId ? "No feedback for this interview." : "Select an interview to view feedback."}
        />
      )}
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Submit feedback">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Interview</label>
            <select
              value={form.interview_id}
              onChange={(e) => setForm((f) => ({ ...f, interview_id: e.target.value }))}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select interview</option>
              {interviews.map((i) => (
                <option key={i.id} value={i.id}>
                  #{i.id} – {i.round_type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1–5)</label>
            <select
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Strengths</label>
            <textarea
              value={form.strengths}
              onChange={(e) => setForm((f) => ({ ...f, strengths: e.target.value }))}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weaknesses</label>
            <textarea
              value={form.weaknesses}
              onChange={(e) => setForm((f) => ({ ...f, weaknesses: e.target.value }))}
              rows={2}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Recommendation</label>
            <select
              value={form.recommendation}
              onChange={(e) => setForm((f) => ({ ...f, recommendation: e.target.value }))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {RECOMMENDATIONS.map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              Submit
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCandidateApplications } from "../../hooks/useCandidateApplications";
import candidateApi from "../../services/candidateApi";
import { useCandidateAuthContext } from "../../context/CandidateAuthContext";

export function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { apply, loading, error, setError } = useCandidateApplications();
  const { isCandidateAuthenticated } = useCandidateAuthContext();
  const [job, setJob] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");

  useEffect(() => {
    if (!jobId) return;
    const request = candidateApi.get(`/candidate/jobs/${jobId}`).catch(() => null);
    request.then((res) => setJob(res?.data ?? null)).catch(() => setJob(null));
  }, [jobId, isCandidateAuthenticated, candidateApi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await apply(Number(jobId), { resume_url: resumeUrl || undefined, cover_note: coverNote || undefined });
      navigate("/candidate/dashboard");
    } catch (_) {}
  };

  if (!job && jobId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <p className="text-red-600">Job not found.</p>
        <Link to="/candidate/jobs" className="mt-2 inline-block text-blue-700 hover:underline">Back to job board</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-xl px-4 py-8">
        <Link
          to={`/candidate/jobs/${jobId}`}
          className="mb-6 inline-block text-sm font-medium text-blue-700 hover:text-blue-600"
        >
          ← Back to job
        </Link>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Apply for {job.title}</h1>
          {job.company?.name && (
            <p className="mt-1 text-sm text-gray-500">{job.company.name}</p>
          )}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}
            <div>
              <label htmlFor="resume_url" className="block text-sm font-medium text-gray-700">
                Resume URL (PDF or DOCX link)
              </label>
              <input
                id="resume_url"
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="cover_note" className="block text-sm font-medium text-gray-700">
                Cover note (optional)
              </label>
              <textarea
                id="cover_note"
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Submit application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

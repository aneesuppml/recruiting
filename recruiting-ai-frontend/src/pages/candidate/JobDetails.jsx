import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { usePublicJobs } from "../../hooks/usePublicJobs";
import { MapPin, Building2 } from "lucide-react";

export function JobDetails() {
  const { id } = useParams();
  const { job, loading, error, fetchJob } = usePublicJobs();

  useEffect(() => {
    if (id) fetchJob(Number(id));
  }, [id, fetchJob]);

  if (loading && !job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-4 text-red-700">
          {error || "Job not found."}
          <Link to="/candidate/jobs" className="ml-2 underline">Back to job board</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          to="/candidate/jobs"
          className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back to job board
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
          {job.company && (
            <p className="mt-1 flex items-center gap-1 text-gray-600">
              <Building2 className="h-4 w-4" />
              {job.company.name}
              {job.company.domain && ` (${job.company.domain})`}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
            )}
            {job.department && <span>{job.department}</span>}
            {job.experience_level && (
              <span className="rounded bg-gray-100 px-2 py-0.5">{job.experience_level}</span>
            )}
          </div>
          {job.required_skills?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Required skills</h3>
              <p className="mt-1 text-sm text-gray-600">{job.required_skills.join(", ")}</p>
            </div>
          )}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <div className="mt-2 whitespace-pre-wrap text-gray-600">{job.description}</div>
          </div>
          <div className="mt-8">
            <Link
              to={`/candidate/apply/${job.id}`}
              className="inline-flex rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700"
            >
              Apply for this job
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              You will need to sign in or create an account to apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

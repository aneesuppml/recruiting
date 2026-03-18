import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCandidateApplications } from "../../hooks/useCandidateApplications";
import { Calendar, Video, User } from "lucide-react";

export function ApplicationStatus() {
  const { id } = useParams();
  const { application, loading, error, fetchApplication } = useCandidateApplications();

  useEffect(() => {
    if (id) fetchApplication(id);
  }, [id, fetchApplication]);

  if (loading && !application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-white px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg bg-red-50 p-4 text-red-700">
          {error || "Application not found."}
          <Link to="/candidate/dashboard" className="ml-2 underline">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const interview = application.interview;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/candidate/dashboard"
          className="mb-6 inline-block text-sm font-medium text-blue-700 hover:text-blue-600"
        >
          ← Back to dashboard
        </Link>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">{application.job_title}</h1>
          <p className="mt-1 text-gray-600">{application.company_name}</p>
          <p className="mt-4">
            <span className="text-sm font-medium text-gray-500">Status: </span>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-sm font-medium text-blue-800 capitalize">
              {application.status.replace(/_/g, " ")}
            </span>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Applied on {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : "—"}
            {application.ai_score != null && ` · AI match score: ${application.ai_score}%`}
          </p>

          {interview && (
            <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50/40 p-6">
              <h2 className="font-medium text-gray-900">Interview details</h2>
              <dl className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {new Date(interview.scheduled_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                {interview.round_type && (
                  <p className="text-sm text-gray-600">Round: {interview.round_type}</p>
                )}
                {interview.meeting_link && (
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-gray-500" />
                    <a
                      href={interview.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-700 hover:underline"
                    >
                      Join meeting
                    </a>
                  </div>
                )}
                {interview.interviewer && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>
                      {interview.interviewer.name || interview.interviewer.email}
                    </span>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

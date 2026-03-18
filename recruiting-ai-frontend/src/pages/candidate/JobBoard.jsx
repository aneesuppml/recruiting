import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePublicJobs } from "../../hooks/usePublicJobs";
import { useCandidateJobs } from "../../hooks/useCandidateJobs";
import { Briefcase, MapPin } from "lucide-react";
import { useCandidateAuthContext } from "../../context/CandidateAuthContext";

export function JobBoard() {
  const publicJobs = usePublicJobs();
  const candidateJobsHook = useCandidateJobs();
  const { isCandidateAuthenticated } = useCandidateAuthContext();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  useEffect(() => {
    const fn = isCandidateAuthenticated ? candidateJobsHook.fetchJobs : publicJobs.fetchJobs;
    fn();
  }, [isCandidateAuthenticated, publicJobs.fetchJobs, candidateJobsHook.fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    const fn = isCandidateAuthenticated ? candidateJobsHook.fetchJobs : publicJobs.fetchJobs;
    fn({
      title: title || undefined,
      location: location || undefined,
      skills: skills || undefined,
      experience_level: experienceLevel || undefined,
    });
  };

  const jobs = isCandidateAuthenticated ? candidateJobsHook.jobs : publicJobs.jobs;
  const loading = isCandidateAuthenticated ? candidateJobsHook.loading : publicJobs.loading;
  const error = isCandidateAuthenticated ? candidateJobsHook.error : publicJobs.error;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Job Board</h1>
          <div className="flex gap-2">
            <Link
              to="/candidate/login"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
            >
              Sign in
            </Link>
            <Link
              to="/candidate/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-gray-500">Job title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Ruby"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Experience</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <ul className="space-y-4">
            {jobs.length === 0 ? (
              <li className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                No jobs found. Try adjusting your filters.
              </li>
            ) : (
              jobs.map((job) => (
                <li key={job.id}>
                  <Link
                    to={`/candidate/jobs/${job.id}`}
                    className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-gray-900">{job.title}</h2>
                        {job.company && (
                          <p className="mt-0.5 text-sm text-gray-500">{job.company.name}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                          )}
                          {job.experience_level && (
                            <span>{job.experience_level}</span>
                          )}
                        </div>
                        {job.required_skills?.length > 0 && (
                          <p className="mt-2 text-xs text-gray-500">
                            Skills: {job.required_skills.join(", ")}
                          </p>
                        )}
                      </div>
                      <Briefcase className="h-5 w-5 shrink-0 text-gray-400" />
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

import { useState, useCallback } from "react";
import candidateApi from "../services/candidateApi";

export function useCandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await candidateApi.get("/candidate/jobs", { params: filters });
      setJobs(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch candidate jobs");
      setJobs([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJob = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await candidateApi.get(`/candidate/jobs/${id}`);
      setJob(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch job");
      setJob(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, job, loading, error, setError, fetchJobs, fetchJob };
}


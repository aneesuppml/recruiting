import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useJobs(params = {}) {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/jobs", { params: { ...params, ...query } });
      setJobs(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch jobs");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [params.status]);

  const fetchJob = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch job");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/jobs", { job: payload });
      setJobs((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to create job";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/jobs/${id}`, { job: payload });
      setJobs((prev) => prev.map((j) => (j.id === id ? data : j)));
      if (job?.id === id) setJob(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to update job";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      if (job?.id === id) setJob(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete job");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCandidates = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/jobs/${jobId}/top_candidates`);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch top candidates");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs().catch(() => {});
  }, [fetchJobs]);

  return {
    jobs,
    job,
    loading,
    error,
    setError,
    fetchJobs,
    fetchJob,
    createJob,
    updateJob,
    deleteJob,
    fetchTopCandidates,
  };
}

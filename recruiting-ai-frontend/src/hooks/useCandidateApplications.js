import { useState, useCallback } from "react";
import candidateApi from "../services/candidateApi";

export function useCandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await candidateApi.get("/candidate/dashboard");
      setApplications(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch applications");
      setApplications([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplication = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await candidateApi.get(`/candidate/applications/${id}`);
      setApplication(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch application");
      setApplication(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const apply = useCallback(async (jobId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await candidateApi.post("/candidate/applications", {
        application: { job_id: jobId, ...payload },
      });
      setApplications((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to apply";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applications,
    application,
    loading,
    error,
    setError,
    fetchMyApplications,
    fetchApplication,
    apply,
  };
}

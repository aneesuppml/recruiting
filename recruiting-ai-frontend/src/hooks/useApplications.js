import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useApplications(params = {}) {
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/applications", { params: { ...params, ...query } });
      setApplications(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch applications");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [params.job_id, params.candidate_id, params.status]);

  const fetchApplication = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/applications/${id}`);
      setApplication(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch application");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/applications", {
        application: {
          ...payload,
          applied_at: payload.applied_at || new Date().toISOString(),
        },
      });
      setApplications((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to create application";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/applications/${id}`, { application: payload });
      setApplications((prev) => prev.map((a) => (a.id === id ? data : a)));
      if (application?.id === id) setApplication(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to update application";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (application?.id === id) setApplication(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete application");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications().catch(() => {});
  }, [fetchApplications]);

  return {
    applications,
    application,
    loading,
    error,
    setError,
    fetchApplications,
    fetchApplication,
    createApplication,
    updateApplication,
    deleteApplication,
  };
}

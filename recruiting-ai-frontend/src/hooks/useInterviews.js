import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useInterviews(params = {}) {
  const [interviews, setInterviews] = useState([]);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/interviews", { params: { ...params, ...query } });
      setInterviews(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch interviews");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [params.application_id]);

  const fetchInterview = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/interviews/${id}`);
      setInterview(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch interview");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createInterview = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/interviews", { interview: payload });
      setInterviews((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to create interview";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInterview = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/interviews/${id}`, { interview: payload });
      setInterviews((prev) => prev.map((i) => (i.id === id ? data : i)));
      if (interview?.id === id) setInterview(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to update interview";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/interviews/${id}`);
      setInterviews((prev) => prev.filter((i) => i.id !== id));
      if (interview?.id === id) setInterview(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete interview");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews().catch(() => {});
  }, [fetchInterviews]);

  return {
    interviews,
    interview,
    loading,
    error,
    setError,
    fetchInterviews,
    fetchInterview,
    createInterview,
    updateInterview,
    deleteInterview,
  };
}

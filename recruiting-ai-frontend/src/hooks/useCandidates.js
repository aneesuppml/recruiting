import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useCandidates(params = {}) {
  const [candidates, setCandidates] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(async (query = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/candidates", { params: { ...params, ...query } });
      setCandidates(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch candidates");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [params.status]);

  const fetchCandidate = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/candidates/${id}`);
      setCandidate(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch candidate");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCandidate = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/candidates", { candidate: payload });
      setCandidates((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to create candidate";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/candidates/${id}`, { candidate: payload });
      setCandidates((prev) => prev.map((c) => (c.id === id ? data : c)));
      if (candidate?.id === id) setCandidate(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to update candidate";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const parseResume = async (candidateId, resumeText) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/candidates/${candidateId}/parse_resume`, { resume_text: resumeText });
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? data.candidate : c)));
      if (candidate?.id === candidateId) setCandidate(data.candidate);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to parse resume");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates().catch(() => {});
  }, [fetchCandidates]);

  return {
    candidates,
    candidate,
    loading,
    error,
    setError,
    fetchCandidates,
    fetchCandidate,
    createCandidate,
    updateCandidate,
    parseResume,
  };
}

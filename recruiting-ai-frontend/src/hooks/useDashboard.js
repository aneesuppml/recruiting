import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

function formatApiError(err, fallback) {
  const apiBase = api?.defaults?.baseURL || "http://localhost:3000";
  const serverMsg = err?.response?.data?.error;
  if (serverMsg) return serverMsg;
  if (err?.response?.status) return `${fallback} (HTTP ${err.response.status})`;
  // Axios network errors (no response): backend down, CORS, wrong base URL, etc.
  if (!err?.response) return `${fallback} (API unreachable at ${apiBase})`;
  return fallback;
}

export function useDashboard() {
  const [summary, setSummary] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/dashboard/summary");
      setSummary(data);
      return data;
    } catch (err) {
      setError(formatApiError(err, "Failed to fetch summary"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPipeline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/dashboard/pipeline");
      setPipeline(data);
      return data;
    } catch (err) {
      setError(formatApiError(err, "Failed to fetch pipeline"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/dashboard/reports");
      setReports(data);
      return data;
    } catch (err) {
      setError(formatApiError(err, "Failed to fetch reports"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, pipeRes, repRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/pipeline"),
        api.get("/dashboard/reports"),
      ]);
      setSummary(sumRes.data);
      setPipeline(pipeRes.data);
      setReports(repRes.data);
      return { summary: sumRes.data, pipeline: pipeRes.data, reports: repRes.data };
    } catch (err) {
      setError(formatApiError(err, "Failed to fetch dashboard"));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll().catch(() => {});
  }, [fetchAll]);

  return {
    summary,
    pipeline,
    reports,
    loading,
    error,
    setError,
    fetchSummary,
    fetchPipeline,
    fetchReports,
    fetchAll,
  };
}

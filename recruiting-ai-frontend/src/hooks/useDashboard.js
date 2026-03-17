import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

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
      setError(err.response?.data?.error || "Failed to fetch summary");
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
      setError(err.response?.data?.error || "Failed to fetch pipeline");
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
      setError(err.response?.data?.error || "Failed to fetch reports");
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
      setError(err.response?.data?.error || "Failed to fetch dashboard");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
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

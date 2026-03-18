import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export function useSuperAdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/super-admin/companies");
      setCompanies(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch companies");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCompany = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/super-admin/companies", { company: payload });
      setCompanies((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to create company";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/super-admin/companies/${id}`, { company: payload });
      setCompanies((prev) => prev.map((c) => (c.id === id ? data : c)));
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to update company";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies().catch(() => {});
  }, [fetchCompanies]);

  return { companies, loading, error, setError, fetchCompanies, createCompany, updateCompany };
}

export function useSuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/super-admin/users");
      setUsers(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers().catch(() => {});
  }, [fetchUsers]);

  return { users, loading, error, setError, fetchUsers };
}

export function useSuperAdminAnalytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/super-admin/analytics/summary");
      setSummary(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch analytics");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary().catch(() => {});
  }, [fetchSummary]);

  return { summary, loading, error, setError, fetchSummary };
}


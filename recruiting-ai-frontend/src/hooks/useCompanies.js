import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/companies");
      setCompanies(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch companies");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompany = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/companies/${id}`);
      setCompany(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch company");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCompanyUsers = useCallback(async (companyId) => {
    if (!companyId) return [];
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/companies/${companyId}/users`);
      setUsers(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCompany = async (name, domain) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/companies", { company: { name, domain } });
      setCompanies((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to create company";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (companyId, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/companies/${companyId}/users`, {
        user: { email, password, password_confirmation: password },
        role,
      });
      setUsers((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to invite user";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    company,
    users,
    loading,
    error,
    setError,
    fetchCompanies,
    fetchCompany,
    fetchCompanyUsers,
    createCompany,
    inviteUser,
  };
}

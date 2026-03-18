import { useState, useCallback } from "react";
import api from "../services/api";
import { useAuthContext } from "../context/AuthContext";

export function useProfile() {
  const { user, updateUser } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/profile");
      setProfile(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0] || "Failed to load profile";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data } = await api.patch("/profile", { user: payload });
      setProfile(data);
      updateUser({ id: data.id, email: data.email, name: data.name, company_id: data.company_id });
      setSuccess("Profile updated successfully.");
      return data;
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join(" ") : err.response?.data?.errors) ||
        "Failed to update profile";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  return { profile, user, loading, error, success, setError, setSuccess, fetchProfile, updateProfile };
}

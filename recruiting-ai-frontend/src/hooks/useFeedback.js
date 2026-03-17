import { useState, useCallback } from "react";
import api from "../services/api";

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeedbacksByInterview = useCallback(async (interviewId) => {
    if (!interviewId) return [];
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/feedback/${interviewId}`);
      setFeedbacks(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch feedback");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFeedback = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/feedbacks", { feedback: payload });
      setFeedbacks((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to submit feedback";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/feedbacks/${id}`, { feedback: payload });
      setFeedbacks((prev) => prev.map((f) => (f.id === id ? data : f)));
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Failed to update feedback";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    feedbacks,
    loading,
    error,
    setError,
    fetchFeedbacksByInterview,
    createFeedback,
    updateFeedback,
  };
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCandidateAuthContext } from "../context/CandidateAuthContext";

export function useCandidateAuth() {
  const navigate = useNavigate();
  const { login } = useCandidateAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.post("/candidate/signup", { candidate: data });
      login(res.candidate, res.token);
      navigate("/candidate/dashboard");
      return res;
    } catch (err) {
      const msg =
        err.response?.data?.errors?.join?.(" ") ||
        err.response?.data?.error ||
        err.response?.data?.exception ||
        "Signup failed";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loginCandidate = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/candidate/login", { candidate: { email, password } });
      login(data.candidate, data.token);
      navigate("/candidate/dashboard");
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signup, login: loginCandidate, loading, error, setError };
}

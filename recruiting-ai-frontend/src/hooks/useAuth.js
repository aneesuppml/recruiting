import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthContext } from "../context/AuthContext";

export function useAuth() {
  const navigate = useNavigate();
  const { login: setAuth, logout: doLogout } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (email, password, passwordConfirmation) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/signup", {
        user: { email, password, password_confirmation: passwordConfirmation },
      });
      setAuth(data.user, data.token);
      navigate("/dashboard");
      return data;
    } catch (err) {
      const msg = err.response?.data?.errors?.join?.(" ") || err.response?.data?.error || "Signup failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/login", {
        user: { email, password },
      });
      setAuth(data.user, data.token);
      navigate("/dashboard");
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    doLogout();
    navigate("/login");
  };

  return { signup, login, logout, loading, error, setError };
}

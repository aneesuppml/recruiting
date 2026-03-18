import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const candidateApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

candidateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("candidateToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

candidateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("candidateToken");
      localStorage.removeItem("candidate");
      window.dispatchEvent(new Event("candidate-auth-change"));
    }
    return Promise.reject(error);
  }
);

export default candidateApi;

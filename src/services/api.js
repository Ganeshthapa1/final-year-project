import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Sending Authorization header:",
        config.headers.Authorization
      ); // Deb
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data, // Return response.data directly
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login"; // Redirect to login on auth errors
    }
    return Promise.reject(error);
  }
);

export default api;

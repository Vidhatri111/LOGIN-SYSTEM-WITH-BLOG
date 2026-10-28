import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message
      || (!error.response
        ? `Could not reach the WriteSphere API at ${api.defaults.baseURL}. Confirm the backend is running and MongoDB is available.`
        : error.message)
      || "The request could not be completed.";
    error.message = message;
    return Promise.reject(error);
  }
);

export default api;

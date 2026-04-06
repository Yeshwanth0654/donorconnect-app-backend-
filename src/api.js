import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.response) {
      if (error.response.status === 404) {
        return "The requested backend endpoint was not found (404). The server is running, but this API route is missing.";
      }

      if (error.response.status === 400) {
        return "The backend rejected the request (400). Please check the submitted data.";
      }

      if (error.response.status === 401) {
        return "You are not authorized for this action (401).";
      }

      if (error.response.status >= 500) {
        return "The backend hit a server error. Please check the backend logs.";
      }

      return `Backend request failed with status ${error.response.status}.`;
    }

    if (error.code === "ECONNABORTED") {
      return "The server took too long to respond. Please try again.";
    }

    if (error.request) {
      return `Request could not reach the backend. If the backend is running, this is likely an origin or proxy configuration issue. Current API base: ${API_BASE_URL}`;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default API;

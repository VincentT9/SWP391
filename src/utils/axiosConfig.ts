import axios from "axios";

// Create axios instance with improved configuration
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
  },
  timeout: 15000, // Increased to 15 seconds for better reliability
  // Retry logic will be handled manually when needed
});

// Request interceptor for adding auth token
instance.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development environment
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config.params || config.data || ""
      );
    }

    return config;
  },
  (error) => {
    console.error("Request configuration error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
instance.interceptors.response.use(
  (response) => {
    // Log successful responses in development environment
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Response] ${response.config.url}`, response.status);
    }
    return response;
  },
  (error) => {
    // Enhanced error logging and handling
    if (error.response) {
      // Server responded with an error status
      console.error(
        `API Error: ${error.response.status} - ${error.config?.url}`,
        error.response.data
      );

      // Handle unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }

      // For 500 errors, log more details to help diagnose server issues
      if (error.response.status === 500) {
        console.error("Server Error Details:", {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          responseData: error.response.data,
        });
      }
    } else if (error.request) {
      // Request was made but no response received (network issue)
      console.error("Network Error: No response received", {
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      // Error setting up request
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default instance;

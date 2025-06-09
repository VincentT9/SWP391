import React, { createContext, useContext, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: string;
  name: string;
  username: string;
  role: "Admin" | "Parent" | "MedicalStaff";
  avatar?: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// API Configuration from .env
const API_LOGIN_URL = process.env.REACT_APP_LOGIN_API;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem("authUser");
    const savedToken = localStorage.getItem("authToken");

    if (savedUser && savedToken) {
      return JSON.parse(savedUser);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // API login function using real backend
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);

    // Kiểm tra URL tồn tại
    if (!API_LOGIN_URL) {
      console.error("API login URL is not configured");
      alert("Hệ thống đang gặp sự cố. Vui lòng liên hệ quản trị viên.");
      setLoading(false);
      return false;
    }

    try {
      console.log("Attempting login with backend API:", { username });

      const response = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.log("Login failed:", response.status);
        return false;
      }

      const loginResponse = await response.json();
      console.log("Login API Response:", loginResponse);

      // Lấy token từ response
      const token =
        loginResponse.Token || loginResponse.token || loginResponse.accessToken;
      const refreshToken = loginResponse.refreshToken;

      if (!token) {
        console.log("No token received from API");
        return false;
      }

      try {
        // Decode token để lấy thông tin user
        const decodedToken: any = jwtDecode(token);
        console.log("Decoded token:", decodedToken);

        const authenticatedUser: User = {
          id: String(
            decodedToken.sub ||
              decodedToken.id ||
              decodedToken.userId ||
              Math.random()
          ),
          name:
            decodedToken.name ||
            decodedToken.fullName ||
            decodedToken.given_name ||
            username,
          username:
            decodedToken.username ||
            decodedToken.preferred_username ||
            username,
          role: mapUserRole(decodedToken.role || decodedToken.userRole),
          avatar: decodedToken.avatar || decodedToken.picture,
          isAuthenticated: true,
        };

        // Save user and tokens
        setUser(authenticatedUser);
        localStorage.setItem("authUser", JSON.stringify(authenticatedUser));
        localStorage.setItem("authToken", token);

        // Lưu refresh token nếu có
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        console.log("Login successful:", authenticatedUser);
        return true;
      } catch (decodeError) {
        console.error("Token decode error:", decodeError);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map role values to match backend enum
  const mapUserRole = (
    roleValue: string | number
  ): "Admin" | "Parent" | "MedicalStaff" => {
    if (!roleValue) return "Parent";

    // Handle both string and numeric enum values
    if (typeof roleValue === "number") {
      switch (roleValue) {
        case 0:
          return "Admin";
        case 1:
          return "Parent";
        case 2:
          return "MedicalStaff";
        default:
          return "Parent";
      }
    }

    // Handle string values
    const role = roleValue.toString().toLowerCase();

    if (role.includes("admin")) return "Admin";
    if (
      role.includes("medical") ||
      role.includes("staff") ||
      role.includes("nurse") ||
      role.includes("doctor")
    )
      return "MedicalStaff";
    if (role.includes("parent") || role.includes("guardian")) return "Parent";

    // Handle exact enum string matches
    if (role === "admin") return "Admin";
    if (role === "medicalstaff") return "MedicalStaff";
    if (role === "parent") return "Parent";

    return "Parent"; // Default fallback
  };

  // Logout function
  const logout = async () => {
    setLoading(true);

    try {
      console.log("Logging out user");
      // Optional: Call logout API endpoint if exists
      // await fetch(API_LOGOUT_URL, { method: 'POST', headers: getAuthHeaders() });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      setLoading(false);
      console.log("User logged out");
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// API Helper functions
export const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("authToken");

  const config: RequestInit = {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(endpoint, config);

  if (response.status === 401) {
    console.log("Token expired or invalid");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  }

  return response;
};

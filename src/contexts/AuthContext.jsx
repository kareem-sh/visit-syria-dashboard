import { createContext, useState, useEffect, useContext } from "react";
import { getUserRoleAndData } from "@/services/auth/AuthApi.js";
import { setAPIToken, clearAPIToken } from "@/services/apiClient"; // Import the token functions

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      // Clear any potential stale data first
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      // If no token exists, ensure clean state
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        clearAPIToken(); // Clear API token
        return;
      }

      setToken(storedToken);
      setAPIToken(storedToken); // Set token in API client

      // If we have stored user data, use it immediately for better UX
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user data:", e);
          localStorage.removeItem("user");
        }
      }

      // Always fetch fresh user data on app initialization
      try {
        const userData = await getUserRoleAndData(storedToken);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setError(null);
      } catch (error) {
        console.error("Failed to fetch user data:", error);

        // Check if it's an authentication error
        if (error.response?.status === 401 || error.response?.status === 403 || error.message === "Authentication failed: Invalid or expired token") {
          setError("Session expired. Please login again.");
          logout(); // Clear invalid session
        } else {
          setError("Failed to validate session. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, authToken) => {
    // Clear any existing data first
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    // Set new data
    setUser(userData);
    setToken(authToken);
    setAPIToken(authToken); // Set token in API client
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", authToken);
    setError(null);
  };

  const logout = () => {
    // Clear all state
    setUser(null);
    setToken(null);
    setError(null);

    // Clear all storage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    // Clear API token
    clearAPIToken();

    // Clear any query caches that might contain user data
    if (window.queryClient) {
      window.queryClient.clear();
    }

    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  };

  const refreshUserData = async () => {
    if (!token) return;

    try {
      const userData = await getUserRoleAndData(token);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setError(null);
      return userData;
    } catch (error) {
      console.error("Failed to refresh user data:", error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403 || error.message === "Authentication failed: Invalid or expired token") {
        setError("Session expired. Please login again.");
        logout();
      } else {
        setError("Failed to refresh user data");
      }
      throw error;
    }
  };

  // Helper function to check if user has specific role
  const hasRole = (roleName) => {
    return user?.role === roleName;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roleNames) => {
    return roleNames.includes(user?.role);
  };

  // Check if user is pending (null role)
  const isPending = () => {
    return user?.role === null;
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            token,
            loading,
            error,
            login,
            logout,
            refreshUserData,
            hasRole,
            hasAnyRole,
            isPending,
            isAuthenticated: !!token,
            isAdmin: user?.role === "admin",
            isSuperAdmin: user?.role === "super_admin",
            isUser: user?.role === null || user?.role === "user"
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};
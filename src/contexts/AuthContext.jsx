import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getUserRoleAndData } from "@/services/auth/AuthApi.js";
import { setAPIToken, clearAPIToken } from "@/services/apiClient";

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

  // --- logout ---
  const logout = useCallback(() => {
    console.log("Logging out user");
    // Clear state
    setUser(null);
    setToken(null);
    setError(null);

    // Clear storage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    // Clear API token
    clearAPIToken();

    // Clear query cache if available
    if (window.queryClient) {
      window.queryClient.clear();
    }

    // Redirect to login
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }, []);

  // --- initialize on mount ---
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      console.log("Auth initialization - storedToken:", storedToken);
      console.log("Auth initialization - storedUser:", storedUser);

      if (!storedToken) {
        console.log("No stored token, cleaning up");
        // no token = clean state
        clearAPIToken();
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      setToken(storedToken);
      setAPIToken(storedToken);

      // use cached user immediately
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Using cached user:", parsedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse stored user:", e);
          localStorage.removeItem("user");
        }
      }

      // fetch fresh user
      try {
        console.log("Fetching fresh user data with token");
        const userData = await getUserRoleAndData(storedToken);
        console.log("Fresh user data received:", userData);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user data:", err);

        if (
            err.response?.status === 401 ||
            err.response?.status === 403 ||
            err.message?.includes("Invalid or expired token")
        ) {
          setError("Session expired. Please login again.");
          logout();
        } else {
          setError("Failed to validate session. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [logout]);

  // --- login ---
  const login = (userData, authToken) => {
    console.log("Logging in user:", userData);
    console.log("Auth token:", authToken);

    // clear any existing
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");

    // set new
    setUser(userData);
    setToken(authToken);
    setAPIToken(authToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", authToken);
    setError(null);

    console.log("User logged in successfully");
  };

  // --- refresh user ---
  const refreshUserData = async () => {
    if (!token) return;

    try {
      const userData = await getUserRoleAndData(token);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setError(null);
      return userData;
    } catch (err) {
      console.error("Failed to refresh user data:", err);

      if (
          err.response?.status === 401 ||
          err.response?.status === 403 ||
          err.message?.includes("Invalid or expired token")
      ) {
        setError("Session expired. Please login again.");
        logout();
      } else {
        setError("Failed to refresh user data");
      }
      throw err;
    }
  };

  // --- role helpers ---
  const hasRole = (roleName) => user?.role === roleName;
  const hasAnyRole = (roleNames) => roleNames.includes(user?.role);
  const isPending = () => user?.role === null;

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
            isUser: user?.role === null || user?.role === "user",
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};
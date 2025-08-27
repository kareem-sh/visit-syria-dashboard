import { createContext, useState, useEffect, useContext } from "react";

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
  const [loading, setLoading] = useState(true); // ✅ loading while initializing

  useEffect(() => {
    // 🚀 Dev mode: dummy logged-in user
    const devUser = {
      id: 1,
      name: "Karim",
      email: "superadmin@example.com",
      role: "superadmin",  // 🔄 change to "user" or "admin" to test other roles
      company: null        // or { status: "onhold" } for pending company
    };

    // 🔹 Dummy token for testing/education
    const devToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTU0NTE2NDAsIm5iZiI6MTc1NTQ1MTY0MCwianRpIjoicWlxS0RoT3hodERRUFI0QiIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.G9QHfj_3x3WWqNEIMbmWDmNYNwRMS0ES6vQEFQ-QaC0";

    // Set user & token in state
    setUser(devUser);
    setToken(devToken);

    // Persist in localStorage (optional)
    localStorage.setItem("user", JSON.stringify(devUser));
    localStorage.setItem("token", devToken);

    // Mark loading as finished
    setLoading(false);
  }, []);

  // Login function (can pass any role and token for testing)
  const login = (userData = { role: "user", name: "Karim" }, authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTU0NTE2NDAsIm5iZiI6MTc1NTQ1MTY0MCwianRpIjoicWlxS0RoT3hodERRUFI0QiIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.G9QHfj_3x3WWqNEIMbmWDmNYNwRMS0ES6vQEFQ-QaC0"
) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
      <AuthContext.Provider
          value={{ user, token, loading, setUser, setToken, login, logout }}
      >
        {children}
      </AuthContext.Provider>
  );
};

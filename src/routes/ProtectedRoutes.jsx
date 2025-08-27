import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ user, requiredRole, children }) => {
    const location = useLocation();
    const { loading } = useAuth(); // ✅ get loading state

    if (loading) {
        return <div>Loading...</div>; // ⏳ wait for AuthProvider to finish
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // strict for superadmin only
    if (requiredRole === "superadmin" && user.role !== "superadmin") {
        return <Navigate to="/" replace />;
    }

    // admin routes: allow both admin and pending user
    if (requiredRole === "admin" && !["admin", "user"].includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;

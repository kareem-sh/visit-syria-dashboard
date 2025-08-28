import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ requiredRole, children }) => {
    const location = useLocation();
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Handle role-based access control
    if (requiredRole) {
        // Superadmin only route
        if (requiredRole === "super_admin" && user.role !== "super_admin") {
            return <Navigate to="/dashboard" replace />;
        }

        // Admin route (allow admin, super_admin, and pending users with null role)
        if (requiredRole === "admin" && !["admin", null].includes(user.role)) {
            return <Navigate to="/dashboard" replace />;
        }

        // User route (allow all authenticated users including those with null role)
        if (requiredRole === "user") {
            // All authenticated users can access user routes
            return children;
        }
    }

    return children;
};

export default ProtectedRoute;
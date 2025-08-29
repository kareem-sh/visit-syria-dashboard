import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ requiredRole, children }) => {
    const location = useLocation();
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (user.role === null) {
        // Allow dashboard only
        if (location.pathname !== "/dashboard") {
            return <Navigate to="/dashboard" replace />;
        }
        return children;
    }

    if (user.role === "admin" && user.company?.status === "في الانتظار") {
        // Allow dashboard only
        if (location.pathname !== "/dashboard") {
            return <Navigate to="/dashboard" replace />;
        }
        return children;
    }

    // Role-based access control
    if (requiredRole) {
        if (requiredRole === "super_admin" && user.role !== "super_admin") {
            return <Navigate to="/dashboard" replace />;
        }

        if (requiredRole === "admin" && user.role !== "admin") {
            return <Navigate to="/dashboard" replace />;
        }

        if (requiredRole === null) {
            return children;
        }
    }

    return children;
};

export default ProtectedRoute;

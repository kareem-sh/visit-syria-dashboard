import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ requiredRole, children }) => {
    const { user, token } = useAuth();

    // Not logged in → redirect to home
    if (!token || !user) {
        return <Navigate to="/" replace />;
    }

    // Logged in but role mismatch → redirect to home
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // Authorized → render children
    return children;
};

export default ProtectedRoute;

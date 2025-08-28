import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoutes.jsx";

import commonRoutes from "./commonRoutes";
import superadminRoutes from "./superadminRoutes";
import adminRoutes from "./adminRoutes";
import publicRoutes from "./publicRoutes";

import DashboardPage from "@/pages/company/DashboardOverview.jsx";

const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // Helper: wrap route with ProtectedRoute
    const wrapProtected = (element, role) => (
        <ProtectedRoute requiredRole={role}>
            {element}
        </ProtectedRoute>
    );

    return (
        <Routes>
            {/* Public Routes */}
            {publicRoutes.map((route, index) => (
                <Route key={`public-${index}`} path={route.path} element={route.element} />
            ))}

            {/* Common Routes (all authenticated users) */}
            {commonRoutes.map((route, index) => (
                <Route
                    key={`common-${index}`}
                    path={route.path}
                    element={wrapProtected(route.element)}
                />
            ))}

            {/* SuperAdmin Routes */}
            {superadminRoutes.map((route, index) => (
                <Route
                    key={`superadmin-${index}`}
                    path={route.path}
                    element={wrapProtected(route.element, "super_admin")}
                />
            ))}

            {/* Admin Routes (admin and super_admin) */}
            {adminRoutes.map((route, index) => (
                <Route
                    key={`admin-${index}`}
                    path={route.path}
                    element={wrapProtected(route.element, "admin")}
                />
            ))}

            {/* Dashboard (all authenticated users) */}
            <Route path="/dashboard" element={wrapProtected(<DashboardPage />)} />

            {/* Default Redirect */}
            <Route
                path="/"
                element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
            />

            {/* 404 Route */}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;
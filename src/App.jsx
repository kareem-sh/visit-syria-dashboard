import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import publicRoutes from "@/routes/publicRoutes";
import ProtectedRoute from "@/routes/ProtectedRoutes";
import AppRoutes from "@/routes/AppRoutes.jsx";

// 👇 import Preloader
import Preloader from "@/components/common/Preloader.jsx";
import { useState, useEffect } from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        },
    },
});

const App = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // ✅ First, check if the flag exists
        const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

        if (!hasSeenPreloader) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
                sessionStorage.setItem("hasSeenPreloader", "true"); // ✅ store the flag
            }, 5100); // your Lottie duration

            return () => clearTimeout(timer);
        }
    }, []);

    if (loading) {
        return <Preloader />; // ✅ show Lottie preloader only once
    }

    return (
        <QueryClientProvider client={queryClient}>
            <SidebarProvider>
                <ToastContainer
                    position="top-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={true}
                    pauseOnFocusLoss
                    draggable
                    theme="light"
                />

                <Routes>
                    {/* Public routes without MainLayout */}
                    {publicRoutes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                        />
                    ))}

                    {/* Protected routes with MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute user={user}>
                                    <AppRoutes />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </SidebarProvider>
        </QueryClientProvider>
    );
};

export default App;

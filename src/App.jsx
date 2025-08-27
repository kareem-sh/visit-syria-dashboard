// App.jsx
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
                    {/* ✅ Public routes without MainLayout */}
                    {publicRoutes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                        />
                    ))}

                    {/* ✅ All protected routes with MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route path="/*" element={
                            <ProtectedRoute user={user}>
                                <AppRoutes />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </SidebarProvider>
        </QueryClientProvider>
    );
};

export default App;
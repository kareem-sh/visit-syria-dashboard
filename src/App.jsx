import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainLayout from "@/components/layout/MainLayout";
import superadminRoutes from "@/routes/superadminRoutes";
import { useAuth } from "@/hooks/useAuth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const { user } = useAuth();

    return (
        <SidebarProvider>
            {/* Toast container added here - won't affect your layout */}
            <ToastContainer
                position="top-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Your existing layout remains unchanged */}
            <MainLayout noScroll>
                <Routes>
                    {superadminRoutes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Routes>
            </MainLayout>
        </SidebarProvider>
    );
};

export default App;
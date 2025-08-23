// App.jsx
import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainLayout from "@/components/layout/MainLayout";
import superadminRoutes from "@/routes/superadminRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        },
    },
});

const App = () => {
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
                        pauseOnHover
                        theme="light"
                    />

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
        </QueryClientProvider>
    );
};

export default App;
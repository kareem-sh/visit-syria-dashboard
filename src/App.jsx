import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainLayout from "@/components/layout/MainLayout";
import superadminRoutes from "@/routes/superadminRoutes";
// import ProtectedRoute from "@/routes/ProtectedRoutes.jsx"; // comment for now
import { useAuth } from "@/hooks/useAuth";

const App = () => {
  const { user } = useAuth();

  return (
      <SidebarProvider>
        {/* You can wrap all routes in MainLayout */}
        {/* <ProtectedRoute requiredRole="superadmin"> */}  {/* comment for now */}
        <MainLayout noScroll>
          <Routes>
            {superadminRoutes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={route.element} // elements already are components
                />
            ))}

            {/*/!* Redirect unknown routes *!/*/}
            {/*<Route*/}
            {/*    path="*"*/}
            {/*    element={<Navigate to={user ? "/" : "/"} replace />}*/}
            {/*/>*/}
          </Routes>
        </MainLayout>
        {/* </ProtectedRoute> */} {/* comment for now */}
      </SidebarProvider>
  );
};

export default App;

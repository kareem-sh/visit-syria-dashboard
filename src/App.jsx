import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainLayout from "@/components/layout/MainLayout";
import DashboardOverview from "@/pages/superadmin/DashboardOverview";

const App = () => {
  return (
    <SidebarProvider>
        <MainLayout noScroll>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            {/* Add other routes here as needed */}
          </Routes>
        </MainLayout>
    </SidebarProvider>
  );
};

export default App;

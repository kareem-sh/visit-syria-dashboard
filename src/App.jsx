import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainLayout from "@/components/layout/MainLayout";
import DashboardOverview from "@/pages/superadmin/DashboardOverview";
import Trips from "@/pages/superadmin/Trips";
import Profits from "./components/common/profits";
const App = () => {
  return (
    <SidebarProvider>
      <MainLayout noScroll>
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/profits" element={<Profits />} />
        </Routes>
      </MainLayout>
    </SidebarProvider>
  );
};

export default App;

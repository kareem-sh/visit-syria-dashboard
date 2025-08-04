import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import MainLayout from "@/components/layout/MainLayout";
import DashboardOverview from "@/pages/superadmin/dashboard-status/DashboardOverview";
import Trips from "@/pages/superadmin/dashboard-status/Trips";
import Profits from "@/pages/superadmin/dashboard-status/profits";
import TripDetailsPage from "./pages/superadmin/trips/DetailsPage.jsx";
const App = () => {
  return (
    <SidebarProvider>
      <MainLayout noScroll>
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/profits" element={<Profits />} />
          <Route path="/trip/:id" element={<TripDetailsPage />}></Route>
        </Routes>
      </MainLayout>
    </SidebarProvider>
  );
};

export default App;

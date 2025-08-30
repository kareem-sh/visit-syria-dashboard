import AdminDashboardOverview from "@/pages/company/DashboardOverview.jsx";
import SavedPlaces from "@/pages/company/SavedPlaces.jsx";
import Profile from "@/pages/superadmin/companies/CompanyDetails.jsx"
const adminRoutes = [
    { path: "/", element: <AdminDashboardOverview /> },
    { path: "/saves", element: <SavedPlaces /> },
    { path: "/profile", element: <Profile /> },


];

export default adminRoutes;
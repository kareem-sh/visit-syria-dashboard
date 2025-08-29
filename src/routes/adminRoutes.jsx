import AdminDashboardOverview from "@/pages/company/DashboardOverview.jsx";
import SavedPlaces from "@/pages/company/SavedPlaces.jsx";
const adminRoutes = [
    { path: "/", element: <AdminDashboardOverview /> },
    { path: "/saves", element: <SavedPlaces /> },

];

export default adminRoutes;
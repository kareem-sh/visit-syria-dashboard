import DashboardOverview from "@/pages/superadmin/dashboard-status/DashboardOverview";
import Trips from "@/pages/superadmin/dashboard-status/Trips";
import Profits from "@/pages/superadmin/dashboard-status/profits";
import TripDetailsPage from "@/pages/superadmin/trips/TripDetailsPage.jsx";
import Events from "@/pages/superadmin/events/Events.jsx";
import DialogTest from "@/pages/superadmin/events/DialogTest.jsx";
import EventDetails from "@/pages/superadmin/events/EventsDetails.jsx";
import PlaceDetailsPage from "@/pages/superadmin/Places/PlaceDetailsPage.jsx";

const superadminRoutes = [
    { path: "/", element: <DashboardOverview /> },
    { path: "/trips", element: <Trips /> },
    { path: "/profits", element: <Profits /> },
    { path: "/trips/:id", element: <TripDetailsPage /> },
    { path: "/events", element: <Events /> },
    { path: "/events/:id", element: <EventDetails /> },
    { path: "/places/:id", element: <PlaceDetailsPage /> },
    { path: "/test", element: <DialogTest /> },
];

export default superadminRoutes;

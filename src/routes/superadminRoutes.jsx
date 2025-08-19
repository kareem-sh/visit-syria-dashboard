import DashboardOverview from "@/pages/superadmin/dashboard-status/DashboardOverview";
import Trips from "@/pages/superadmin/dashboard-status/Trips";
import Profits from "@/pages/superadmin/dashboard-status/profits";
import TripDetailsPage from "@/pages/superadmin/trips/TripDetailsPage.jsx";
import Events from "@/pages/superadmin/events/Events.jsx";
import DialogTest from "@/pages/superadmin/events/DialogTest.jsx";
import EventDetails from "@/pages/superadmin/events/EventsDetails.jsx";
import PlaceDetailsPage from "@/pages/superadmin/Places/PlaceDetailsPage.jsx";
import Places from "@/pages/superadmin/Places/Places.jsx";
import CityDetails from "@/pages/superadmin/Places/CityDetails.jsx";
import CitySection from "@/pages/superadmin/Places/CitySection.jsx";
import PlaceForm from "@/components/dialog/PlaceForm.jsx";

const superadminRoutes = [
    { path: "/", element: <DashboardOverview /> },
    { path: "/trips", element: <Trips /> },
    { path: "/profits", element: <Profits /> },
    { path: "/trips/:id", element: <TripDetailsPage /> },
    { path: "/events", element: <Events /> },
    { path: "/events/:id", element: <EventDetails /> },
    { path: "/places", element: <Places /> },
    { path: "/places/cities/:cityname", element: <CityDetails /> },
    { path: "/places/cities/:cityname/:section", element: <CitySection /> },
    { path: "/places/cities/:cityname/:section/:id", element: <PlaceDetailsPage /> },
    { path: "/test", element: <PlaceForm /> },
];

export default superadminRoutes;

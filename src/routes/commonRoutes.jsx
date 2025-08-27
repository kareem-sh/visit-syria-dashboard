import TripDetailsPage from "@/pages/superadmin/trips/TripDetailsPage.jsx";
import Places from "@/pages/superadmin/Places/Places.jsx";
import CityDetails from "@/pages/superadmin/Places/CityDetails.jsx";
import CitySection from "@/pages/superadmin/Places/CitySection.jsx";
import PlaceDetailsPage from "@/pages/superadmin/Places/PlaceDetailsPage.jsx";
import Support from "@/pages/superadmin/support/Support.jsx";
import SupportDetails from "@/pages/superadmin/support/Support_details.jsx";
import Trips from "@/pages/superadmin/dashboard-status/Trips.jsx";

const commonRoutes = [
    { path: "/trips/:id", element: <TripDetailsPage /> },
    { path: "/trips", element: <Trips /> },
    { path: "/places", element: <Places /> },
    { path: "/places/cities/:cityname", element: <CityDetails /> },
    { path: "/places/cities/:cityname/:section", element: <CitySection /> },
    { path: "/places/cities/:cityname/:section/:id", element: <PlaceDetailsPage /> },
    { path: "/support/", element: <Support /> },
    { path: "/support/:type", element: <SupportDetails /> },
];

export default commonRoutes;
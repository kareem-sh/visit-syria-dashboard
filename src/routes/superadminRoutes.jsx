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
import Companies from "@/pages/superadmin/companies/Companies.jsx";
import CompanyInfoCard from "@/components/common/CompanyInfoCard.jsx";
import CompanyDetails from "@/pages/superadmin/companies/CompanyDetails.jsx";
import Users from "@/pages/superadmin/users/Users.jsx";
import UserDetails from "@/pages/superadmin/users/UserDetails.jsx";
import UserTrips from "@/pages/superadmin/users/UserTrips.jsx";
import UserEvents from "@/pages/superadmin/users/UserEvents.jsx";
import UserPosts from "@/pages/superadmin/users/UserPosts.jsx";
import Community from "@/pages/superadmin/community/Coumminty.jsx";

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
    { path: "/companies", element: <Companies /> },
    { path: "/companies/:id", element: <CompanyDetails/> },
    { path: "/companies/:id/trips/:id", element: <TripDetailsPage /> },
    { path: "/users", element: <Users /> },
    { path: "/users/:id", element: <UserDetails /> },
    { path: "/users/:id/trips", element: <UserTrips /> },
    { path: "/users/:id/events", element: <UserEvents /> },
    { path: "/users/:id/posts", element: <UserPosts /> },
    { path: "/community", element: <Community /> },


];

export default superadminRoutes;

import DashboardOverview from "@/pages/superadmin/dashboard-status/DashboardOverview";
import Trips from "@/pages/superadmin/dashboard-status/Trips";
import Profits from "@/pages/superadmin/dashboard-status/profits";
import TripDetailsPage from "@/pages/superadmin/trips/TripDetailsPage.jsx";
import Events from "@/pages/superadmin/events/Events.jsx";
import EventDetails from "@/pages/superadmin/events/EventsDetails.jsx";
import PlaceDetailsPage from "@/pages/superadmin/Places/PlaceDetailsPage.jsx";
import Places from "@/pages/superadmin/Places/Places.jsx";
import CityDetails from "@/pages/superadmin/Places/CityDetails.jsx";
import CitySection from "@/pages/superadmin/Places/CitySection.jsx";
import Companies from "@/pages/superadmin/companies/Companies.jsx";
import CompanyDetails from "@/pages/superadmin/companies/CompanyDetails.jsx";
import Users from "@/pages/superadmin/users/Users.jsx";
import UserDetails from "@/pages/superadmin/users/UserDetails.jsx";
import UserTrips from "@/pages/superadmin/users/UserTrips.jsx";
import UserEvents from "@/pages/superadmin/users/UserEvents.jsx";
import UserPosts from "@/pages/superadmin/users/UserPosts.jsx";
import Community from "@/pages/superadmin/community/Coumminty.jsx";
import Posts from "@/pages/superadmin/community/Posts.jsx";
import PostDetails from "@/pages/superadmin/community/PostDetails.jsx"
import AboutSyria from "@/pages/superadmin/about-syria/AboutSyria.jsx";
import BlogDetails from "@/pages/superadmin/about-syria/BlogDetails.jsx";
import Support from "@/pages/superadmin/support/Support.jsx";
import SupportDetails from "@/pages/superadmin/support/Support_details.jsx";
import SendNotifications from "@/pages/superadmin/notifications/send_notifications.jsx";
import Feedback from "@/pages/superadmin/feedback/feedback.jsx";
import ContactUs from "@/pages/superadmin/contact-us/ContactUs.jsx";

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
    { path: "/community/posts", element: <Posts /> },
    { path: "/community/posts/:id", element: <PostDetails /> },
    { path: "/about-syria", element: <AboutSyria /> },
    { path: "/about-syria/blogs/:id", element: <BlogDetails /> },
    { path: "/support/", element: <Support /> },
    { path: "/support/:type", element: <SupportDetails /> },
    { path: "/notifications/", element: <SendNotifications /> },
    { path: "/feedback/", element: <Feedback /> },
    { path: "/contact-us/", element: <ContactUs /> },

];

export default superadminRoutes;

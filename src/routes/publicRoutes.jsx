import LoginPage from "@/pages/superadmin/auth/LoginPage.jsx";
import RegisterPage from "@/pages/superadmin/auth/RegisterPage.jsx";
import VerificationPage from "@/pages/superadmin/auth/VerificationPage.jsx";

const publicRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify", element: <VerificationPage /> },
];

export default publicRoutes;
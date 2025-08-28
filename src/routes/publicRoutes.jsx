import LoginPage from "@/pages/superadmin/auth/LoginPage.jsx";
import RegisterPage from "@/pages/superadmin/auth/RegisterPage.jsx";
import VerificationPage from "@/pages/superadmin/auth/VerificationPage.jsx";
import ForgotPasswordPage from "@/pages/superadmin/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "@/pages/superadmin/auth/ResetPasswordPage.jsx";

const publicRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify", element: <VerificationPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> }
];

export default publicRoutes;
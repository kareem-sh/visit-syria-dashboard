import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import { sidebarMenu } from "../../config/menuConfig.js";
import logo from "../../assets/images/logo.svg";
import starLogo from "../../assets/icons/sidebar/Damascus Star Side bar.svg";
import logoutIcon from "@/assets/icons/sidebar/logout.svg";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isSidebarOpen } = useSidebar();

  // Safety check if user is null
  if (!user) return null;

  const isTabletOrSmaller = window.matchMedia("(max-width: 1024px)").matches;

  return (
      <aside
          className={`fixed top-0 right-0 h-full z-9999 transition-all duration-300 ${
              isSidebarOpen ? "w-[240px]" : "w-[72px]"
          } ${isTabletOrSmaller ? "shadow-xl" : ""}`}
          aria-label="Sidebar navigation"
          style={{
            backgroundColor: "var(--bg-card)",
            borderLeft: "1px solid var(--border-color)",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          }}
      >
        <div className="h-full flex flex-col justify-between py-6">
          {/* Top Section: Logo */}
          <div className="flex flex-col items-center">
            <div className="mb-8 flex items-center justify-center">
              {isSidebarOpen ? (
                  <img
                      src={logo}
                      alt="Logo"
                      className="w-[120px] h-[56.74px] object-contain"
                  />
              ) : (
                  <img
                      src={starLogo}
                      alt="Star Logo"
                      className="w-10 h-10 object-contain"
                  />
              )}
            </div>

            {/* Menu Items */}
            <nav className="w-full space-y-2">
              {sidebarMenu
                  .filter((item) => item.roles.includes(user.role))
                  .map((item) => (
                      <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                              `h-12 flex items-center transition-all duration-200 border-l-4 ${
                                  isActive
                                      ? "border-[var(--color-green)] font-body-bold-16 text-body-bold-16"
                                      : "border-transparent hover:border-[var(--color-green)]"
                              } ${isSidebarOpen ? "pr-6 gap-2" : "justify-center"}`
                          }
                      >
                        {({ isActive }) => (
                            <>
                              <img
                                  src={isActive ? item.iconActive : item.icon}
                                  alt=""
                                  className="w-6 h-6"
                              />
                              {isSidebarOpen && (
                                  <span
                                      className={`text-[var(--text-title)] flex-1 text-right ${
                                          isActive
                                              ? "text-body-bold-16 font-body-bold-16"
                                              : "text-body-regular-16"
                                      }`}
                                  >
                          {item.label}
                        </span>
                              )}
                            </>
                        )}
                      </NavLink>
                  ))}
            </nav>
          </div>

          {/* Logout Button */}
          <button
              onClick={logout}
              className={`h-12 flex items-center border-l-4 border-transparent hover:border-[var(--color-red)] transition-all duration-200 cursor-pointer ${
                  isSidebarOpen ? "pr-6 gap-2" : "justify-center"
              }`}
          >
            <img src={logoutIcon} alt="" className="w-5 h-5" />
            {isSidebarOpen && (
                <span className="text-body-regular-16-auto text-[var(--text-title)] flex-1 text-right">
              تسجيل الخروج
            </span>
            )}
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;

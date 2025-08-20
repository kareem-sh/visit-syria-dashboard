import { useSidebar } from "@/contexts/SidebarContext.jsx";
import menuIcon from "@/assets/icons/sidebar/Sidebar 1.svg";
import flagIcon from "@/assets/icons/sidebar/flag.svg";
import searchIcon from "@/assets/icons/sidebar/search.svg";
import bellIcon from "@/assets/icons/sidebar/Notiifcations Fill.svg";

const Topbar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // Check screen size
  const isTabletOrSmaller = window.matchMedia("(max-width: 1024px)").matches;

  return (
    <div
      dir="rtl"
      className="fixed top-0 h-[72px] flex items-center justify-between px-4 sm:px-6 py-[14px] bg-[var(--bg-card)] z-9999 transition-all duration-300"
      style={{
        width: isSidebarOpen ? "calc(100% - 240px)" : "calc(100% - 72px)",
        right: isSidebarOpen ? "240px" : "72px",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* Left section - Toggle button and Search */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex-shrink-0 cursor-pointer"
        >
          <img src={menuIcon} alt="menu" className="w-8 h-8" />
        </button>

        {/* Search - Hidden on mobile */}
        <div
          className={`relative ${isTabletOrSmaller ? "hidden md:block" : ""}`}
          style={{ width: "370px" }}
        >
          <img
            src={searchIcon}
            alt="search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60"
          />
          <input
            type="text"
            placeholder="البحث..."
            className="w-full text-sm text-grey-800 bg-grey-100 rounded-xl focus:outline-none"
            style={{
              height: "44px",
              padding: "10px 40px 10px 12px",
            }}
          />
        </div>
      </div>

      {/* Mobile search icon - Only show on tablet/smaller */}
      {isTabletOrSmaller && (
        <div className="md:hidden flex items-center">
          <button>
            <img src={searchIcon} alt="search" className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notifications */}
        <button className="relative">
          <img src={bellIcon} alt="notifications" className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Language Selector - Hidden on small screens */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-grey-800">
          <img src={flagIcon} alt="flag" className="w-5 h-5" />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 text-sm text-grey-800">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            {/* Placeholder for user image */}
          </div>
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="font-bold text-sm">أحمد محسن</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

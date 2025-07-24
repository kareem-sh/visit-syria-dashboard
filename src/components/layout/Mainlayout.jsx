// src/layouts/MainLayout.jsx
import { useSidebar } from "@/contexts/SidebarContext";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const MainLayout = ({ children, noScroll = false }) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex flex-col h-screen" dir="rtl">
      <Topbar />
      <div className="flex flex-1 overflow-hidden pt-[72px]">
        <Sidebar />

        {/* Content Area - with dashboard background */}
        <main
          className={`flex-1 p-6 transition-all duration-300 bg-[var(--bg-dashboard)] ${
            noScroll ? "overflow-hidden" : "overflow-auto"
          }`}
          style={{
            marginRight: isSidebarOpen ? "240px" : "72px",
            borderLeft: "1px solid var(--border-color)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

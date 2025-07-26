import { useSidebar } from "@/contexts/SidebarContext";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const MainLayout = ({ children }) => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      {/* Fixed Topbar height */}
      <div className="h-[72px] shrink-0">
        <Topbar />
      </div>

      {/* Main content area fills remaining height */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main
          className={`flex-1 p-[24px] transition-all duration-300 bg-[var(--bg-dashboard)] overflow-auto`}
          style={{
            marginRight: isSidebarOpen ? "240px" : "72px",
            borderLeft: "1px solid var(--border-color)",
          }}
        >
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

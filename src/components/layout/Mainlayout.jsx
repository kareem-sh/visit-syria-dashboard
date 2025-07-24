import { useSidebar } from "@/contexts/SidebarContext";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const MainLayout = ({ children, noScroll = false }) => {
    const { isSidebarOpen } = useSidebar();

    return (
        <div className="flex flex-col h-[1024px]" dir="rtl">
            {/* Fixed height Topbar */}
            <div className="h-[72px]">
                <Topbar />
            </div>

            {/* Main content area fixed at 952px */}
            <div className="flex h-[952px] overflow-hidden">
                <Sidebar />

                <main
                    className={`flex-1 p-[24px] transition-all duration-300 bg-[var(--bg-dashboard)] ${
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

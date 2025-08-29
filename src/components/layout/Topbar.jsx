import React, { useState } from 'react';
import { useSidebar } from "@/contexts/SidebarContext.jsx";
import { useAuth } from "@/hooks/useAuth.jsx"; // <-- import useAuth
import menuIcon from "@/assets/icons/sidebar/Sidebar 1.svg";
import flagIcon from "@/assets/icons/sidebar/flag.svg";
import searchIcon from "@/assets/icons/sidebar/search.svg";
import bellIcon from "@/assets/icons/sidebar/Notiifcations Fill.svg";
import NotificationIcon from "@/assets/icons/common/notification_icon.svg";
import NoNotification from "@/assets/icons/common/no_notifications.svg";
import TravLogo from "@/assets/icons/common/trav_logo.svg";
import ContactUs from "@/pages/superadmin/contact-us/ContactUs.jsx";
import SearchScreen from "@/pages/superadmin/search/Search.jsx";

const Topbar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { isUser } = useAuth(); // check if role is user

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSearchScreen, setShowSearchScreen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'عطل طارئ', message: 'يوجد عطل في السيرفرات. نعمل على إصلاحه.' },
    { id: 2, title: 'عطل طارئ', message: 'يوجد عطل في السيرفرات. نعمل على إصلاحه.' },
    { id: 3, title: 'عطل طارئ', message: 'يوجد عطل في السيرفرات. نعمل على إصلاحه.' },
    { id: 4, title: 'عطل طارئ', message: 'يوجد عطل في السيرفرات. نعمل على إصلاحه.' },
    { id: 5, title: 'عطل طارئ', message: 'يوجد عطل في السيرفرات. نعمل على إصلاحه.' },
    { id: 6, title: 'عطل طارئ', message: 'يوجد عطل في السيرفرات. نعمل على إصلاحه.' },
    { id: 7, title: 'عطل طارئ', message: 'يوجد عطل في السيرفرات. نعمل على إصلاحه.' },
    { id: 8, title: 'عطل طارئ', message: 'يوجد عطل في السيرفرات. نعمل على إصلاحه.' },
  ]);

  const isTabletOrSmaller = window.matchMedia("(max-width: 1024px)").matches;

  const handleToggleNotifications = () => {
    if (!isUser) setShowNotifications(!showNotifications);
  };

  const handleRemoveNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  return showSearchScreen ? (
      <SearchScreen onClose={() => setShowSearchScreen(false)} />
  ) : (
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
          <button onClick={toggleSidebar} className="flex-shrink-0 cursor-pointer">
            <img src={menuIcon} alt="menu" className="w-8 h-8" />
          </button>

          {/* Search */}
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
                onFocus={() => !isUser && setShowSearchScreen(true)}
                className={`w-full text-sm text-grey-800 bg-grey-100 rounded-xl focus:outline-none ${
                    isUser ? "cursor-not-allowed opacity-50" : ""
                }`}
                style={{
                  height: "44px",
                  padding: "10px 40px 10px 12px",
                }}
                disabled={isUser}
            />
          </div>
        </div>

        {/* Mobile search icon */}
        {isTabletOrSmaller && (
            <div className="md:hidden flex items-center">
              <button disabled={isUser}>
                <img src={searchIcon} alt="search" className="w-6 h-6 opacity-50" />
              </button>
            </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Notifications */}
          <div className="relative">
            <button onClick={handleToggleNotifications} disabled={isUser} className={`${isUser ? "cursor-not-allowed opacity-50" : ""}`}>
              <img src={bellIcon} alt="notifications" className="w-6 h-6" />
              {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 text-[10px] text-white bg-red-500 rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
              )}
            </button>

            {showNotifications && !isUser && (
                <div
                    className="absolute top-[50px] left-5 w-[400px] bg-white rounded-lg shadow-lg z-50 p-4 animate-fade-in-down"
                    dir="rtl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">قائمة الإشعارات</h3>
                    <button
                        onClick={handleClearAllNotifications}
                        className="text-gray-500 hover:text-red-500 text-sm"
                    >
                      مسح الكل
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">
                        <img
                            src={NoNotification}
                            alt="icon"
                            className="w-[300px] h-[300px] flex-shrink-0 object-contain mr-10"
                        />
                      </div>
                  ) : (
                      <ul className="space-y-4 max-h-[400px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className="flex items-start justify-between p-3 rounded-lg shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                    src={NotificationIcon}
                                    alt="icon"
                                    className="w-[50px] h-[50px] flex-shrink-0 object-contain"
                                />
                                <div>
                                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                                  <p className="text-xs text-gray-600">{notification.message}</p>
                                </div>
                              </div>
                              <button
                                  onClick={() => handleRemoveNotification(notification.id)}
                                  className="text-gray-400 hover:text-red-500 flex-shrink-0"
                              >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                  <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </li>
                        ))}
                      </ul>
                  )}
                </div>
            )}
          </div>

          {/* Language */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-grey-800">
            <img src={flagIcon} alt="flag" className="w-5 h-5" />
            العربية
          </div>

          {/* User Info */}
          <div
              className={`flex items-center gap-2 text-sm text-grey-800 ${
                  isUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              onClick={() => !isUser && setShowProfileDialog(true)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <img
                  src={TravLogo}
                  alt="icon"
                  className="w-[200px] h-[200px] flex-shrink-0 object-contain"
              />
            </div>
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="font-bold text-sm">أحمد محسن</span>
            </div>
          </div>
        </div>

        {/* Profile Dialog */}
        {showProfileDialog && !isUser && <ContactUs onClose={() => setShowProfileDialog(false)} />}
      </div>
  );
};

export default Topbar;

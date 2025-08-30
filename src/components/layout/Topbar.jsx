import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSidebar } from "@/contexts/SidebarContext.jsx";
import { useAuth } from "@/hooks/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllUnreadNotifications, getAllReadNotifications, destroyNotification } from "@/services/notification/notification.js";
import menuIcon from "@/assets/icons/sidebar/Sidebar 1.svg";
import searchIcon from "@/assets/icons/sidebar/search.svg";
import bellIcon from "@/assets/icons/sidebar/Notiifcations Fill.svg";
import NotificationIcon from "@/assets/icons/common/notification_icon.svg";
import NoNotification from "@/assets/icons/common/no_notifications.svg";
import TravLogo from "@/assets/icons/common/trav_logo.svg";
import ContactUs from "@/pages/superadmin/contact-us/ContactUs.jsx";
import SearchScreen from "@/pages/superadmin/search/Search.jsx";

const Topbar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { isUser, user: authUser, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const notificationsRef = useRef(null);

  // Check if current path is search page
  const isSearchPage = location.pathname === '/search';

  // React Query for unread notifications
  const { data: unreadNotificationsData, isLoading: unreadLoading, refetch: refetchUnread } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: getAllUnreadNotifications,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 0,
  });

  // React Query for read notifications
  const { data: readNotificationsData, isLoading: readLoading, refetch: refetchRead } = useQuery({
    queryKey: ['readNotifications'],
    queryFn: getAllReadNotifications,
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: destroyNotification,
    onSuccess: () => {
      // Refetch both after deletion
      refetchUnread();
      refetchRead();
    },
  });

  const unreadNotifications = unreadNotificationsData?.data?.notifications || [];
  const readNotifications = readNotificationsData?.data?.notifications || [];
  const unreadCount = unreadNotifications.length;

  const isTabletOrSmaller = window.matchMedia("(max-width: 1024px)").matches;

  // Get display name
  const getDisplayName = () => {
    if (isAdmin && authUser?.company) {
      return authUser.company.name_of_company || authUser.company.name_of_owner || authUser.name || "أحمد محسن";
    } else if (authUser?.name) {
      return authUser.name;
    } else {
      return "أحمد محسن";
    }
  };

  const displayName = getDisplayName();
  const shouldShowBellIcon = isSuperAdmin || (isAdmin && authUser?.company.status === "فعالة");

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleToggleNotifications = async () => {
    if (isUser) return;

    if (!showNotifications) {
      await refetchRead();
    }

    setShowNotifications(!showNotifications);
  };

  const handleRemoveNotification = (id) => {
    deleteNotificationMutation.mutate(id);
  };

  const handleClearAllNotifications = () => {
    readNotifications.forEach(notification => {
      deleteNotificationMutation.mutate(notification.id);
    });
  };

  const handleProfileClick = () => {
    if (isUser) return;

    if (isAdmin && authUser?.company.status === "فعالة") {
      navigate('/profile');
    } else {
      setShowProfileDialog(true);
    }
  };

  const handleSearchClick = () => {
    if (isUser) return;

    // Navigate to search page
    navigate('/search');
  };

  // If we're on the search page, don't render the Topbar at all
  // The SearchScreen should be rendered by the router, not here
  if (isSearchPage) {
    return null; // Return null when on search page
  }

  return (
      <div
          dir="rtl"
          className="fixed top-0 h-[72px] flex items-center justify-between px-4 sm:px-6 py-[14px] bg-[var(--bg-card)] z-50 transition-all duration-300"
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
                onClick={handleSearchClick}
                className={`w-full text-sm text-grey-800 bg-grey-100 rounded-xl focus:outline-none ${
                    isUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
                style={{
                  height: "44px",
                  padding: "10px 40px 10px 12px",
                }}
                disabled={isUser}
                readOnly
            />
          </div>
        </div>

        {/* Mobile search icon */}
        {isTabletOrSmaller && (
            <div className="md:hidden flex items-center">
              <button
                  onClick={handleSearchClick}
                  disabled={isUser}
                  className={isUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              >
                <img src={searchIcon} alt="search" className="w-6 h-6 opacity-50" />
              </button>
            </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Notifications */}
          {shouldShowBellIcon && (
              <div className="relative" ref={notificationsRef}>
                <button
                    onClick={handleToggleNotifications}
                    disabled={isUser}
                    className={`${isUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  <img src={bellIcon} alt="notifications" className="w-6 h-6" />
                  {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 text-[10px] text-white bg-red-500 rounded-full flex items-center justify-center">
                  {unreadCount}
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
                        {readNotifications.length > 0 && (
                            <button
                                onClick={handleClearAllNotifications}
                                className="text-gray-500 hover:text-red-500 text-sm cursor-pointer"
                                disabled={deleteNotificationMutation.isLoading}
                            >
                              {deleteNotificationMutation.isLoading ? 'جاري المسح...' : 'مسح الكل'}
                            </button>
                        )}
                      </div>

                      {readLoading ? (
                          <div className="text-center text-gray-500 py-4">
                            جاري التحميل...
                          </div>
                      ) : readNotifications.length === 0 ? (
                          <div className="text-center text-gray-500 py-4">
                            <img
                                src={NoNotification}
                                alt="icon"
                                className="w-[300px] h-[300px] flex-shrink-0 object-contain mr-10"
                            />
                          </div>
                      ) : (
                          <ul className="space-y-4 max-h-[400px] overflow-y-auto">
                            {readNotifications.map((notification) => (
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
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
                                      <p className="text-xs text-gray-600 truncate">{notification.message}</p>
                                    </div>
                                  </div>
                                  <button
                                      onClick={() => handleRemoveNotification(notification.id)}
                                      className="text-gray-400 hover:text-red-500 flex-shrink-0 cursor-pointer ml-2"
                                      disabled={deleteNotificationMutation.isLoading}
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
          )}

          {/* User Info */}
          <div
              className={`flex items-center gap-2 text-sm text-grey-800 ${
                  isUser ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              onClick={handleProfileClick}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <img
                  src={TravLogo}
                  alt="icon"
                  className="w-[200px] h-[200px] flex-shrink-0 object-contain"
              />
            </div>
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="font-bold text-sm">{displayName}</span>
            </div>
          </div>
        </div>

        {/* Profile Dialog */}
        {showProfileDialog && !isUser && !(isAdmin && authUser?.company.status === "فعالة") && (
            <ContactUs onClose={() => setShowProfileDialog(false)} />
        )}
      </div>
  );
};

export default Topbar;
import dashboardIcon from "@/assets/icons/sidebar/homeStroke.svg";
import dashboardIconActive from "@/assets/icons/sidebar/homeFill.svg";
import toursIcon from "@/assets/icons/sidebar/Tourism Companies Stroke.svg";
import toursIconActive from "@/assets/icons/sidebar/Tourism Companies Fill.svg";
import userIcon from "@/assets/icons/sidebar/UserStroke.svg";
import userIconActive from "@/assets/icons/sidebar/UserFill.svg";
import eventIcon from "@/assets/icons/sidebar/eventsStroke.svg";
import eventIconActive from "@/assets/icons/sidebar/eventsFill.svg";
import placesIcon from "@/assets/icons/sidebar/Places Stroke.svg";
import placesIconActive from "@/assets/icons/sidebar/Places Fill.svg";
import communityIcon from "@/assets/icons/sidebar/communityStroke.svg";
import communityIconActive from "@/assets/icons/sidebar/communityFill.svg"
import syriaIcon from "@/assets/icons/sidebar/Syria - Stroke.svg";
import syriaIconActive from "@/assets/icons/sidebar/Syria - Fill.svg";
import supportIcon from "@/assets/icons/sidebar/Support Stroke.svg";
import supportIconActive from "@/assets/icons/sidebar/Support Fill.svg";
import feedbackIcon from "@/assets/icons/sidebar/feedbackStroke.svg";
import feedbackIconActive from "@/assets/icons/sidebar/feedbackFill.svg";
import notificationIcon from "@/assets/icons/sidebar/Notifications Stroke.svg";
import notificationIconActive from "@/assets/icons/sidebar/Notiifcations Fill.svg";

export const sidebarMenu = [
  {
    label: "لوحة التحكم",
    to: "/",
    icon: dashboardIcon,
    iconActive: dashboardIconActive,
    roles: ["superadmin", "admin"],
  },
  {
    label: "الشركات",
    to: "/companies",
    icon: toursIcon,
    iconActive: toursIconActive,
    roles: ["superadmin"],
  },
  {
    label: "الأحداث",
    to: "/events",
    icon: eventIcon,
    iconActive: eventIconActive,
    roles: ["superadmin"],
  },
  {
    label: "المستخدمين",
    to: "/users",
    icon: userIcon,
    iconActive: userIconActive,
    roles: ["superadmin"],
  },
  {
    label: "الأماكن",
    to: "/places",
    icon: placesIcon,
    iconActive: placesIconActive,
    roles: ["superadmin","admin"],
  },
  {
    label: "المجتمع",
    to: "/community",
    icon: communityIcon,
    iconActive: communityIconActive,
    roles: ["superadmin"],
  },
  {
    label: "حول سوريا",
    to: "/about-syria",
    icon: syriaIcon,
    iconActive: syriaIconActive,
    roles: ["superadmin"],
  },
  {
    label: "الدعم اللوجستي",
    to: "/support",
    icon: supportIcon,
    iconActive: supportIconActive,
    roles: ["superadmin","admin"],
  },
  {
    label: "إدارة الإشعارات",
    to: "/notifications",
    icon: notificationIcon,
    iconActive: notificationIconActive,
    roles: ["superadmin"],
  },
  {
    label: "الشكاوي والاقتراحات",
    to: "/feedback",
    icon: feedbackIcon,
    iconActive: feedbackIconActive,
    roles: ["superadmin"],
  },
];

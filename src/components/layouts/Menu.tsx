import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { UnreadMessagesContext } from "@/contexts/UnreadMessagesContext";

import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  MegaphoneIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  UsersIcon,
  UserGroupIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";
import authService from "@/services/authService";


const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <HomeIcon className="w-6 h-6" />,
        label: "Home",
        name: "Trang chủ",
        href: "/",
        visible: ["ADMIN"],
      },
      {
        icon: <UserGroupIcon className="w-6 h-6" />,
        label: "Students",
        name: "Sinh viên",
        href: "/students",      
        visible: ["ADMIN", "STAFF"],
      },
      {
        icon: <UsersIcon className="w-6 h-6" />,
        label: "Staffs",
        name: "Nhân viên",
        href: "/staffs",
        visible: ["ADMIN"],
      },
      {
        icon: <BuildingOfficeIcon className="w-6 h-6" />,
        label: "Rooms",
        name: "Phòng",
        href: "/rooms",
        visible: ["ADMIN", "STUDENT", "STAFF"],
      },
      {
        icon: <DocumentTextIcon className="w-6 h-6" />,
        label: "Reports",
        name: "Báo cáo",
        href: "/reports",
        visible: ["ADMIN", "STAFF", "STUDENT"],
      },
      {
        icon: <BanknotesIcon className="w-6 h-6" />,
        label: "Billing",
        name: "Hóa đơn",
        href: "/bills",
        visible: ["ADMIN", "STUDENT"],
      },
      {
        icon: <CalendarIcon className="w-6 h-6" />,
        label: "Events",
        name: "Sự kiện",
        href: "/events",
        visible: ["ADMIN", "STUDENT"],
      },
      {
        icon: <ChatBubbleLeftIcon className="w-6 h-6" />,
        label: "Messages",
        name: "Tin nhắn",
        href: "/messages",
        visible: ["ADMIN", "STAFF", "STUDENT"],
      },
      {
        icon: <MegaphoneIcon className="w-6 h-6" />,
        label: "Announcements",
        name: "Thông báo",
        href: "/announcements",
        visible: ["ADMIN", "STUDENT", "STAFF"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <UserCircleIcon className="w-6 h-6" />,
        label: "Profile",
        name: "Hồ sơ",
        href: "/profile",
        visible: ["ADMIN", "STAFF", "STUDENT"],
      },
      {
        icon: <Cog6ToothIcon className="w-6 h-6" />,
        label: "Settings",
        name: "Cài đặt",
        href: "/settings",
        visible: ["ADMIN", "STUDENT", "STAFF"],
      },
      {
        icon: <ArrowRightStartOnRectangleIcon className="w-6 h-6" />,
        label: "Logout",
        name: "Đăng xuất",
        href: "/logout",
        visible: ["ADMIN", "STAFF", "STUDENT"],
      },
    ],
  },
];


const Menu = ({ numberMessage }: { numberMessage: number }) => {
  const pathname = usePathname();
  const context = useContext(UnreadMessagesContext);
  const unreadCount = context?.unreadCount || 0;
  const role = authService.getRole();

  return (
    <div className="p-5 relative">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (role && item.visible.includes(role)) {
              // Check if current path matches this menu item
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  href={
                    item.label.toLowerCase() === "logout" ? "/login" : item.href
                  }
                  key={item.label}
                  onClick={() => {
                    if (item.label.toLowerCase() === "logout") {
                      // Clear login info from localStorage or your auth state management
                      localStorage.removeItem("user");
                    }
                  }}
                  className={`flex items-center justify-center lg:justify-start gap-4 py-2 md:px-2 rounded-md 
                transition-all duration-200 ease-in-out hover:bg-blue-100 hover:text-blue-600 hover:shadow-sm hover:scale-[1.02]
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-medium shadow-sm"
                    : "text-gray-500"
                }`}
                >
                  {item.icon}
                  <span className="hidden lg:block">
                    {item.name}
                    {item.label.toLowerCase() === "messages" &&
                      unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                  </span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;

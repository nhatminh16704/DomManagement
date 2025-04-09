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
} from "@heroicons/react/24/outline";

const role = "admin"; // Change this to "teacher", "student", or "parent" to see the changes
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <HomeIcon className="w-6 h-6" />,
        label: "Home",
        name: "Trang chủ",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <UserGroupIcon className="w-6 h-6" />,
        label: "Students",
        name: "Sinh viên",
        href: "/students",      
        visible: ["admin", "teacher"],
      },
      {
        icon: <UsersIcon className="w-6 h-6" />,
        label: "Staffs",
        name: "Nhân viên",
        href: "/staffs",
        visible: ["admin", "teacher"],
      },
      {
        icon: <BuildingOfficeIcon className="w-6 h-6" />,
        label: "Rooms",
        name: "Phòng",
        href: "/rooms",
        visible: ["admin", "teacher"],
      },
      {
        icon: <DocumentTextIcon className="w-6 h-6" />,
        label: "Reports",
        name: "Báo cáo",
        href: "/reports",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <CalendarIcon className="w-6 h-6" />,
        label: "Billing",
        name: "Hóa đơn",
        href: "/bills",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <ChatBubbleLeftIcon className="w-6 h-6" />,
        label: "Messages",
        name: "Tin nhắn",
        href: "/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <MegaphoneIcon className="w-6 h-6" />,
        label: "Announcements",
        name: "Thông báo",
        href: "/announcements",
        visible: ["admin", "teacher", "student", "parent"],
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
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <Cog6ToothIcon className="w-6 h-6" />,
        label: "Settings",
        name: "Cài đặt",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <ArrowRightStartOnRectangleIcon className="w-6 h-6" />,
        label: "Logout",
        name: "Đăng xuất",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const context = useContext(UnreadMessagesContext);
  const unreadCount = context?.unreadCount || 0;

  return (
    <div className="p-5">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
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

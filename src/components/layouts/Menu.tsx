
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  MegaphoneIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UsersIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { number } from "zod";
import authService from "@/services/authService";
import { getmessages } from "@/services/messageService";

const role = "admin"; // Change this to "teacher", "student", or "parent" to see the changes
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <HomeIcon className="w-6 h-6" />,
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <UserGroupIcon className="w-6 h-6" />,
        label: "Students",
        href: "/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: <UsersIcon className="w-6 h-6" />,
        label: "Staffs",
        href: "/staffs",
        visible: ["admin", "teacher"],
      },
      {
        icon: <BuildingOfficeIcon className="w-6 h-6" />,
        label: "Rooms",
        href: "/rooms",
        visible: ["admin", "teacher"],
      },
      {
        icon: <DocumentTextIcon className="w-6 h-6" />,
        label: "Reports",
        href: "/reports",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <CalendarIcon className="w-6 h-6" />,
        label: "Events",
        href: "/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <ChatBubbleLeftIcon className="w-6 h-6" />,
        label: "Messages",
        href: "/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <MegaphoneIcon className="w-6 h-6" />,
        label: "Announcements",
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
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <Cog6ToothIcon className="w-6 h-6" />,
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: <ArrowLeftOnRectangleIcon className="w-6 h-6" />,
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];


const Menu = () => {
  const pathname = usePathname();
  const [numberMessage,setnumberMessage] = useState(1);
  const updateNumberMessage = (newMessageCount: number) => {
    setnumberMessage(newMessageCount);
  };
  return (
    <div className="p-5 relative">
    {menuItems.map((i) => (
      <div className="flex flex-col gap-2" key={i.title}>
        <span className="hidden lg:block text-gray-400 font-light my-4">
          {i.title}
        </span>
        {i.items.map((item) => {
          if (item.visible.includes(role)) {
            // Check if current path matches this menu item
            const isActive = pathname === item.href || pathname.startsWith(item.href);

            return (
              <div key={item.label} className="relative">
                <Link
                  href={item.label.toLowerCase() === "logout" ? "/login" : item.href}
                  onClick={() => {
                    if (item.label.toLowerCase() === "logout") {
                      localStorage.removeItem("user");
                    }
                  }}
                  className={`flex items-center justify-center lg:justify-start gap-4 py-2 md:px-2 rounded-md
                  transition-all duration-200 ease-in-out hover:bg-blue-100 hover:text-blue-600 hover:shadow-sm hover:scale-[1.02]
                  ${isActive
                    ? 'bg-blue-100 text-blue-600 font-medium shadow-sm'
                    : 'text-gray-500'}`}
                >
                  {item.icon}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>

                {/* Show numberMessage as a badge for "Messages" */}
                {item.label === "Messages" && numberMessage > 0 && (
                  <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs">
                    {numberMessage}
                  </div>
                )}
              </div>
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
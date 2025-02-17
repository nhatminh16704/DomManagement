import Image from "next/image";
import Link from "next/link";
const role = "admin"; // Change this to "teacher", "student", or "parent" to see the changes
const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/room.png",
        label: "Rooms",
        href: "/rooms",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
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
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="p-5">
      {menuItems.map((i) => (
      <div className="flex flex-col gap-2" key={i.title}>
        <span className="hidden lg:block text-gray-400 font-light my-4">
        {i.title}
        </span>
        {i.items.map((item) => {
        if (item.visible.includes(role)) {
          return (
          <Link
            href={item.label.toLowerCase() === 'logout' ? '/login' : item.href}
            key={item.label}
            onClick={() => {
            if (item.label.toLowerCase() === 'logout') {
              // Clear login info from localStorage or your auth state management
              localStorage.removeItem('user');
              // Add any other logout logic here
            }
            }}
            className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-100"
          >
            <Image src={item.icon} alt="" width={20} height={20} />
            <span className="hidden lg:block">{item.label}</span>
          </Link>
          );
        }
        })}
      </div>
      ))}
    </div>
  );
};

export default Menu;

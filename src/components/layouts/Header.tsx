import Link from "next/link";
import Image from "next/image";
import { ChatBubbleLeftIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";


const Header = () => {
  const [user, setUser] = useState({ name: "", role: "" });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user"); 
        const data = await res.json();
        setUser({ name: data.name, role: data.role }); 
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="flex shadow-md bg-[#F7F8FA]">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={50} height={50} />
          <span className="hidden lg:block font-bold">DomHub</span>
        </Link>
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]  flex flex-col">
        <div className="flex items-center justify-between p-4">
          <div className="hidden md:flex items-center gap-2  rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/search.png" alt="" width={16} height={16} />
            <input
              type="text"
              placeholder="Search..."
              className="w-[200px] p-2 bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-6 justify-end w-full">
            <Link href="/messages" className="block">
              <div className="bg-white p-2 rounded w-15 h-15 flex items-center justify-center cursor-pointer hover:bg-blue-100 hover:shadow-md transition-all duration-200">
                <ChatBubbleLeftIcon className="w-[30px] h-[30px] text-gray-600 hover:text-blue-600" />
              </div>
            </Link>
            <Link href="/announcements" className="block">
              <div className="bg-white p-2 rounded w-15 h-15 flex items-center justify-center cursor-pointer relative hover:bg-blue-100 hover:shadow-md transition-all duration-200">
                <MegaphoneIcon className="w-[30px] h-[30px] text-gray-600 hover:text-blue-600" />
              </div>
            </Link>
            <div className="flex flex-col">
              <span className="text-xs leading-3 font-medium">Ming</span>
              <span className="text-[10px] text-gray-500 text-right">
                Admin
              </span>
            </div>
            <Image
              src="/avatar.png"
              alt=""
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

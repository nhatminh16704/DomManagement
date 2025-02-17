import Link from "next/link";
import Image from "next/image";


const Header = () => {
  return (
    <div className="flex shadow-md">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={50} height={50} /> 
          <span className="hidden lg:block font-bold">DomHub</span>
        </Link>
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col">
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
            <div className="bg-white p-2 rounded w-15 h-15  flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors">
              <Image src="/message.png" alt="" width={30} height={30} />
            </div>
            <div className="bg-white p-2 rounded w-15 h-15 flex items-center justify-center cursor-pointer relative hover:bg-blue-100 transition-colors">
              <Image src="/announcement.png" alt="" width={30} height={30} />
              <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs">
                1
              </div>
            </div>
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

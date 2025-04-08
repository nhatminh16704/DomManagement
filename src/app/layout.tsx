"use client";

import Header from "../components/layouts/Header";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/layouts/Menu";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import authService from "@/services/authService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessagesContext";


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";
  const isNotFoundPage = pathname === "/not-found";
  const [numberMessage, setnumberMessage] = useState(0);

  const updateUnreadMessages = () => {
    const unread = localStorage.getItem("numberMessage");
    console.log(unread)
    setnumberMessage(unread ? parseInt(unread) : 0);
  };

  useEffect(() => {
    const authUser = authService.isAuthenticated();
    if (!authUser && !isLoginPage && !isNotFoundPage) {
      router.push("/login"); // Nếu chưa login và không ở trang login, redirect về login
    }
  }, [isLoginPage, isNotFoundPage, pathname, router]);

  useEffect(() => {
    // Cập nhật số tin nhắn khi component được load lần đầu
    updateUnreadMessages();
  
    // Lắng nghe sự kiện thay đổi trong localStorage
    const handleStorageChange = (event: StorageEvent) => { 
      if (event.key === "numberMessage") {
        updateUnreadMessages(); // Cập nhật lại số lượng tin nhắn
      }
    };
  
    window.addEventListener("storage", handleStorageChange); // Lắng nghe sự kiện 'storage'
  
    // Cleanup khi component bị hủy
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);



  if (isLoginPage || isNotFoundPage) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }

  if (!authService.isAuthenticated() && !isLoginPage) {
    return null; // Tránh render khi chưa xác thực
  }

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col h-full`}>
        <UnreadMessagesProvider>
          <Header />
          <div className="flex flex-1 h-[calc(100vh-64px)]">
            <Menu />
            <main className="overflow-auto flex-1 p-10 pl-20">{children}</main>
          </div>
        </UnreadMessagesProvider>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </body>
    </html>
  );
  
}
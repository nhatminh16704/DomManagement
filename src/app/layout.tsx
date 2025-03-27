"use client";

import Header from "../components/layouts/Header";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/layouts/Menu";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import authService from "@/services/authService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    const authUser = authService.isAuthenticated();
    if (!authUser && !isLoginPage && !isNotFoundPage) {
      router.push("/login"); // Nếu chưa login và không ở trang login, redirect về login
    }
  }, [isLoginPage, isNotFoundPage, pathname, router]);

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
        <Header />
        <div className="flex flex-1 h-[calc(100vh-64px)]">
          {" "}
          {/* Adjust 64px to match your header height */}
          <Menu />
          <main className="overflow-auto flex-1 p-10 pl-20">{children}</main>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}

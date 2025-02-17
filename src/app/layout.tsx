"use client";

import Header from "../components/Header";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "@/components/Menu";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/services/auth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const authUser = isAuthenticated();
    if (!authUser && !isLoginPage) {
      router.push("/login"); // Nếu chưa login và không ở trang login, redirect về login
    } else {
      setUser(authUser);
    }
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }

  if (!user) {
    return null; // Tránh render trong lúc check login
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="flex">
          <Menu />
          <main className="flex-1 p-10 pl-20">{children}</main>
        </div>
      </body>
    </html>
  );
}

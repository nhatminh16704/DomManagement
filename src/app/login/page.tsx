"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const formSchema = z.object({
  account: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      password: "",
    },
  });

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   const { account, password } = values;
  //   const apiUrl = `http://localhost:3001/accounts?username=${account}&password=${password}`;
  
  //   try {
  //     const response = await fetch(apiUrl);
  //     const data = await response.json();
  
  //     if (data.length === 0) {
  //       setError("Sai tài khoản hoặc mật khẩu!");
  //       return;
  //     }
  
  //     const user = data[0];
  
  //     // Lưu thông tin đăng nhập vào localStorage
  //     localStorage.setItem("user", JSON.stringify(user));
  
  //     // Chuyển hướng tùy theo vai trò
  //     if (user.role === "admin") {
  //       router.push("/");
  //     } else {
  //       router.push("/");
  //     }
  //   } catch (err) {
  //     setError(`Lỗi kết nối đến server! ${err}`);
  //   }
  // }
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(""); // Reset lỗi trước khi gửi request
    console.log("Giá trị nhập:", values);
    const { account, password } = values;
    const apiUrl = "http://localhost:8081/auth/login";
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: account,
          password: password
        }),
      });
      if (!response.ok) {
        setError("Sai tài khoản hoặc mật khẩu!");
        return;
    }

    const token = await response.text(); // API chỉ trả về chuỗi token
    console.log("Token nhận được:", token);

    // Giải mã JWT để lấy thông tin user
    const decodedToken: any = jwtDecode(token);
    console.log("Thông tin từ token:", decodedToken);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(decodedToken));

    if (decodedToken.role === "ADMIN") {
        router.push("/admin"); // Điều hướng trang admin
    } else {
        router.push("/dashboard"); // Điều hướng trang user
    }
    } catch (err: any) {
      console.error("Lỗi kết nối:", err);
      setError(`Lỗi kết nối đến server! ${err.message}`);
    }
  }
  
  

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] shadow-t-lg shadow-l-lg shadow-r-lg">
        <h2 className="text-2xl font-bold text-center mb-8">Đăng nhập</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tài khoản</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên tài khoản" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-red-500">
              Đăng nhập
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

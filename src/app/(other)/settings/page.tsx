"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify";
import { updateProfile, changePassword } from "@/services/userService";

const profileFormSchema = z.object({
  phone: z.string().min(1, { message: "Số điện thoại không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
})

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Mật khẩu hiện tại không được để trống" }),
  newPassword: z.string().min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
  confirmPassword: z.string().min(1, { message: "Xác nhận mật khẩu không được để trống" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

export default function Settings() {
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      phone: "",
      email: "",
    },
  })

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log(values)
    // TODO: Handle profile update
    try {
      await updateProfile({
        email: values.email,
        phoneNumber: values.phone,
      });
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi khi cập nhật thông tin!");
    }
  }

  async function onSecuritySubmit(values: z.infer<typeof securityFormSchema>) {
    console.log(values)
    // TODO: Handle password change
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      securityForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi khi đổi mật khẩu!");
    }
  }

  return (
    <div className="container px-4 py-8">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cập nhật thông tin</h2>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số Điện Thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Số điện thoại của bạn" className="max-w-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email của bạn" className="max-w-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Cập Nhật
              </Button>
            </form>
          </Form>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cài Đặt Tài Khoản</h2>
          <Form {...securityForm}>
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
              <FormField
                control={securityForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật Khẩu Hiện Tại</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mật khẩu hiện tại" className="max-w-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={securityForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật Khẩu Mới</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mật khẩu mới" className="max-w-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={securityForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác Nhận Mật Khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Xác nhận mật khẩu" className="max-w-md" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Đổi Mật Khẩu
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </div>
  )
}

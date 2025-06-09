"use client";

import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStaff, updateStaff } from "@/services/staffService";
import { Staff } from "@/types/user";

// Định nghĩa schema validation với Zod cho Staff
const staffSchema = z.object({
  id: z.number().optional(),
  fullName: z.string().min(1, "Tên phải có ít nhất 1 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  birthday: z.string().nonempty("Vui lòng chọn ngày sinh"),
  gender: z.string().nonempty("Vui lòng chọn giới tính"),
  position: z.string().nonempty("Vui lòng chọn chức vụ"), // Chỉ cần nonempty vì giá trị đã cố định
  phoneNumber: z
    .string()
    .regex(/^\d{10,}$/, "Số điện thoại phải có ít nhất 10 số"),
  address: z.string().min(3, "Địa chỉ không hợp lệ"),
  startDate: z.string().nonempty("Vui lòng chọn ngày bắt đầu"),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffAdded: () => void;
  staff?: StaffFormData;
}

export default function AddStaffModal({
  isOpen,
  onClose,
  onStaffAdded,
  staff,
}: AddStaffModalProps) {
  // Setup React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      fullName: "",
      birthday: "",
      gender: "",
      position: "",
      phoneNumber: "",
      address: "",
      email: "",
      startDate: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    reset(
      staff
        ? { ...staff }
        : {
            fullName: "",
            birthday: "",
            gender: "",
            position: "",
            phoneNumber: "",
            address: "",
            email: "",
            startDate: "",
          }
    );
  }, [staff, isOpen, reset]);

  const onSubmit = async (data: StaffFormData) => {
    try {
      if (data.id) {
        await updateStaff(data.id, data as Staff);
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await createStaff(data);
        toast.success("Thêm nhân viên thành công");
      }

      onClose();
      onStaffAdded();
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi khi xử lý yêu cầu");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {staff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin nhân viên mới vào form dưới đây
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Họ và tên</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                className={`focus-visible:ring-blue-500 ${
                  errors.fullName ? "border-red-500" : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={`focus-visible:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Ngày sinh</Label>
              <Input
                id="birthday"
                type="date"
                {...register("birthday")}
                className={`focus-visible:ring-blue-500 ${
                  errors.birthday ? "border-red-500" : ""
                }`}
              />
              {errors.birthday && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.birthday.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                value={watch("gender")}
                onValueChange={(value) =>
                  setValue("gender", value, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="gender"
                  className={`focus:ring-blue-500 ${
                    errors.gender ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Chức vụ</Label>
              <Select
                value={watch("position")}
                onValueChange={(value) =>
                  setValue("position", value, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="position"
                  className={`focus:ring-blue-500 ${
                    errors.position ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Chọn chức vụ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quản lý ký túc xá">
                    Quản lý ký túc xá
                  </SelectItem>
                  <SelectItem value="Bảo vệ">Bảo vệ</SelectItem>
                </SelectContent>
              </Select>
              {errors.position && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.position.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">SĐT</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                className={`focus-visible:ring-blue-500 ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                {...register("address")}
                className={`focus-visible:ring-blue-500 ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                className={`focus-visible:ring-blue-500 ${
                  errors.startDate ? "border-red-500" : ""
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-colorprimary hover:bg-colorprimary/90 text-white"
            >
              Lưu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
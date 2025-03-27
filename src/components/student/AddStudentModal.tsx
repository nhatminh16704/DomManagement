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
import { createStudent, updateStudent, Student } from "@/services/studentService";

//Định nghĩa schema validation với Zod
const studentSchema = z.object({
  id: z.number().optional(),
  studentCode: z.string().min(5, "Mã SV phải có ít nhất 5 ký tự"),
  fullName: z.string().min(3, "Họ và tên phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  birthday: z.string().nonempty("Vui lòng chọn ngày sinh"),
  gender: z.string().nonempty("Vui lòng chọn giới tính"),
  className: z.string().min(2, "Tên lớp không hợp lệ"),
  phoneNumber: z
    .string()
    .regex(/^\d{10,}$/, "Số điện thoại phải có ít nhất 10 số"),
  hometown: z.string().min(3, "Quê quán không hợp lệ"),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: () => void;
  student?: StudentFormData;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onStudentAdded,
  student,
}: AddStudentModalProps) {
  // Setup React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentCode: "",
      fullName: "",
      birthday: "",
      gender: "",
      className: "",
      phoneNumber: "",
      hometown: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;
  
    reset(student ? { ...student } : {
      studentCode: "",
      fullName: "",
      birthday: "",
      gender: "",
      className: "",
      phoneNumber: "",
      hometown: "",
      email: "",
    });    

  }, [student, isOpen, reset]);
  
  
  


  const onSubmit = async (data: StudentFormData) => {
    try {  
      let message = "";
      if (data.id) {
        // Ensure data.id is a number before passing to updateStudent
        // Also, cast data to Student type to satisfy the type requirements
        message = await updateStudent(data.id, data as Student);
      } else {
        message = await createStudent(data);
      }
  
      toast.success(`${message}`);
      onClose();
      onStudentAdded();
      reset();
    } catch (error) {
      toast.error(`${error}`);
    }
  };
  
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm sinh viên mới</DialogTitle>
          <DialogDescription>
            Điền thông tin sinh viên mới vào form dưới đây
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="studentCode">Mã SV</Label>
              <Input
                id="studentCode"
                {...register("studentCode")}
                className={`focus-visible:ring-blue-500 ${
                  errors.studentCode ? "border-red-500" : ""
                }`}
              />
              {errors.studentCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.studentCode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
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
              <Select  value={watch("gender")} onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}>
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
              <Label htmlFor="className">Lớp</Label>
              <Input
                id="className"
                {...register("className")}
                className={`focus-visible:ring-blue-500 ${
                  errors.className ? "border-red-500" : ""
                }`}
              />
              {errors.className && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.className.message}
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
              <Label htmlFor="hometown">Quê quán</Label>
              <Input
                id="hometown"
                {...register("hometown")}
                className={`focus-visible:ring-blue-500 ${
                  errors.hometown ? "border-red-500" : ""
                }`}
              />
              {errors.hometown && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.hometown.message}
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

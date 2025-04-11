// src/components/student/AddViolationModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { createViolation } from "@/services/studentService";

const violationSchema = z.object({
  violationType: z.string().min(1, { message: "Loại vi phạm không được để trống" }),
});

type ViolationFormValues = z.infer<typeof violationSchema>;

interface AddViolationModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  onViolationAdded: () => void;
}

export default function AddViolationModal({
  isOpen,
  onClose,
  studentId,
  onViolationAdded,
}: AddViolationModalProps) {
  const form = useForm<ViolationFormValues>({
    resolver: zodResolver(violationSchema),
    defaultValues: {
      violationType: "",
    },
  });

  const onSubmit = async (values: ViolationFormValues) => {
    try {
      const reportDate = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại (YYYY-MM-DD)
      await createViolation({
        studentId,
        violationType: values.violationType,
        reportDate,
      });
      toast.success("Tạo vi phạm thành công!");
      onViolationAdded();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lỗi khi tạo vi phạm!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo vi phạm mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="violationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại vi phạm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập loại vi phạm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                Tạo vi phạm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
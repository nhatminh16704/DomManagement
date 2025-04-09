"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportAdded: () => void;
}

export default function AddReportModal({
  isOpen,
  onClose,
  onReportAdded,
}: AddReportModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          title,
          content,
          sentDate: new Date().toISOString(), // Thời gian hiện tại
          status: "PENDING", // Mặc định PENDING
        }),
      });
      if (!response.ok) {
        throw new Error("Lỗi khi tạo báo cáo!");
      }
      toast.success("Tạo báo cáo thành công!");
      onReportAdded();
      onClose();
      setTitle("");
      setContent("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Lỗi khi tạo báo cáo!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo báo cáo mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tiêu đề
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Nội dung
            </Label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Tạo</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
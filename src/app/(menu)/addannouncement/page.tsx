"use client";
import { addnotification, gettype, notification } from "@/services/notificationService";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import authService  from "@/services/authService";

export default function AddAnnouncementPage() {
  const router = useRouter();
  const [typeNotification, setTypeNotification] = useState<string[]>([]);
  
  const userId = authService.getUserId();
  if (userId !== null) {
    console.log("User ID:", userId);
  } else {
    console.log("User chưa đăng nhập.");
  }

  useEffect(() => {
    gettype()
      .then((data) => setTypeNotification(data)) // Lấy danh sách loại thông báo
      .catch((err) => console.error("Lỗi khi lấy danh sách loại thông báo:", err));
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "", 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    const newNotification: Omit<notification, "id" | "created_date"> = {
      title: formData.title,
      content: formData.content,
      type: formData.type,
      createdBy: userId,
    };
    try {
      await addnotification(newNotification);
      alert("Thông báo đã được tạo!");
      //router.push("/announcements");
    } catch (e) {
      console.error("Lỗi:", e);
      alert("Gửi thông báo thất bại!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-[#F7F8FA]">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-4/5 mt-[-100px]">
        <h2 className="text-2xl font-semibold text-center text-white mb-4">Tạo Thông Báo Mới</h2>
        <form className="flex flex-col gap-4" onSubmit={addNotification}>
          <div>
            <label htmlFor="title" className="block text-white mb-1">Tiêu đề</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-black text-white border border-gray-600" required />
          </div>

          <div>
            <label htmlFor="content" className="block text-white mb-1">Nội dung</label>
            <textarea id="content" name="content" value={formData.content} onChange={handleChange}
              className="w-full h-[200px] px-3 py-2 rounded-md bg-black text-white border border-gray-600" required />
          </div>

          <div className="flex gap-4">
            {/* Chọn loại thông báo */}
            <div className="flex-1">
              <label htmlFor="type" className="block text-white mb-1">Loại thông báo</label>
              <Select
                id="type"
                className="w-full"
                options={typeNotification.map((item) => ({ value: item, label: item }))}
                placeholder="Chọn loại thông báo"
                isClearable={true} // Cho phép bỏ chọn
                value={formData.type ? { value: formData.type, label: formData.type } : null}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, type: selectedOption ? selectedOption.value : "" })
                }
                menuPlacement="top"
              />
            </div>
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
            Gửi Thông Báo
          </button>
        </form>
      </div>
    </div>
  );
}

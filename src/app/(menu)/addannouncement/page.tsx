"use client";
import { addnotification, notification } from "@/services/notificationService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AddAnnouncementPage() {
  const router = useRouter();
  const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const userData = user ? JSON.parse(user) : null;
  const userId = userData?.id;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    created_date: new Date().toISOString().split("T")[0],
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
    try {
    const newNotification: Omit<notification, "id"> = { 
      title: formData.title,
      content: formData.content,
      created_date: new Date(formData.created_date),
      account_id: userId,
      type: formData.type,
    };
    const result = await addnotification(newNotification);
    alert("Thông báo đã được tạo!");
    router.push("/announcements");
  }catch(e){
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
            <div className="flex-1">
              <label htmlFor="created_date" className="block text-white mb-1">Ngày tạo</label>
              <input type="date" id="created_date" name="created_date" value={formData.created_date} onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-black text-white border border-gray-600" required />
            </div>
            <div className="flex-1">
              <label htmlFor="type" className="block text-white mb-1">Loại thông báo</label>
              <input type="text" id="type" name="type" value={formData.type} onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-black text-white border border-gray-600" required />
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

"use client";
import React from 'react'
  import { useState, useEffect } from 'react';
  import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { addnotification, createNotification, getnotification, notification } from '@/services/notificationService';
import authService from '@/services/authService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Announcements() {
  const router=useRouter();
  const [showForm, setShowForm] = useState(false);
  const [allNotifications, setAllNotifications] = useState<notification[]>([]);
  const [notifications, setnotification] = useState<notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<notification | null>(null);
  const typeNotification= ['GENERAL','BILLING','MAINTENANCE','SECURITY','EVENT','RULES','URGENT']; 
  const [selected, setSelected] = useState<String>("");
  const [selectKey, setSelectKey] = useState(0);
  const userId = authService.getUserId();
  const role = authService.getRole();
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
      const newNotification: createNotification = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        createdBy: userId,
      };
      try {
        await addnotification(newNotification);
        alert("Thông báo đã được tạo!");
        setShowForm(false);
      } catch (e) {
        console.error("Lỗi:", e);
        alert("Gửi thông báo thất bại!");
      }
    };

  useEffect(() => {
    getnotification().then((data) => {
      setAllNotifications(data);
      setnotification(data);
    }).catch((err) => {
      console.error("Lỗi khi lấy danh sách thông báo:", err);
    });
  }, []);
  

  const openNotificationDetail = (notificationId: number) => {
    const item = notifications.find((n) => n.id === notificationId);
    if (item) {
      setSelectedNotification(item);
    }
  };

  const navigateToAddPage = () => {
    setShowForm(true);
  };

  const onclickall = ()=> {
      setSelected("");
      setSelectKey((prev) => prev + 1);
      setnotification(allNotifications);
  }
  
  const selecttypenotification = (type: string) => {
    const filteredData = allNotifications.filter(item => item.type === type);
    setnotification(filteredData);
  }

  

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Notification</h1>
        <div className="hidden md:flex items-center gap-2 text-sm rounded-full ring-gray-300 px-2">
          <Button 
            size="lg" 
            className={`bg-blue-500 ${role === 'ADMIN' ? '' : 'hidden'}`}
            onClick={navigateToAddPage}
            >
            Add Notification
          </Button>
          <Button 
            size="lg" 
            className="bg-blue-500"
            onClick={onclickall}
            >
            All
          </Button>      
          <Select
            key={selectKey}
            className="w-64"
            options={typeNotification.map((item) => ({ value: item, label: item }))}
            placeholder="Chọn loại thông báo"
            onChange={(selectedOption) => {
              if (selectedOption) {
                setSelected(selectedOption.value);
                selecttypenotification(selectedOption.value); 
              } else {
                setSelected("");
              }
            }}
          />
            {selected && <p className="text-gray-700">Đã chọn: {selected}</p>}

        </div>
      </div>
      <div className="flex-grow max-h-[500px] overflow-y-auto border border-gray-300 rounded-md p-2 bg-white">
        <ul className="space-y-2">
          {notifications.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-200 rounded-md transition"
              onClick={() => openNotificationDetail(item.id)}
            >
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
              </div>
              <span className="text-sm text-gray-400">{item?.create_date
                      ? new Date(item.create_date).toLocaleDateString("vi-VN")
                      : "Không có ngày"}</span>
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
      <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-black">
            Tạo Thông Báo Mới
          </DialogTitle>
        </DialogHeader>
    
        <form className="flex flex-col gap-4 mt-2" onSubmit={addNotification}>
          <div>
            <label htmlFor="title" className="block text-black mb-1">Tiêu đề</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-600"
              required
            />
          </div>
    
          <div>
            <label htmlFor="content" className="block text-black mb-1">Nội dung</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full h-[200px] px-3 py-2 rounded-md bg-white text-black border border-gray-600"
              required
            />
          </div>
    
          <div>
            <label htmlFor="type" className="block text-black mb-1">Loại thông báo</label>
            <Select
              id="type"
              className="w-full"
              options={typeNotification.map((item) => ({ value: item, label: item }))}
              placeholder="Chọn loại thông báo"
              isClearable
              value={formData.type ? { value: formData.type, label: formData.type } : null}
              onChange={(selectedOption) =>
                setFormData({ ...formData, type: selectedOption ? selectedOption.value : "" })
              }
            />
          </div>
    
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
            >
              Gửi Thông Báo
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
      )}


      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-600">Chi tiết thông báo</DialogTitle>
              <DialogDescription className="text-gray-700 space-y-2">
                <p><strong>Tiêu đề:</strong> {selectedNotification.title}</p>
                <p><strong>Loại:</strong> {selectedNotification.type}</p>
                <p><strong>Ngày tạo:</strong> {selectedNotification?.create_date
                  ? new Date(selectedNotification.create_date).toLocaleString("vi-VN")
                  : "Không có ngày"}
                </p>
                <p className="whitespace-pre-line mt-1"><strong>Nội dung:</strong>{selectedNotification.content}</p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={() => setSelectedNotification(null)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}


    </div>
    
    
  );
  
}

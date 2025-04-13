"use client";
import React, { useState, useEffect, useCallback } from 'react';
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
import { toast } from 'react-toastify';

const TYPE_NOTIFICATION = ['MAINTENANCE', 'SECURITY', 'GENERAL', 'URGENT'];
const TYPE_NOTIFICATION_VN = ['BẢO TRÌ', 'AN NINH', 'CHUNG', 'CẤP BÁCH'];

export default function Announcements() {
  const [showForm, setShowForm] = useState(false);
  const [allNotifications, setAllNotifications] = useState<notification[]>([]);
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<notification | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [selectKey, setSelectKey] = useState(0);
  
  const userId = authService.getUserId();
  const role = authService.getRole();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "",
  });

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getnotification();
      // Sort notifications by create_date in descending order (newest first)
      const sortedData = [...data].sort((a, b) => {
        const dateA = a.create_date ? new Date(a.create_date).getTime() : 0;
        const dateB = b.create_date ? new Date(b.create_date).getTime() : 0;
        return dateB - dateA;
      });
      setAllNotifications(sortedData);
      setNotifications(sortedData);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách thông báo:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Bạn chưa đăng nhập!");
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
      toast.success("Thông báo đã được tạo!");
      setShowForm(false);
      setFormData({ title: "", content: "", type: "" });
      
      // Refresh notification list
      await fetchNotifications();
    } catch (e) {
      console.error("Lỗi:", e);
      toast.error("Gửi thông báo thất bại!");
    }
  };

  const openNotificationDetail = (notificationId: number) => {
    const item = notifications.find((n) => n.id === notificationId);
    if (item) {
      setSelectedNotification(item);
    }
  };

  const resetFilter = () => {
    setSelected("");
    setSelectKey(prev => prev + 1);
    setNotifications(allNotifications);
  };

  const filterByType = (type: string) => {
    const typeEN = TYPE_NOTIFICATION[TYPE_NOTIFICATION_VN.indexOf(type)];
    const filteredData = allNotifications.filter(item => item.type === typeEN);
    setNotifications(filteredData);
  };

  const getLocalizedType = (type: string) => {
    const index = TYPE_NOTIFICATION.indexOf(type);
    return index !== -1 ? TYPE_NOTIFICATION_VN[index] : type;
  };

  const typeOptions = TYPE_NOTIFICATION_VN.map(item => ({ value: item, label: item }));

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Thông báo</h1>
        <div className="hidden md:flex items-center gap-2 text-sm rounded-full ring-gray-300 px-2">
          {role === 'ADMIN' && (
            <Button 
              size="lg" 
              className="bg-blue-500"
              onClick={() => setShowForm(true)}
            >
              Thêm thông báo
            </Button>
          )}
          <Button 
            size="lg" 
            className="bg-blue-500"
            onClick={resetFilter}
          >
            Tất cả
          </Button>      
          <Select
            key={selectKey}
            className="w-64"
            options={typeOptions}
            placeholder="Chọn loại thông báo"
            onChange={(selectedOption) => {
              if (selectedOption) {
                setSelected(selectedOption.value);
                filterByType(selectedOption.value); 
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
          {notifications.length > 0 ? notifications.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-200 rounded-md transition"
              onClick={() => openNotificationDetail(item.id)}
            >
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
              </div>
              <span className="text-sm text-gray-400">
                {item?.create_date
                  ? new Date(item.create_date).toLocaleDateString("vi-VN")
                  : "Không có ngày"}
              </span>
            </li>
          )) : (
            <p className="text-center text-gray-500 py-4">Không có thông báo nào</p>
          )}
        </ul>
      </div>

      {/* Add notification form dialog */}
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
                options={typeOptions}
                placeholder="Chọn loại thông báo"
                isClearable
                value={
                  formData.type
                    ? {
                      value: getLocalizedType(formData.type),
                      label: getLocalizedType(formData.type),
                    }
                    : null
                }
                onChange={(selectedOption) => {
                  const value = selectedOption?.value ?? "";
                  const index = TYPE_NOTIFICATION_VN.indexOf(value);
                  const selectedType = index !== -1 ? TYPE_NOTIFICATION[index] : "";
                  setFormData(prev => ({ ...prev, type: selectedType }));
                }}
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

      {/* Notification detail dialog */}
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-600">Chi tiết thông báo</DialogTitle>
              <DialogDescription className="border rounded-md p-4 bg-gray-50 space-y-3 mt-2 text-gray-700">
                <span className="block mb-2"><strong>Tiêu đề:</strong> {selectedNotification.title}</span>
                <span className="block mb-2"><strong>Loại:</strong> {getLocalizedType(selectedNotification.type)}</span>
                <span className="block mb-2"><strong>Ngày tạo:</strong> {selectedNotification?.create_date
                  ? new Date(selectedNotification.create_date).toLocaleDateString("vi-VN")
                  : "Không có ngày"}
                </span>
                <span className="whitespace-pre-line mt-1 block mb-2"><strong>Nội dung:</strong> {selectedNotification.content}</span>
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

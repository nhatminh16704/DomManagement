"use client";
import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { getnotification, getnotificationtype, notification } from '@/services/notificationService';
import { getTypeNotification, typenotification } from '@/services/typenotification';

export default function Announcements() {
  const router=useRouter();
  const [notifications, setnotification] = useState<notification[]>([]);
  const [typenotification,settypenotification ] = useState<typenotification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<typenotification | null>(null);

  useEffect(() => {
    getnotification().then((data) => {
      // Chuyển đổi created_date thành Date
      const formattedData = data.map((item) => ({
        ...item,
        created_date: new Date(item.created_date),
      }));
      setnotification(formattedData);
    }).catch((err) => {
      console.error("Lỗi khi lấy danh sách thông báo:", err);
    });
  }, []);

  useEffect(() => {
      getTypeNotification()
        .then((data) => {
          settypenotification(data); // Cập nhật state rooms với dữ liệu từ API
        })
        .catch((err) => {
          console.error("Lỗi khi lấy danh sách phòng:", err); // Hiển thị lỗi nếu có
        });
    }, [])

  const navigateToDetailPage = (notificationId: number) => {
    const url=`/announcements/${notificationId}`;
    router.push(`/announcements/${notificationId}`);
  };

  const onclickall = ()=> {
      setSelected(null);
      getnotification().then((data) => {
        // Chuyển đổi created_date thành Date
        const formattedData = data.map((item) => ({
          ...item,
          created_date: new Date(item.created_date),
        }));
        setnotification(formattedData);
      }).catch((err) => {
        console.error("Lỗi khi lấy danh sách thông báo:", err);
      });
  }
  
  const selecttypenotification = (type: number) => {
    getnotificationtype(type).then((data) => {
      const formattedData = data.map((item) => ({
        ...item,
        created_date: new Date(item.created_date),
      }));
      setnotification(formattedData);
    }).catch((err) => {
      console.error("Lỗi khi lấy danh sách thông báo theo loại:", err);
    });
  }

  

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Notification</h1>
        <div className="hidden md:flex items-center gap-2 text-sm     rounded-full ring-gray-300 px-2">
          <Button 
            size="lg" 
            className="bg-blue-500"
            onClick={onclickall}
            >
            All
          </Button>
      
          <Select
            className="w-64"
            options={typenotification.map(item => ({ value: item.id, label: item.name }))}
            placeholder="Chọn loại thông báo"
            onChange={(selectedOption) => {
              if (selectedOption) {
                setSelected({ id: selectedOption.value, name: selectedOption.label });
                selecttypenotification(selectedOption.value); // Gọi API lấy thông báo theo type
              } else {
                setSelected(null);
                onclickall(); // Hiển thị lại tất cả thông báo
              }
            }}
            />
            {selected && <p className="text-gray-700">Đã chọn: {selected.name}</p>}

        </div>
      </div>
      <ul className="space-y-2">
        {notifications.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b border-gray-600 pb-2"
            onClick={() => navigateToDetailPage(item.id)}
          >
            <span className="text-blue-400">▶ {item.title}</span>
            <span className="text-sm text-gray-400">{item.created_date.toLocaleDateString()}</span>
          </li>
        ))}
      </ul>

    </div>
  )
}

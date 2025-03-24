"use client";
import React from 'react'
  import { useState, useEffect } from 'react';
  import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { getnotification, getnotificationtype, gettype, notification } from '@/services/notificationService';
import { date } from 'zod';

export default function Announcements() {
  const router=useRouter();
  const [notifications, setnotification] = useState<notification[]>([]);
  const [typeNotification, setTypeNotification] = useState<string[]>([]); 
  const [selected, setSelected] = useState<String>("");
  const [selectKey, setSelectKey] = useState(0); 

  useEffect(() => {
    getnotification().then((data) => {
      const formattedData = data.map((item) => ({
        ...item,
        created_date: new Date(item.created_date),
      }));
      setnotification(formattedData);
    }).catch((err) => {
      console.error("Lỗi khi lấy danh sách thông báo:", err);
    });
  }, []);
  useEffect(()=>{
    gettype()
      .then((data) => {
        setTypeNotification(data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách loại thông báo:", err);
      });
  }, []);
  

  const navigateToDetailPage = (notificationId: number) => {
    const url=`/announcements/${notificationId}`;
    router.push(url);
  };



  const navigateToAddPage = () => {
    router.push("/addannouncement");
  };

  const onclickall = ()=> {
      setSelected("");
      setSelectKey((prev) => prev + 1);
      getnotification().then((data) => {
        const formattedData = data.map((item) => ({
          ...item,
          created_date: new Date(item.created_date),
        }));
        setnotification(formattedData);
      }).catch((err) => {
        console.error("Lỗi khi lấy danh sách thông báo:", err);
      });
  }
  
  const selecttypenotification = (type: string) => {
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
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Notification</h1>
        <div className="hidden md:flex items-center gap-2 text-sm rounded-full ring-gray-300 px-2">
          <Button 
            size="lg" 
            className="bg-blue-500"
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
      <div className="flex-grow max-h-[500px] overflow-y-auto border border-gray-600 rounded-md p-2">
        <ul className="space-y-2">
          {notifications.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border-b border-gray-600 pb-2 cursor-pointer"
              onClick={() => navigateToDetailPage(item.id)}
            >
              <span className="text-blue-400">▶ {item.title}</span>
              <span className="text-sm text-gray-400">{item.created_date.toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

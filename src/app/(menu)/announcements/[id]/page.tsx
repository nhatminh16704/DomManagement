"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter,useParams } from "next/navigation"
import { getnotificationId, notification } from '@/services/notificationService';
import { Button } from '@/components/ui/button';

export type notificationDTO = {
  title: string;
  content: string;
  create_date: Date;
  name_person_create: String;
}

export default function AnnouncementsDetail() {
  const router= useRouter();
  const { id } = useParams();
  const [notificationDTO, setnotificationDTO] = useState<notificationDTO|null>();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const notificationId = Number(id); 
    if (isNaN(notificationId)) return;

    getnotificationId(notificationId)
      .then((data) => {
        setnotificationDTO(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);
  
  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }
  return (
    <div className="p-6 bg-[#F7F8FA]">
      <h1 className="text-2xl font-bold mb-4">{notificationDTO?.title}</h1>
        <p> {notificationDTO?.content}</p>
        <p><strong>Ngày tạo: </strong>{notificationDTO?.create_date
        ? new Date(notificationDTO.create_date).toLocaleDateString("vi-VN")
        : "Không có ngày"}
        </p>
        <p><strong>Người viết: </strong>{notificationDTO?.name_person_create}</p>
          
      <Button className="mt-4 bg-blue-500" onClick={() => router.back()}>
        Quay lại
      </Button>
    </div>
  )
}

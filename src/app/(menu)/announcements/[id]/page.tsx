"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter,useParams } from "next/navigation"
import { getnotificationId, notification } from '@/services/notificationService';


export default function AnnouncementsDetail() {
  const router= useRouter();
  const { id } = useParams();
  const [notifications, setnotification] = useState<notification|null>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const notificationId = Number(id); 
    if (isNaN(notificationId)) return;

    getnotificationId(notificationId)
      .then((data) => {
        setnotification(data);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4"> {notifications?.title} </h1>
      <p>{notifications?.content}</p>
      <p>{notifications?.created_date.toDateString()}</p>
    </div>
  )
}

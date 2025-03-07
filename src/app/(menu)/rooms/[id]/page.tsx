"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getRoomById, Room } from "@/services/roomService";  // Import service để lấy phòng
import { Button } from "@/components/ui/button";

export default function RoomDetail() {
  const router = useRouter();
  const params = useParams(); // Dùng useParams để lấy params từ URL
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return; // Kiểm tra nếu không có roomId trong params

    getRoomById(params.id as string)
      .then((data) => {
        setRoom(data); // Cập nhật phòng nếu fetch thành công
        setLoading(false);
      })
      .catch(() => {
        setLoading(false); // Nếu có lỗi, dừng tải
      });
  }, [params.id]); // Mỗi khi params.id thay đổi, sẽ fetch lại thông tin phòng

  if (loading) {
    return <p>Đang tải dữ liệu...</p>; // Hiển thị khi đang tải
  }

  return (
    <div className="p-6 bg-[#F7F8FA]">
      <h1 className="text-2xl font-bold mb-4">Thông tin phòng</h1>
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <p><strong>ID Phòng:</strong> {room?.roomId}</p>
        <p><strong>Loại phòng:</strong> {room?.blockType}</p>
        <p><strong>Giá phòng:</strong> {room?.price}</p>
        <p><strong>Số người ở:</strong> {room?.totalBeds}</p>
        <p><strong>Giường còn trống:</strong> {room?.availableBeds}</p>
      </div>
      <Button className="mt-4 bg-blue-500" onClick={() => router.back()}>
        Quay lại
      </Button>
    </div>
  );
}

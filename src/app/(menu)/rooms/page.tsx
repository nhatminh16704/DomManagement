"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getRooms, Room } from "@/services/roomService";

export default function Rooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch danh sách phòng
  useEffect(() => {
    getRooms()
      .then((data) => {
        setRooms(data); // Cập nhật state rooms với dữ liệu từ API
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách phòng:", err); // Hiển thị lỗi nếu có
      });
  }, []);

  const navigateToDetailPage = (roomId: string) => {
    // Sử dụng useRouter để chuyển hướng đến trang chi tiết phòng
    const roomDetailUrl = `/rooms/${roomId}`;

    // Chuyển đến trang có đường dẫn `/rooms/{room_id}`
    router.push(roomDetailUrl);
  };

  const filteredRooms = rooms.filter((room) => {
    // Kiểm tra xem room_id có chứa từ khóa tìm kiếm không
    const normalizedRoomId = room.id.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();

    // Kiểm tra xem room_id có chứa từ khóa tìm kiếm không
    return normalizedRoomId.includes(normalizedSearchTerm);
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">
          Danh sách phòng
        </h1>
        <div className="hidden md:flex items-center gap-2 text-sm rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image src="/search.png" alt="Search" width={16} height={16} />
          <input
            type="text"
            placeholder="Tìm kiếm phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] p-2 bg-transparent outline-none"
          />
        </div>
      </div>
      <Table>
        <TableCaption>Danh sách phòng trong ký túc xá.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID Phòng</TableHead>
            <TableHead>Loại phòng</TableHead>
            <TableHead>Giá phòng</TableHead>
            <TableHead>Số người ở</TableHead>
            <TableHead>Giường còn trống</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.id}</TableCell>
              <TableCell>{room.type}</TableCell>
              <TableCell>{room.price}</TableCell>
              <TableCell>{room.occupancy}</TableCell>
              <TableCell>{room.available_beds}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  className="mr-2 bg-blue-500"
                  onClick={() => navigateToDetailPage(room.id)}
                >
                  Xem
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getRooms, Room } from "@/services/roomService";

export default function Rooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
  const roomsPerPage = 8; // Số sinh viên mỗi trang

  const filteredRooms = rooms.filter((room) => {
    // Kiểm tra xem room_id có chứa từ khóa tìm kiếm không
    const normalizedRoomId = room.roomName.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();

    // Kiểm tra xem room_id có chứa từ khóa tìm kiếm không
    return normalizedRoomId.includes(normalizedSearchTerm);
  });
  // Tính toán phân trang
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  // Tạo mảng số trang
  const pageNumbers = Array.from({ length: Math.min(totalPages, 3) }, (_, i) =>
    currentPage > 2 && totalPages > 3 ? currentPage - 1 + i : i + 1
  );

  // Reset về trang 1 khi searchTerm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Hàm chuyển trang
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Fetch danh sách phòng
  useEffect(() => {
    getRooms()
      .then((data) => {
        setRooms(data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách phòng:", err);
      });
  }, []);

  const navigateToDetailPage = (roomId: number) => {
    const roomDetailUrl = `/rooms/${roomId}`;
    router.push(roomDetailUrl);
  };

  return (
    <div className="bg-[#F7F8FA]">
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
        <TableCaption>Danh sách phòng ký túc xá.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID Phòng</TableHead>
            <TableHead>Loại phòng</TableHead>
            <TableHead>Giá phòng</TableHead>
            <TableHead>Số người tối đa</TableHead>
            <TableHead>Còn trống</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.roomName}</TableCell>
              <TableCell>{room.typeRoom}</TableCell>
              <TableCell>{room.price}</TableCell>
              <TableCell>{room.maxStudents}</TableCell>
              <TableCell>{room.available}</TableCell>
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

      {/* Nút phân trang với Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={prevPage}
                className={`
              hover:bg-blue-500 hover:text-white transition-colors 
              ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              `}
              />
            </PaginationItem>
            {pageNumbers.map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  onClick={() => setCurrentPage(number)}
                  isActive={currentPage === number}
                  className="cursor-pointer hover:bg-blue-500 hover:text-white transition-colors"
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            {/*Hiển thị dấu ... nếu totalPages > 3 và currentPage < totalPages - 1 */}
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={`
                  hover:bg-blue-500 hover:text-white transition-colors 
                  ${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  `}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

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
import { getStudents, deleteStudent, Student } from "@/services/studentService";

export default function Students() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // State cho trang hiện tại
  const studentsPerPage = 8; // Số sinh viên mỗi trang

  // Fetch danh sách sinh viên
  useEffect(() => {
    getStudents()
      .then((data) => {
        setStudents(data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách sinh viên:", err);
      });
  }, []);

  const handleDelete = async (studentId: number) => {
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sinh viên này?");
    if (isConfirmed) {
      try {
        await deleteStudent(studentId);
        const updatedStudents = students.filter(
          (student) => student.id !== studentId
        );
        setStudents(updatedStudents);
      } catch (error) {
        console.error("Lỗi khi xóa sinh viên:", error);
      }
    }
  };

  const navigateToDetailPage = (studentId: number) => {
    const studentDetailUrl = `/students/${studentId}`;
    router.push(studentDetailUrl);
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`;
    const normalizedFullName = fullName.toLowerCase();
    const normalizedStudentId = student.studentId.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();
    
    return (
      normalizedFullName.includes(normalizedSearchTerm) ||
      normalizedStudentId.includes(normalizedSearchTerm)
    );
  });

  // Tính toán phân trang
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">
          Danh sách sinh viên
        </h1>
        <div className="hidden md:flex items-center gap-2 text-sm rounded-full ring-[1.5px] ring-gray-300 px-2">
          <Image src="/search.png" alt="Search" width={16} height={16} />
          <input
            type="text"
            placeholder="Tìm kiếm sinh viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px] p-2 bg-transparent outline-none"
          />
        </div>
      </div>
      <Table>
        <TableCaption>Danh sách sinh viên.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Mã SV</TableHead>
            <TableHead>Họ và Tên</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Lớp</TableHead>
            <TableHead>SĐT</TableHead>
            <TableHead>Quê quán</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentStudents.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>{student.studentId}</TableCell>
              <TableCell>
                {student.firstName} {student.lastName}
              </TableCell>
              <TableCell>{student.birthday}</TableCell>
              <TableCell>{student.gender}</TableCell>
              <TableCell>{student.className}</TableCell>
              <TableCell>{student.phoneNumber}</TableCell>
              <TableCell>{student.hometown}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  className="mr-2 bg-blue-500"
                  onClick={() => navigateToDetailPage(student.id)}
                >
                  Xem
                </Button>
                <Button
                  size="sm"
                  className="bg-red-500"
                  onClick={() => handleDelete(student.id)}
                >
                  Xóa
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
              ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                  ${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  `}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

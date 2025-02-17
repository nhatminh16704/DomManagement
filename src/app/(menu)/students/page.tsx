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
import { getStudents, deleteStudent, Student } from "@/services/studentService";

export default function Students() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch danh sách sinh viên
  useEffect(() => {
    getStudents()
      .then((data) => {
        setStudents(data); // Cập nhật state students với dữ liệu từ API
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách sinh viên:", err); // Hiển thị lỗi nếu có
      });
  }, []);
  

  const handleDelete = async (studentId: number) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sinh viên này?");
    
    // Nếu người dùng bấm "OK" thì tiếp tục xóa
    if (isConfirmed) {
      try {
        // Gọi API để xóa sinh viên theo mã sinh viên (student_code)
        await deleteStudent(studentId);
  
        // Cập nhật danh sách sinh viên bằng cách loại bỏ sinh viên đã xóa
        const updatedStudents = students.filter((student) => {
          return student.id !== studentId;
        });
  
        // Cập nhật state students với danh sách mới
        setStudents(updatedStudents);
      } catch (error) {
        console.error("Lỗi khi xóa sinh viên:", error);
      }
    }
  };
  

  const navigateToDetailPage = (studentId: number) => {
    // Sử dụng useRouter để chuyển hướng đến trang chi tiết sinh viên
    const studentDetailUrl = `/students/${studentId}`;
  
    // Chuyển đến trang có đường dẫn `/students/{student_id}`
    router.push(studentDetailUrl);
  };
  

  const filteredStudents = students.filter((student) => {
    // Ghép họ và tên đầy đủ của sinh viên
    const fullName = `${student.first_name} ${student.name}`;
  
    // Chuyển họ và tên + từ khóa tìm kiếm về chữ thường để so sánh không phân biệt hoa thường
    const normalizedFullName = fullName.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();
  
    // Kiểm tra xem tên sinh viên có chứa từ khóa tìm kiếm không
    return normalizedFullName.includes(normalizedSearchTerm);
  });
  

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
          {filteredStudents.map((student) => (
            <TableRow key={student.student_code}>
              <TableCell>{student.student_code}</TableCell>
              <TableCell>{student.first_name} {student.name}</TableCell>
              <TableCell>{student.birthday}</TableCell>
              <TableCell>{student.gender}</TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{student.phone_number}</TableCell>
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
    </div>
  );
}

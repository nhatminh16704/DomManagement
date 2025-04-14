// src/app/students/page.tsx
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
import { Eye, Trash2, PenSquare, AlertTriangle } from "lucide-react";
import AddStudentModal from "@/components/student/AddStudentModal";
import AddViolationModal from "@/components/student/AddViolationModal";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";

export default function Students() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 8;
  const [isOpen, setIsOpen] = useState(false); // Modal thêm/sửa sinh viên
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Dialog xác nhận xóa
  const [isViolationOpen, setIsViolationOpen] = useState(false); // Modal tạo vi phạm
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Fetch danh sách sinh viên
  useEffect(() => {
    getStudents()
      .then((data) => setStudents(data))
      .catch((err) => console.error("Lỗi khi lấy danh sách sinh viên:", err));
  }, []);

  const navigateToDetailPage = (studentId: number) => {
    router.push(`/students/${studentId}`);
  };

  const filteredStudents = students.filter((student) => {
    const fullName = student.fullName.toLowerCase();
    const normalizedStudentId = student.studentCode.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();
    return (
      fullName.includes(normalizedSearchTerm) ||
      normalizedStudentId.includes(normalizedSearchTerm)
    );
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  useEffect(() => setCurrentPage(1), [searchTerm]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 3) }, (_, i) =>
    currentPage > 2 && totalPages > 3 ? currentPage - 1 + i : i + 1
  );

  const refreshStudents = () => {
    getStudents()
      .then((data) => setStudents(data))
      .catch((err) => console.error("Lỗi khi lấy danh sách sinh viên:", err));
  };

  const handleAddStudent = () => {
    setIsOpen(true);
    setSelectedStudent(undefined);
  };

  const handleEditStudent = (student: Student) => {
    setIsOpen(true);
    setSelectedStudent(student);
  };

  const handleDelete = async () => {
    if (!selectedStudentId) return;

    try {
      await deleteStudent(selectedStudentId);
      toast.success("Deleted successfully!");
      refreshStudents();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
    setIsConfirmOpen(false);
  };

  const openConfirmModal = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsConfirmOpen(true);
  };

  const openViolationModal = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsViolationOpen(true);
  };

  return (
    <div className="bg-[#F7F8FA]">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">
          Danh sách sinh viên
        </h1>

        <div className="flex items-center gap-4">
            <Button
            className="bg-colorprimary hover:bg-colorprimary/90 text-white"
            onClick={handleAddStudent}
            >
            Thêm sinh viên
            </Button>
            <AddStudentModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onStudentAdded={refreshStudents}
            student={selectedStudent}
            />
            <AddViolationModal
            isOpen={isViolationOpen}
            onClose={() => setIsViolationOpen(false)}
            studentId={selectedStudentId!}
            onViolationAdded={refreshStudents}
            />
            <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            message="Bạn có chắc chắn muốn xóa sinh viên này không?"
            onConfirm={handleDelete}
            />
          <div className="hidden md:flex items-center gap-2 text-sm rounded-full ring-[1.5px] ring-gray-300 px-3 py-1 transition-all hover:ring-gray-400 hover:ring-2 focus-within:ring-colorprimary focus-within:ring-2 group">
            <Image
              src="/search.png"
              alt="Search"
              width={16}
              height={16}
              className="opacity-70 group-hover:opacity-80"
            />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] p-2 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
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
            <TableRow key={student.id}>
              <TableCell>{student.studentCode}</TableCell>
              <TableCell>{student.fullName}</TableCell>
              <TableCell>{formatDate(student.birthday)}</TableCell>
              <TableCell>{student.gender}</TableCell>
              <TableCell>{student.className}</TableCell>
              <TableCell>{student.phoneNumber}</TableCell>
              <TableCell>{student.hometown}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lightsuccess text-success hover:bg-success hover:text-white transition-colors"
                    onClick={() => handleEditStudent(student)}
                    title="Chỉnh sửa"
                  >
                    <PenSquare className="h-6 w-6" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lightinfo text-info hover:bg-info hover:text-white transition-colors"
                    onClick={() => navigateToDetailPage(student.id)}
                    title="Xem chi tiết"
                  >
                    <Eye className="h-6 w-6" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lightwarning text-warning hover:bg-warning hover:text-white transition-colors"
                    onClick={() => openViolationModal(student.id)}
                    title="Thêm vi phạm"
                  >
                    <AlertTriangle className="h-6 w-6" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lighterror text-error hover:bg-error hover:text-white transition-colors"
                    onClick={() => openConfirmModal(student.id)}
                    title="Xóa sinh viên"
                  >
                    <Trash2 className="h-6 w-6" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={prevPage}
                className={`hover:bg-blue-500 hover:text-white transition-colors ${
                  currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                }`}
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
            {totalPages > 3 && currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                className={`hover:bg-blue-500 hover:text-white transition-colors ${
                  currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
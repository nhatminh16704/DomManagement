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
import { getStaffs, deleteStaff, Staff } from "@/services/staffService";
import { Eye, Trash2, PenSquare } from "lucide-react";
import AddStaffModal from "@/components/staff/AddStaffModal";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";

console.log("tesst");

export default function Staffs() {
  const router = useRouter();
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const staffsPerPage = 8;
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Fetch danh sách nhân viên
  useEffect(() => {
    getStaffs()
      .then((data) => setStaffs(data))
      .catch((err) => console.error("Lỗi khi lấy danh sách nhân viên:", err));
  }, []);

  const navigateToDetailPage = (staffId: number) => {
    router.push(`staffs/${staffId}`);
  };

  const filteredStaffs = staffs.filter((staff) => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const normalizedSearchTerm = searchTerm.toLowerCase();
    return fullName.includes(normalizedSearchTerm);
  });

  const indexOfLastStaff = currentPage * staffsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffsPerPage;
  const currentStaffs = filteredStaffs.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaffs.length / staffsPerPage);

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

  const refreshStaffs = () => {
    getStaffs()
      .then((data) => setStaffs(data))
      .catch((err) => console.error("Lỗi khi lấy danh sách nhân viên:", err));
  };

  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();

  const handleAddStaff = () => {
    setIsOpen(true);
    setSelectedStaff(undefined);
  };

  const handleEditStaff = (staff: Staff) => {
    setIsOpen(true);
    setSelectedStaff(staff);
  };

  const handleDelete = async () => {
    if (!selectedStaffId) return;

    try {
      await deleteStaff(selectedStaffId);
      toast.success("Deleted successfully!");
      refreshStaffs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
    setIsConfirmOpen(false);
  };

  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const openConfirmModal = (staffId: number) => {
    setSelectedStaffId(staffId);
    setIsConfirmOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">
          Danh sách nhân viên
        </h1>

        <div className="flex items-center gap-4">
          <Button
            className="bg-colorprimary hover:bg-colorprimary/90 text-white"
            onClick={handleAddStaff}
          >
            Thêm nhân viên
          </Button>
          <AddStaffModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onStaffAdded={refreshStaffs}
            staff={selectedStaff}
          />
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            message="Are you sure you want to delete this staff?"
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
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] p-2 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
      <Table>
        <TableCaption>Danh sách nhân viên.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Họ và tên</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Chức vụ</TableHead>
            <TableHead>Ngày bắt đầu</TableHead>
            <TableHead>SĐT</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentStaffs.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>{`${staff.lastName} ${staff.firstName}`}</TableCell>
              <TableCell>{formatDate(staff.birthday)}</TableCell>
              <TableCell>{staff.gender}</TableCell>
              <TableCell>{staff.position}</TableCell>
              <TableCell>{staff.startDate}</TableCell>
              <TableCell>{staff.phoneNumber}</TableCell>
              <TableCell>{staff.address}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lightsuccess text-success hover:bg-success hover:text-white transition-colors"
                    onClick={() => handleEditStaff(staff)}
                    title="Chỉnh sửa"
                  >
                    <PenSquare className="h-6 w-6" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lightinfo text-info hover:bg-info hover:text-white transition-colors"
                    onClick={() => navigateToDetailPage(staff.id)}
                    title="Xem chi tiết"
                  >
                    <Eye className="h-6 w-6" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lighterror text-error hover:bg-error hover:text-white transition-colors"
                    onClick={() => openConfirmModal(staff.id)}
                    title="Xóa nhân viên"
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
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
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
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
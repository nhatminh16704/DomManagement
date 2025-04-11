/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { PenSquare, Trash2 } from "lucide-react";
import { getReports, updateReportStatus, deleteReport, Report } from "@/services/reportService";
import { toast } from "react-toastify";
import AddReportModal from "@/components/report/AddReportModal";

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Fetch reports từ API
  useEffect(() => {
    refreshReports();
  }, []);

  const refreshReports = () => {
    getReports()
      .then((data) => setReports(data))
      .catch((err) => console.error("Lỗi khi lấy danh sách báo cáo:", err));
  };

  // Filter reports based on status and search query
  const filteredReports = reports.filter((report) => {
    const matchesStatus = filteredStatus
      ? report.status.toLowerCase() === filteredStatus.toLowerCase()
      : true;
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.createdBy.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  useEffect(() => setCurrentPage(1), [searchQuery, filteredStatus]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 3) }, (_, i) =>
    currentPage > 2 && totalPages > 3 ? currentPage - 1 + i : i + 1
  );

  // Statistics
  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter((report) => report.status === "PENDING").length,
    inProgressReports: reports.filter((report) => report.status === "INPROGRESS").length,
    resolvedReports: reports.filter((report) => report.status === "RESOLVED").length,
  };

  const handleFilterByStatus = (status: string | null) => {
    setFilteredStatus(status === filteredStatus ? null : status);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReport(id);
      toast.success("Xóa báo cáo thành công!");
      refreshReports();
    } catch (error) {
      toast.error("Lỗi khi xóa báo cáo!");
    }
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setIsEditOpen(true);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedReport) return;
    try {
      await updateReportStatus(selectedReport.id, newStatus);
      toast.success("Cập nhật trạng thái thành công!");
      setReports(
        reports.map((r) =>
          r.id === selectedReport.id ? { ...r, status: newStatus } : r
        )
      );
      setIsEditOpen(false);
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  const handleAddReport = () => {
    setIsAddOpen(true);
  };

  function formatSentDate(rawDate: string): string {
    const date = new Date(rawDate);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-center text-primary relative pb-3 after:content-[''] after:absolute after:w-24 after:h-1 after:bg-primary after:bottom-0 after:left-1/2 after:-translate-x-1/2">
          Reports Management
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div
          className={`rounded-lg p-6 bg-lightinfo shadow-sm min-h-[120px] flex items-center justify-center cursor-pointer ${filteredStatus === null ? "ring-2 ring-info" : ""}`}
          onClick={() => handleFilterByStatus(null)}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-info mb-2">TOTAL</div>
            <p className="text-3xl font-bold text-info">{stats.totalReports}</p>
          </div>
        </div>
        <div
          className={`rounded-lg p-6 bg-lighterror shadow-sm min-h-[120px] flex items-center justify-center cursor-pointer ${filteredStatus === "pending" ? "ring-2 ring-error" : ""}`}
          onClick={() => handleFilterByStatus("pending")}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-error mb-2">PENDING</div>
            <p className="text-3xl font-bold text-error">{stats.pendingReports}</p>
          </div>
        </div>
        <div
          className={`rounded-lg p-6 bg-lightwarning shadow-sm min-h-[120px] flex items-center justify-center cursor-pointer ${filteredStatus === "inprogress" ? "ring-2 ring-warning" : ""}`}
          onClick={() => handleFilterByStatus("inprogress")}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-warning mb-2">INPROGRESS</div>
            <p className="text-3xl font-bold text-warning">{stats.inProgressReports}</p>
          </div>
        </div>
        <div
          className={`rounded-lg p-6 bg-lightsuccess shadow-sm min-h-[120px] flex items-center justify-center cursor-pointer ${filteredStatus === "resolved" ? "ring-2 ring-success" : ""}`}
          onClick={() => handleFilterByStatus("resolved")}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-success mb-2">RESOLVED</div>
            <p className="text-3xl font-bold text-success">{stats.resolvedReports}</p>
          </div>
        </div>
      </div>

      {/* Search box và Filter info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="w-[300px]">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {filteredStatus && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                Filtered by:{" "}
                <span className="font-bold uppercase">{filteredStatus}</span>
              </span>
              {/* <button
                className="ml-2 text-sm text-gray-500 hover:text-red-500"
                onClick={() => setFilteredStatus(null)}
              >
                Clear filter
              </button> */}
            </div>
          )}
        </div>
        <Button
          className="bg-colorprimary hover:bg-colorprimary/90 text-white"
          onClick={handleAddReport}
        >
          Tạo báo cáo
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableCaption>Danh sách báo cáo.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Gửi từ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày gửi</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.id}</TableCell>
              <TableCell>{report.title}</TableCell>
              <TableCell>{report.createdBy.userName}</TableCell>
              <TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status.toLowerCase() === "resolved"
                      ? "bg-success/20 text-success border border-success/30"
                      : report.status.toLowerCase() === "pending"
                      ? "bg-error/20 text-error border border-error/30"
                      : "bg-warning/20 text-warning border border-warning/30"
                  }`}
                >
                  {report.status}
                </span>
              </TableCell>
              <TableCell>{formatSentDate(report.sentDate)}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lightsuccess text-success hover:bg-success hover:text-white transition-colors"
                    onClick={() => handleEditReport(report)}
                    title="Chỉnh sửa"
                  >
                    <PenSquare className="h-6 w-6" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-10 w-10 bg-lighterror text-error hover:bg-error hover:text-white transition-colors"
                    onClick={() => handleDelete(report.id)}
                    title="Xóa báo cáo"
                  >
                    <Trash2 className="h-6 w-6" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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

      {/* Modal tạo report */}
      <AddReportModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onReportAdded={refreshReports}
      />

      {/* Modal chỉnh sửa report */}
      {selectedReport && (
  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
    <DialogContent className="sm:max-w-[650px] rounded-xl shadow-2xl bg-white p-0 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gray-900 text-white p-5 flex justify-between items-center">
        <DialogTitle className="text-xl font-bold tracking-tight">
          Báo cáo #{selectedReport.id}
        </DialogTitle>
        <button
          onClick={() => setIsEditOpen(false)}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 bg-gray-50">
        {/* Thông tin chính */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Tiêu đề</p>
              <p className="text-gray-900 font-medium">{selectedReport.title}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Nội dung</p>
              <p className="text-gray-900 font-medium leading-relaxed">{selectedReport.content}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Gửi từ</p>
              <p className="text-gray-900 font-medium">{selectedReport.createdBy.userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Ngày gửi</p>
              <p className="text-gray-900 font-medium">{formatSentDate(selectedReport.sentDate)}</p>
            </div>
          </div>
        </div>

        {/* Trạng thái */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Trạng thái</p>
            <Select
              value={selectedReport.status}
              onValueChange={(value) => handleUpdateStatus(value)}
            >
              <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="INPROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)}
    </div>
  );
}
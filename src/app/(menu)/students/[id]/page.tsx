"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getStudentById, Student } from "@/services/studentService";
import { Button } from "@/components/ui/button";

export default function StudentDetail() {
  const router = useRouter();
  const params = useParams(); // ✅ Dùng useParams để lấy params
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    getStudentById(Number(params.id))
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Thông tin sinh viên</h1>
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <p><strong>Mã sinh viên:</strong> {student?.student_code}</p>
        <p><strong>Họ và Tên:</strong> {student?.first_name} {student?.name}</p>
        <p><strong>Ngày sinh:</strong> {student?.birthday}</p>
        <p><strong>Giới tính:</strong> {student?.gender}</p>
        <p><strong>Lớp:</strong> {student?.class}</p>
        <p><strong>Số điện thoại:</strong> {student?.phone_number}</p>
        <p><strong>Email:</strong> {student?.email}</p>
        <p><strong>Quê quán:</strong> {student?.hometown}</p>
      </div>
      <Button className="mt-4 bg-blue-500" onClick={() => router.back()}>
        Quay lại
      </Button>
    </div>
  );
}

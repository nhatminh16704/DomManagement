"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react"; // Biểu tượng từ lucide-react
import { useParams } from "next/navigation";
import { getStudentById, Student } from "@/services/studentService";
import { useEffect, useState } from "react";
import RentalInfo from "@/components/student/RentalInfo";




export default function ProfilePage() {
  
  const { id } = useParams();
  const [student, setStudent] = useState<Student | undefined>();

  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentId = Number(id);
        if (!isNaN(studentId)) {
          const studentData = await getStudentById(studentId);
          setStudent(studentData);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    
    fetchStudentData();
  }, [id]);
  

  return (
    <div className="bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-7xl shadow-lg rounded-lg overflow-hidden mb-6">
        {/* Header với ảnh đại diện và tên */}
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 h-40">
          <div className="absolute -bottom-16 left-8">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage
                src="https://via.placeholder.com/150"
                alt="Profile"
              />
              <AvatarFallback>{student?.fullName.charAt(0) || ''}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Nội dung chính */}
        <CardHeader className="pt-20 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                {student?.fullName || ''}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Mã SV: {student?.studentCode || ''}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Thông tin cá nhân */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngày sinh */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Ngày sinh</p>
                <p className="text-gray-600">{student?.birthday || ''}</p>
              </div>
            </div>

            {/* Lớp */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Lớp</p>
                <p className="text-gray-600">{student?.className || ''}</p>
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Số điện thoại
                </p>
                <p className="text-gray-600">{student?.phoneNumber || ''}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-600">{student?.email || ''}</p>
              </div>
            </div>

            {/* Quê quán */}
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Quê quán</p>
                <p className="text-gray-600">{student?.hometown || ''}</p>
              </div>
            </div>

            {/* Account ID */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Giới tính</p>
                <p className="text-gray-600">{student?.gender || ''}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <RentalInfo studentId={student?.id} />
      
    </div>
  );
}

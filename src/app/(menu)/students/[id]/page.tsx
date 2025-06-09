"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStudentById, StudentProfile } from "@/services/studentService";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";

export default function StudentDetailPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const studentId = Number(params.id);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const profileData = await getStudentById(studentId);
        setProfile(profileData);
      } catch (error: unknown) {
        console.error("Error fetching student profile:", error);
        toast.error("Không thể tải thông tin sinh viên!");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProfile();
  }, [studentId]);

  if (loading) {
    return <div className="text-center p-4">Đang tải...</div>;
  }

  if (!profile) {
    return <div className="text-center p-4">Không có dữ liệu sinh viên!</div>;
  }

  const displayName = profile.fullName;
  const currentRoom = profile.roomRentals.find((rental) => rental.status === "ACTIVE");
  const roomHistory = profile.roomRentals.filter((rental) => rental.status === "EXPIRED");
  const violations = profile.violations;

  return (
    <div className="bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-7xl shadow-lg rounded-lg overflow-hidden mb-6">
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 h-40">
          <div className="absolute -bottom-16 left-8">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src="https://via.placeholder.com/150" alt="Profile" />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardHeader className="pt-20 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                {displayName}
              </CardTitle>
              <p className="text-sm text-gray-500">Mã SV: {profile.studentCode}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Ngày sinh</p>
                <p className="text-gray-600">{formatDate(profile.birthday)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Lớp</p>
                <p className="text-gray-600">{profile.className}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                <p className="text-gray-600">{profile.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Quê quán</p>
                <p className="text-gray-600">{profile.hometown}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Giới tính</p>
                <p className="text-gray-600">{profile.gender}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phần Dormitory Information được thiết kế lại */}
      <Card className="w-full max-w-7xl shadow-lg rounded-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
        Thông tin Ký túc xá
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 rounded-lg p-1">
          <TabsTrigger
            value="current"
            className="py-2 text-gray-700 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Phòng Hiện tại
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="py-2 text-gray-700 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Lịch sử Phòng
          </TabsTrigger>
          <TabsTrigger
            value="violation"
            className="py-2 text-gray-700 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Vi phạm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Thông tin Phòng Hiện tại
            </h3>
            {currentRoom ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">Số phòng</span>
              <span className="text-gray-800 font-semibold">{currentRoom.roomName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">Ngày nhận phòng</span>
              <span className="text-gray-800 font-semibold">{formatDate(currentRoom.startDate)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">Loại phòng</span>
              <span className="text-gray-800 font-semibold">{currentRoom.roomType}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-600">Giá</span>
              <span className="text-gray-800 font-semibold">
            {currentRoom.price.toLocaleString()} VND
              </span>
            </div>
          </div>
            ) : (
          <p className="text-gray-500 italic">Không có phòng hiện tại.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch sử Phòng</h3>
            {roomHistory && roomHistory.length > 0 ? (
          <div className="space-y-4">
            {roomHistory.map((rental) => (
              <div
            key={rental.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
              >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">{rental.roomName}</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Hết hạn
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
              </p>
              <p className="text-sm text-gray-600">Loại phòng: {rental.roomType}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <p className="text-sm font-medium text-gray-600">Giá</p>
              <p className="text-gray-800 font-semibold">
                {rental.price.toLocaleString()} VND
              </p>
            </div>
              </div>
            ))}
          </div>
            ) : (
          <p className="text-gray-500 italic">Không có lịch sử phòng.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="violation" className="mt-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh sách Vi phạm</h3>
            {violations && violations.length > 0 ? (
          <div className="space-y-3">
            {violations.map((violation) => (
              <div
            key={violation.id}
            className="flex justify-between items-center p-3 bg-red-50 rounded-md border-l-4 border-red-500 hover:bg-red-100 transition-colors"
              >
            <span className="font-medium text-gray-800">
              {violation.violationType}
            </span>
            <span className="text-sm text-gray-600">{formatDate(violation.reportDate)}</span>
              </div>
            ))}
          </div>
            ) : (
          <p className="text-gray-500 italic">Không có vi phạm nào được ghi nhận.</p>
            )}
          </div>
        </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
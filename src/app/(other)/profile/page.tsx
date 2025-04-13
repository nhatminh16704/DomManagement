/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile } from "@/services/userService";
import { Staff } from "@/services/staffService";
import { StudentProfile } from "@/services/studentService";
import AuthService from "@/services/authService";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";

// Cập nhật kiểu RoomRental với status, roomType, price
type RoomRental = {
  id: number;
  roomName: string;
  startDate: string;
  endDate: string | null;
  status: "ACTIVE" | "EXPIRED";
  roomType: string;
  price: number;
};

// Union type cho profile
type Profile = Staff | StudentProfile;

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile và role khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
        const userRole = AuthService.getRole();
        setRole(userRole);
      } catch (error) {
        toast.error("Không thể tải thông tin profile!");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Đang tải...</div>;
  }

  if (!profile) {
    return <div className="text-center p-4">Không có dữ liệu profile!</div>;
  }

  const isStudent = role === "STUDENT";
  const displayName = isStudent
    ? (profile as StudentProfile).fullName
    : `${(profile as Staff).lastName} ${(profile as Staff).firstName}`;

  // Lọc dữ liệu cho Dormitory Information (chỉ cho STUDENT)
  const studentProfile = isStudent ? (profile as StudentProfile) : null;
  const currentRoom = studentProfile?.roomRentals.find((rental) => rental.status === "ACTIVE");
  const roomHistory = studentProfile?.roomRentals.filter((rental) => rental.status === "EXPIRED");
  const violations = studentProfile?.violations;

  return (
    <div className="bg-gray-100 p-4 flex flex-col items-center">
      <Card className="w-full max-w-7xl shadow-lg rounded-lg overflow-hidden mb-6">
        {/* Header với ảnh đại diện và tên */}
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 h-40">
          <div className="absolute -bottom-16 left-8">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src="https://via.placeholder.com/150" alt="Profile" />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Nội dung chính */}
        <CardHeader className="pt-20 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                {displayName}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {isStudent
                  ? `Mã SV: ${(profile as StudentProfile).studentCode}`
                  : `Chức vụ: ${(profile as Staff).position}`}
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-green-500 text-white text-base px-4 py-1 font-semibold"
            >
              Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Thông tin cá nhân */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Ngày sinh</p>
                <p className="text-gray-600">{formatDate(profile.birthday)}</p>
              </div>
            </div>

            {isStudent ? (
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Lớp</p>
                  <p className="text-gray-600">{(profile as StudentProfile).className}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Ngày bắt đầu</p>
                  <p className="text-gray-600">{formatDate((profile as Staff).startDate)}</p>
                </div>
              </div>
            )}

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
                <p className="text-sm font-medium text-gray-700">
                  {isStudent ? "Quê quán" : "Địa chỉ"}
                </p>
                <p className="text-gray-600">
                  {isStudent
                    ? (profile as StudentProfile).hometown
                    : (profile as Staff).address}
                </p>
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

      {/* Chỉ hiển thị Dormitory Information nếu là STUDENT */}
      {isStudent && (
        <Card className="w-full max-w-7xl shadow-lg rounded-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Thông Tin Ký Túc Xá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 rounded-lg p-1">
          <TabsTrigger
            value="current"
            className="py-2 text-gray-700 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Phòng Hiện Tại
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="py-2 text-gray-700 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Lịch Sử Phòng
          </TabsTrigger>
          <TabsTrigger
            value="violation"
            className="py-2 text-gray-700 font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Vi Phạm
          </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="mt-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông Tin Phòng Hiện Tại
            </h3>
            {currentRoom ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">Số Phòng</span>
            <span className="text-gray-800 font-semibold">{currentRoom.roomName}</span>
                </div>
                <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">Ngày Nhận Phòng</span>
            <span className="text-gray-800 font-semibold">{formatDate(currentRoom.startDate)}</span>
                </div>
                <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600">Loại Phòng</span>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch Sử Phòng</h3>
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
                <p className="text-sm text-gray-600">Loại Phòng: {rental.roomType}</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Danh Sách Vi Phạm
            </h3>
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
      )}
    </div>
  );
}
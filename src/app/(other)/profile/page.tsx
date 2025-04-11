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
                <p className="text-gray-600">{profile.birthday}</p>
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
                  <p className="text-gray-600">{(profile as Staff).startDate}</p>
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
            <CardTitle>Dormitory Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="current">Current Room</TabsTrigger>
                <TabsTrigger value="history">Room History</TabsTrigger>
                <TabsTrigger value="violation">Violations</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="bg-white p-4 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">Current Room Information</h3>
                {currentRoom ? (
                  <div className="grid gap-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Room Number:</span>
                      <span>{currentRoom.roomName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Check-in Date:</span>
                      <span>{currentRoom.startDate}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Room Type:</span>
                      <span>{currentRoom.roomType}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Price:</span>
                      <span>{currentRoom.price.toLocaleString()} VND</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Không có phòng hiện tại.</p>
                )}
              </TabsContent>

              <TabsContent value="history" className="bg-white p-4 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">Room History</h3>
                {roomHistory && roomHistory.length > 0 ? (
                  <div className="space-y-4">
                    {roomHistory.map((rental) => (
                      <div key={rental.id} className="border rounded-md p-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{rental.roomName}</span>
                          <Badge variant="outline" className="bg-yellow-500 text-white">
                            Expired
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            {rental.startDate} - {rental.endDate}
                          </p>
                          <p>Room Type: {rental.roomType}</p>
                          <p>Price: {rental.price.toLocaleString()} VND</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Không có lịch sử phòng.</p>
                )}
              </TabsContent>

              <TabsContent value="violation" className="bg-white p-4 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">Violation Records</h3>
                {violations && violations.length > 0 ? (
                  <div className="space-y-4">
                    {violations.map((violation) => (
                      <div
                        key={violation.id}
                        className="border-l-4 border-red-500 pl-3 py-2"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">{violation.violationType}</span>
                          <span className="text-sm text-gray-500">{violation.reportDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Không có vi phạm nào được ghi nhận.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
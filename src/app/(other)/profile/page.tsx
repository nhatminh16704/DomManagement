"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react"; // Biểu tượng từ lucide-react
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dữ liệu mock
const mockProfile = {
  student_code: "N19CTK1001",
  full_name: "Trần Văn An",
  birthday: "1999-03-15",
  gender: "Nam",
  phone_number: "0912345111",
  email: "tranvanan@example.com",
  hometown: "Hà Nội",
  class_name: "CNTT-K19",
  account_id: "AC123456",
};

// Định nghĩa kiểu dữ liệu
interface StudentProfile {
  student_code: string;
  full_name: string;
  birthday: string;
  gender: string;
  phone_number: string;
  email: string;
  hometown: string;
  class_name: string;
  account_id: string;
}

export default function ProfilePage() {
  const profile: StudentProfile = mockProfile;

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
              <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Nội dung chính */}
        <CardHeader className="pt-20 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-gray-800">
                {profile.full_name}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Mã SV: {profile.student_code}
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
            {/* Ngày sinh */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Ngày sinh</p>
                <p className="text-gray-600">{profile.birthday}</p>
              </div>
            </div>

            {/* Lớp */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Lớp</p>
                <p className="text-gray-600">{profile.class_name}</p>
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Số điện thoại
                </p>
                <p className="text-gray-600">{profile.phone_number}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-600">{profile.email}</p>
              </div>
            </div>

            {/* Quê quán */}
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Quê quán</p>
                <p className="text-gray-600">{profile.hometown}</p>
              </div>
            </div>

            {/* Account ID */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Gender</p>
                <p className="text-gray-600">{profile.gender}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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

            <TabsContent
              value="current"
              className="bg-white p-4 rounded-lg border"
            >
              <h3 className="text-xl font-bold mb-4">
                Current Room Information
              </h3>
              <div className="grid gap-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Room Number:</span>
                  <span>A-101</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Building:</span>
                  <span>Main Dormitory</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Check-in Date:</span>
                  <span>01/09/2023</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Room Type:</span>
                  <span>Double Room</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="history"
              className="bg-white p-4 rounded-lg border"
            >
              <h3 className="text-xl font-bold mb-4">Room History</h3>
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="border rounded-md p-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Room B-20{item}</span>
                      <Badge variant="outline" className="bg-warning text-white">
                        Expired
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>01/09/2022 - 31/05/2023</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="violation"
              className="bg-white p-4 rounded-lg border"
            >
              <h3 className="text-xl font-bold mb-4">Violation Records</h3>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].length > 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
                    <div
                      key={item}
                      className="border-l-4 border-red-500 pl-3 py-2"
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">Noise Complaint</span>
                        <span className="text-sm text-gray-500">
                          10/0{item}/2023
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Violation of quiet hours policy after 11 PM.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No violations recorded.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

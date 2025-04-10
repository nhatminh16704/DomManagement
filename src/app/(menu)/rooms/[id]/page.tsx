"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoomDetail, getRoomDetail } from "@/services/roomService";

export default function RoomDetailPage() {
  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const detail = await getRoomDetail(Number(id));
        setRoomDetail(detail);
      } catch (error) {
        console.error("Error fetching room detail:", error);
      }
    };

    if (id) {
      fetchRoomDetail();
    }
  }, [id]);

  if (!roomDetail) {
    return <div className="p-8">Không tìm thấy phòng</div>;
  }

  const { students, devices, room } = roomDetail;
  
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Chi tiết phòng {room.roomName}</h1>

      {/* Room Information Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Thông tin phòng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại khu nhà</p>
                <p className="font-medium">{room.blockType}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <HomeIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại phòng</p>
                <p className="font-medium">{room.typeRoom}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-3">
                <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Giá</p>
                <p className="font-medium">{room.price}₫/tháng</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-3">
                <UsersIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sức chứa</p>
                <p className="font-medium">{room.maxStudents} sinh viên</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-3">
                <ChartPieIcon className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chỗ còn trống</p>
                <p className="font-medium">
                  {room.available} / {room.maxStudents}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Students and Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết phòng</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="students">Sinh viên</TabsTrigger>
              <TabsTrigger value="devices">Thiết bị</TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <h2 className="text-xl font-semibold mb-4">
                Sinh viên trong phòng này
              </h2>
              {students && students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã SV
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Điện thoại
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.studentCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {student.phoneNumber}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">
                  Không có sinh viên nào trong phòng này.
                </p>
              )}
            </TabsContent>

            <TabsContent value="devices">
              <h2 className="text-xl font-semibold mb-4">
                Thiết bị trong phòng này
              </h2>
              {devices && devices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên thiết bị
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số lượng
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {devices.map((device, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {device.deviceName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {device.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Không có thiết bị trong phòng này.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

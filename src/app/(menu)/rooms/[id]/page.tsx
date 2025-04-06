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
import authService from "@/services/authService";
import { payment, registrationRoom } from "@/services/roomrentalService";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export type roomRentalRequest ={
  roomId: number;
  price: number;
  accountId: number;
}
export type PaymentRequest ={
  amount: number;
  bankCode: String;
  idRef: number;
}

export default function RoomDetailPage() {
  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);
  const role = authService.getRole();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const userId = authService.getUserId();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const params = new URLSearchParams(location.search);
  const status = params.get("status");

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
    if (status != null) {
      const newStatus = status === "success" ? true : false;
      setPaymentStatus(newStatus);
      setErrorMessage(newStatus? "Thanh toán thành công":"Thanh toán thất bại");
    }
  }, [id, status]);
  useEffect(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
        setPaymentStatus(null);
      }, 2000);
  },[paymentStatus]);

  if (!roomDetail) {
    return <div className="p-8">Không tìm thấy phòng</div>;
  }

  const { students, devices, room } = roomDetail;

  
 
  const handleregistrationRoom= async ()=>{
    if (userId !== null) {
      const request: roomRentalRequest = {
        roomId: room.id,
        price: room.price,
        accountId: userId
      };
      console.log(request);
  
      try {
        const registId = await registrationRoom(request);
        if(registId!=null){
          if(!isNaN(Number(registId))){
            const paymentRequest: PaymentRequest={
            amount: room.price*6,
            bankCode: "NCB",
            idRef: Number(registId),
            }
            const path = await payment(paymentRequest);
            if (path) {
              window.location.href = path;
            }
            console.log("Đăng ký thành công, ID:", registId);
            setErrorMessage(null);
          }else{
            if(registId==="Ngoài thời gian đăng ký" || registId=== "You can't rent more rooms"){
              setIsVisible(true);
              setPaymentStatus(false);
              setErrorMessage(registId);
            }
          } 
        }
      } catch (error) {
        console.error("Lỗi khi đăng ký phòng:", error);
      }
    }

  }
  

  return (
    <div className="p-6">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="text-xl font-bold">Chi tiết phòng {room.roomName}</div>
          
          <div>
            <button className={room.available>0 && role === "STUDENT"?"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600":"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hidden" } 
           onClick={handleregistrationRoom}
           >
              Đăng ký
            </button>
          </div>
        </div>
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

      {isVisible && paymentStatus != null && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            {paymentStatus == true ? (
              <div className="flex justify-center items-center text-green-500">
                <CheckCircleIcon className="h-8 w-8 mr-2" />
                <span>{errorMessage}</span>
              </div>
            ) : (
              <div className="flex justify-center items-center text-red-500">
                <XCircleIcon className="h-8 w-8 mr-2" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
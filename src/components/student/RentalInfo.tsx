"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RoomRental, getRoomRentalsByStudentId } from "@/services/roomrentalService";

const RentalInfo = ({ studentId }: { studentId: number | undefined }) => {
  const [roomRentals, setRoomRentals] = useState<RoomRental[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!studentId) {
        console.log("studentId không hợp lệ:", studentId);
        return;
      }
    
      try {
        const rentals = await getRoomRentalsByStudentId(studentId);
        setRoomRentals(rentals);
      } catch (error) {
        console.error("Lỗi fetch:", error);
      }
    }
    

    fetchData();
  }, [studentId]);

  // Find the active rental (if any)
  const activeRental = roomRentals.find(rental => rental.status === 'ACTIVE');
  // Filter expired rentals
  const expiredRentals = roomRentals.filter(rental => rental.status === 'EXPIRED');



  return (
    <Card className="w-full max-w-7xl shadow-lg rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle>Thông Tin Ký Túc Xá</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="current">Phòng Hiện Tại</TabsTrigger>
            <TabsTrigger value="history">Lịch Sử Ở</TabsTrigger>
            <TabsTrigger value="violation">Vi Phạm</TabsTrigger>
          </TabsList>

          {/* Phòng hiện tại */}
          <TabsContent value="current" className="p-4 border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Thông Tin Phòng Hiện Tại</h3>
            {activeRental ? (
              <div className="grid gap-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Số Phòng:</span>
                  <span>{activeRental.roomName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Ngày Nhận Phòng:</span>
                  <span>{activeRental.startDate.toString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Ngày Kết Thúc:</span>
                  <span>{activeRental.endDate.toString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Loại Phòng:</span>
                  <span>{activeRental.roomType}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Sinh viên chưa đăng ký phòng.</p>
            )}
          </TabsContent>

          {/* Lịch sử ở */}
          <TabsContent value="history" className="p-4 border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Lịch Sử Ở</h3>
            {expiredRentals.length > 0 ? (
              <div className="space-y-4">
                {expiredRentals.map((rental, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Phòng {rental.roomName}</span>
                      <Badge variant="outline" className="bg-warning text-white">Hết Hạn</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>Từ: {rental.startDate.toString()}</span>
                      <span className="ml-2">Đến: {rental.endDate.toString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Không có lịch sử thuê phòng.</p>
            )}
          </TabsContent>

          {/* Vi phạm */}
          <TabsContent value="violation" className="p-4 border rounded-lg">
            <h3 className="text-xl font-bold mb-4">Danh Sách Vi Phạm</h3>
            {/* Using fake data for now */}
            {(() => {
              // Sample fake data
              const fakeViolations = [
              { type: "Tiếng ồn", date: "15/03/2023", details: "Gây ồn sau 22:00" },
              { type: "Điện nước", date: "05/04/2023", details: "Sử dụng thiết bị điện cao công suất" },
              { type: "Nội quy", date: "22/05/2023", details: "Để người ngoài ở qua đêm không đăng ký" }
              ];
              
              return fakeViolations.length > 0 ? (
              <div className="space-y-4">
                {fakeViolations.map((violation, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-3 py-2">
                  <div className="flex justify-between">
                  <span className="font-semibold">{violation.type}</span>
                  <span className="text-sm text-gray-500">{violation.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{violation.details}</p>
                </div>
                ))}
              </div>
              ) : (
              <p className="text-gray-500">Không có vi phạm nào.</p>
              );
            })()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RentalInfo;

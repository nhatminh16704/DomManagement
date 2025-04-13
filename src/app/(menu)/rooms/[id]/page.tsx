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
import { Button } from "@/components/ui/button";
import { Trash2, PenSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoomDetail, getRoomDetail } from "@/services/roomService";
import authService from "@/services/authService";
import { payment, registrationRoom } from "@/services/roomrentalService";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  getStudentByAccountIdFromStudent,
  Student,
} from "@/services/studentService";
import { toast } from "react-toastify";
import { Device } from "@/services/roomService";
import { DeviceRoom, updateDeviceQuantity, deleteDeviceRoom, getDevices, addDeviceToRoom } from "@/services/deviceRoomService";

export type roomRentalRequest = {
  roomId: number;
  price: number;
  accountId: number;
};
export type PaymentRequest = {
  amount: number;
  bankCode: string;
  idRef: number;
};


export default function RoomDetailPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const handleUpdateDevice = async () => {
    if (!editDevice) return;

    try {
      const deviceRoomUpdate: DeviceRoom = {
        roomId: Number(id),
        deviceId: editDevice.id,
        newQuantity: newQuantity
      };
      
      await updateDeviceQuantity(deviceRoomUpdate);
      
      // Update the local state to reflect the change
      if (roomDetail) {
        const updatedDevices = roomDetail.devices.map(device => 
          device.id === editDevice.id ? {...device, quantity: newQuantity} : device
        );
        setRoomDetail({...roomDetail, devices: updatedDevices});
      }
      
      toast.success("Cập nhật số lượng thiết bị thành công");
    } catch (error) {
      console.error("Error updating device quantity:", error);
      toast.error("Cập nhật số lượng thiết bị thất bại");
    } finally {
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteDevice = async () => {
    if (!deviceToDelete) return;

    try {
      const deviceToDeleteData: DeviceRoom = {
        roomId: Number(id),
        deviceId: deviceToDelete.id,
        newQuantity: 0 // Not needed for deletion but included for consistency
      };
      
      await deleteDeviceRoom(deviceToDeleteData);
      
      // Update the local state to remove the deleted device
      if (roomDetail) {
        const updatedDevices = roomDetail.devices.filter(
          device => device.id !== deviceToDelete.id
        );
        setRoomDetail({...roomDetail, devices: updatedDevices}); //Override the devices array in roomDetail
      }
      
      toast.success("Thiết bị đã được xóa thành công");
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Xóa thiết bị thất bại");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const { id } = useParams();
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [student, setstudent] = useState<Student | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);
  const [regist, setRegist] = useState<boolean>(false);

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
      setErrorMessage(
        newStatus ? "Thanh toán thành công" : "Thanh toán thất bại"
      );
    }
  }, [id, status]);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
      setPaymentStatus(null);
    }, 2000);
  }, [paymentStatus]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentDetail = await getStudentByAccountIdFromStudent();
        setstudent(studentDetail);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    if (role === "STUDENT") {
      fetchStudent();
    }
  }, [userId, role]);

  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState<boolean>(false);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [addQuantity, setAddQuantity] = useState<number>(1);

  // Fetch available devices
  useEffect(() => {
    const fetchAvailableDevices = async () => {
      try {
        // Use the imported getDevices function
        const allDevices = await getDevices();
        
        // Filter out devices already in the room
        const filteredDevices = allDevices.filter((device: Device) => 
          !roomDetail?.devices.some(existingDevice => existingDevice.id === device.id)
        );
        setAvailableDevices(filteredDevices);
      } catch (error) {
        console.error("Error fetching available devices:", error);
        toast.error("Không thể tải danh sách thiết bị");
      }
    };

    if (isAddDeviceDialogOpen) {
      fetchAvailableDevices();
    }
  }, [isAddDeviceDialogOpen, roomDetail]);

  const handleAddDevice = async () => {
    if (!selectedDeviceId) {
      toast.error("Vui lòng chọn thiết bị");
      return;
    }

    try {
      const deviceRoomAdd: DeviceRoom = {
        roomId: Number(id),
        deviceId: selectedDeviceId,
        newQuantity: addQuantity
      };
      
      await addDeviceToRoom(deviceRoomAdd);
      
      // Find the added device from available devices
      const addedDevice = availableDevices.find(device => device.id === selectedDeviceId);
      
      if (addedDevice && roomDetail) {
        // Add the new device to the room's devices list
        const newDevice = { ...addedDevice, quantity: addQuantity };
        setRoomDetail({
          ...roomDetail, 
          devices: [...roomDetail.devices, newDevice]
        });
      }
      
      toast.success("Thêm thiết bị thành công");
      setSelectedDeviceId(null);
      setAddQuantity(1);
      setIsAddDeviceDialogOpen(false);
    } catch (error) {
      console.error("Error adding device:", error);
      toast.error("Thêm thiết bị thất bại");
    }
  };

  if (!roomDetail) {
    return <div className="p-8">Không tìm thấy phòng</div>;
  }

  const { students, devices, room } = roomDetail;

  const detailregistrationRoom = async () => {
    setRegist(true);
  };

  const handleregistrationRoom = async () => {
    if (userId !== null) {
      const request: roomRentalRequest = {
        roomId: room.id,
        price: room.price,
        accountId: userId,
      };
      console.log(request);

      try {
        const registId = await registrationRoom(request);
        if (registId != null) {
          if (!isNaN(Number(registId))) {
            const paymentRequest: PaymentRequest = {
              amount: room.price * 6,
              bankCode: "NCB",
              idRef: Number(registId),
            };
            const path = await payment(paymentRequest);
            if (path.startsWith("http")) {
              window.location.href = path;
              setErrorMessage(null);
            } else {
              setRegist(false);
              setIsVisible(true);
              setPaymentStatus(false);
              setErrorMessage(path);
            }
          } else {
            if (
              registId === "Ngoài thời gian đăng ký" ||
              registId === "You can't rent more rooms" ||
              registId === "Không thể đăng ký phòng khác giới"
            ) {
              setRegist(false);
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
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-xl font-bold">Chi tiết phòng {room.roomName}</div>

        <div>
          <button
            className={
              room.available > 0 &&
              role === "STUDENT" &&
              student?.gender === room.blockType
                ? "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                : "hidden"
            }
            onClick={detailregistrationRoom}
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Thiết bị trong phòng này
                </h2>
                {role === "ADMIN" && (
                    <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    onClick={() => setIsAddDeviceDialogOpen(true)}
                    >
                    <span className="mr-2">+</span>
                    Thêm thiết bị
                    </button>
                )}
              </div>
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
                        {role === "ADMIN" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao tác
                          </th>
                        )}
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
                          {role === "ADMIN" && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Button
                                  size="icon"
                                  className="h-10 w-10 bg-lightsuccess text-success hover:bg-success hover:text-white transition-colors"
                                  title="Chỉnh sửa"
                                  onClick={() => {
                                    setEditDevice(device);
                                    setNewQuantity(device.quantity);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <PenSquare className="h-6 w-6" />
                                </Button>
                                <Button
                                  size="icon"
                                  className="h-10 w-10 bg-lighterror text-error hover:bg-error hover:text-white transition-colors"
                                  title="Xóa thiết bị"
                                  onClick={() => {
                                    setDeviceToDelete(device);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-6 w-6" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">
                  Không có thiết bị trong phòng này.
                </p>
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

      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thiết bị</DialogTitle>
            <DialogDescription>
              Cập nhật số lượng thiết bị {editDevice?.deviceName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="quantity" className="text-right">
                Số lượng
              </label>
              <input
                id="quantity"
                type="number"
                className="col-span-3 p-2 border rounded-md"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleUpdateDevice}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Device Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa thiết bị</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thiết bị {deviceToDelete?.deviceName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteDevice}>
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Device Dialog */}
      <Dialog open={isAddDeviceDialogOpen} onOpenChange={setIsAddDeviceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm thiết bị mới</DialogTitle>
            <DialogDescription>
              Chọn thiết bị và số lượng bạn muốn thêm vào phòng
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="device" className="text-right">
                Thiết bị
              </label>
              <select
                id="device"
                className="col-span-3 p-2 border rounded-md"
                value={selectedDeviceId || ''}
                onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
              >
                <option value="">Chọn thiết bị</option>
                {availableDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.deviceName}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="addQuantity" className="text-right">
                Số lượng
              </label>
              <input
                id="addQuantity"
                type="number"
                className="col-span-3 p-2 border rounded-md"
                value={addQuantity}
                onChange={(e) => setAddQuantity(Number(e.target.value))}
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDeviceDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleAddDevice}>
              Thêm thiết bị
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      

      {
        <Dialog open={regist} onOpenChange={(open) => setRegist(open)}>
          <DialogContent className="sm:max-w-[600px]">
            <div className="text-center">
              <DialogHeader>
                <DialogTitle>Thông tin đăng ký</DialogTitle>
                <DialogDescription>
                  Đây là thông tin chi tiết của sinh viên
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
              <div className="flex items-center">
                <strong className="mr-2">Mã SV:</strong>
                <p>{student?.studentCode}</p>
              </div>
              <div className="flex items-center">
                <strong className="mr-2">Họ và tên:</strong>
                <p>{student?.fullName}</p>
              </div>
              <div className="flex items-center">
                <strong className="mr-2">Ngày sinh:</strong>
                <p>{student?.birthday}</p>
              </div>
              <div className="flex items-center">
                <strong className="mr-2">Giới tính:</strong>
                <p>{student?.gender}</p>
              </div>
              <div className="flex items-center">
                <strong className="mr-2">Mã phòng:</strong>
                <p>{room.roomName}</p>
              </div>
              <div className="flex items-center">
                <strong className="mr-2">Loại phòng:</strong>
                <p>{room.typeRoom}</p>
              </div>
              <div className="flex items-center">
                <strong className="mr-2">Giá:</strong>
                <p>{room.price * 6}</p>
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setRegist(false)}
                className="border-2 border-gray-500 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleregistrationRoom}
                className="border-2 border-blue-500 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Thanh toán
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
}

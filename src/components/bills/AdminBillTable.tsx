"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RoomBill,
  getBillsByMonthAndStatus,
  updateElectricityReading,
} from "@/services/billService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminBillTable() {
  const [bills, setBills] = useState<RoomBill[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [endReadings, setEndReadings] = useState<Record<number, number | string>>({});

  const filteredBills = bills.filter((bill) => 
    bill.roomName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const fetchBills = async () => {
    try {
      // Format selectedMonth as YYYY-MM-01 to include the first day of the month
      const formattedMonth = `${selectedMonth}-01`;
      const data = await getBillsByMonthAndStatus(
        formattedMonth,
        selectedStatus
      );
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hoá đơn</h1>
      <div className="flex mb-4 gap-2">
        <select
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
          }}
        >
          <option value="PENDING">Chưa cập nhật</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="UNPAID">Chưa thanh toán</option>
        </select>

        <input
          type="month"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          lang="vi-VN"
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            fetchBills();
          }}
        >
          Áp dụng
        </button>

        <input
          type="text"
          placeholder="Tìm theo tên phòng..."
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            setSearchTerm(searchTerm);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
            <TableCaption>Danh sách hóa đơn</TableCaption>
            <TableHeader>
            <TableRow>
              <TableHead>Phòng</TableHead>
              <TableHead>Tháng</TableHead>
              <TableHead>Số điện đầu</TableHead>
              <TableHead>Số điện cuối</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
            </TableHeader>
          <TableBody>
            {filteredBills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.roomName}</TableCell>
                <TableCell>
                  {bill.billMonth
                    ? new Date(bill.billMonth).toLocaleDateString(undefined, {
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>{bill.electricityStart}</TableCell>
                <TableCell>
                  {bill.electricityEnd || (
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border rounded text-xs"
                        placeholder="Enter value"
                        value={endReadings[bill.id] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                          setEndReadings((prev) => ({
                            ...prev,
                            [bill.id]: isNaN(value as number) ? "" : value
                          }));
                        }}

                      />
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                        onClick={async () => {
                          const value = Number(endReadings[bill.id]);
                          if (!isNaN(value) && value > bill.electricityStart) {
                            try {
                              await updateElectricityReading(
                                bill.roomId,
                                bill.billMonth,
                                value
                              );
                              toast.success(
                                "Electricity reading updated successfully"
                              );
                              fetchBills();
                            } catch (error) {
                              toast.error(
                                "Failed to update electricity reading"
                              );
                              console.error(error);
                            }
                          } else {
                            toast.error(
                              "Please enter a valid electricity reading"
                            );
                          }
                        }}
                      >
                        Lưu
                      </button>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                    {bill.totalAmount
                    ? bill.totalAmount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      })
                    : endReadings[bill.id] && Number(endReadings[bill.id]) > bill.electricityStart
                      ? ((Number(endReadings[bill.id]) - bill.electricityStart) * 3000).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                      : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      bill.status === "PAID"
                        ? "bg-green-500 hover:bg-green-600"
                        : bill.status === "PENDING"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }
                  >
                    {bill.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

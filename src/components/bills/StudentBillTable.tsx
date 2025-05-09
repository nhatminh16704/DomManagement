'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from 'next/navigation';

import React, { useEffect, useState } from 'react';
import { getStudentBills, payBill, RoomBill } from '@/services/billService';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { requestBill } from '@/services/billService'
export default function StudentBillTable() {
  const [bills, setBills] = useState<RoomBill[]>([]);


  const fetchBills = async () => {
    try {
      const data = await getStudentBills(); // lấy hóa đơn của chính sinh viên
      // Sort bills by billMonth in descending order (newest first)
      data.sort((a, b) => {
        const dateA = new Date(a.billMonth || 0);
        const dateB = new Date(b.billMonth || 0);
        return dateB.getTime() - dateA.getTime();
      });

      setBills(data);
    } catch (error) {
      console.error("Error fetching student bills:", error);
    }
  };




  const handlePay = async (bill: number) => {
    try {
      const item = bills.find((n) => n.id === bill);
      if (item != null) {
        const billRequest: requestBill = {
          amount: item.totalAmount,
          bankCode: "NCB",
          idRef: item?.id
        }
        const path = await payBill(billRequest);
        console.log(path);
        if (path.startsWith("http")) {
          window.location.href = path;
        }
        fetchBills(); // reload lại danh sách
      }

    } catch (error) {
      toast.error("Thanh toán thất bại!");
      console.error(error);
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus === "success") {
      toast.success("Thanh toán thành công!");
      router.replace("bills");
    } else if (paymentStatus === "fail") {
      toast.error("Thanh toán thất bại!");
      router.replace("bills"); 
    }
    fetchBills();
  }, []);

  return (

    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Hóa đơn phòng</h2>
      <Table>
        <TableCaption>List of all bills</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Bill Month</TableHead>
            <TableHead>Electricity Start</TableHead>
            <TableHead>Electricity End</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
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
              <TableCell>{bill.electricityEnd}</TableCell>
              <TableCell>
                {bill.totalAmount
                  ? bill.totalAmount.toLocaleString("vi-VN", {
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
              <TableCell>
                {(bill.status === "PENDING" || bill.status === "UNPAID") && (
                  <button
                    onClick={() => handlePay(bill.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Thanh toán
                  </button>
                )}
                {bill.status === "PAID" && <span className="text-gray-400 text-xs"></span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}






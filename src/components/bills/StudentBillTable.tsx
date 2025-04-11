//"use client";
//import { Badge } from "@/components/ui/badge";
//import {
//  Table,
//  TableBody,
//  TableCaption,
//  TableCell,
//  TableHead,
//  TableHeader,
//  TableRow,
//} from "@/components/ui/table";
//import {
//  RoomBill,
//  getStudentBills
//} from "@/services/billService";
//import { useEffect, useState } from "react";
//import { toast } from "react-toastify";

'use client';

import React, { useEffect, useState } from 'react';
import { getStudentBills, payBill, RoomBill } from '@/services/billService';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { requestBill, getBillsByMonthAndStatus } from '@/services/billService'
export default function StudentBillTable() {
  const [bills, setBills] = useState<RoomBill[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
  );
  const [endReadings, setEndReadings] = useState<Record<number, number | string>>({});


  const fetchBills = async () => {
    try {
      const data = await getStudentBills(); // lấy hóa đơn của chính sinh viên
      setBills(data);
    } catch (error) {
      console.error("Error fetching student bills:", error);
    }
  };


    const fetchBillsByStatusAndMonth = async () => {
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

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Bills</h1>
      <div className="flex mb-4 gap-2">
        <select
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
          }}
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
        </select>

        <input
          type="month"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            fetchBillsByStatusAndMonth();
          }}
        >
          Apply
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Hóa đơn của bạn</h2>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border">Tháng</th>
            <th className="px-4 py-2 border">Điện đầu</th>
            <th className="px-4 py-2 border">Điện cuối</th>
            <th className="px-4 py-2 border">Số tiền</th>
            <th className="px-4 py-2 border">Trạng thái</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">
                {new Date(bill.billMonth).toLocaleDateString("vi-VN", {
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-2 border">{bill.electricityStart}</td>
              <td className="px-4 py-2 border">{bill.electricityEnd ?? 'Chưa có'}</td>
              <td className="px-4 py-2 border">
                {bill.totalAmount
                  ? bill.totalAmount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                  : "N/A"}
              </td>
              <td className="px-4 py-2 border">
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
              </td>
              <td className="px-4 py-2 border">
                {(bill.status === "PENDING" || bill.status === "UNPAID") && (
                  <button
                    onClick={() => handlePay(bill.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Thanh toán
                  </button>
                )}
                {bill.status === "PAID" && <span className="text-gray-400 text-xs"></span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}





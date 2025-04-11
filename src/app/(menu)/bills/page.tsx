'use client';

import AdminBillTable from "@/components/bills/AdminBillTable";
import authService from "@/services/authService";
import StudentBillTable from "@/components/bills/StudentBillTable";

export default function BillsPage() {
  const userRole = authService.getRole();
  
  return (
    <div>
      {userRole === 'ADMIN' ? (
        <AdminBillTable />
      ) : (<StudentBillTable/>)}
    </div>
  );
}

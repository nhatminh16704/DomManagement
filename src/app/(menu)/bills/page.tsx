'use client';

import AdminBillTable from "@/components/bills/AdminBillTable";
import authService from "@/services/authService";

export default function BillsPage() {
  const userRole = authService.getRole();
  
  return (
    <div>
      {userRole === 'ADMIN' ? (
        <AdminBillTable />
      ) : (
        <div>
          <h2 className="text-xl mb-4">Student Bill Table</h2>
          <p>Your billing information appears here.</p>
          {/* Replace with your actual student bill component */}
        </div>
      )}
    </div>
  );
}

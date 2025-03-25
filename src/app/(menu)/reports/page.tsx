"use client";  
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Home: React.FC = () => {
  // Changed data name from tickets to reports
  const allReports = [
    { id: 1, report: 'Sed ut perspiciatis unde omnis iste ab illo inventore veritatis et quasi...', assignedTo: 'Liam', status: 'resolved', date: 'Fri, Dec 26' },
    { id: 2, report: 'Consequuntur magni dolores eos qui ratione ab illo inventore veritatis et quasi...', assignedTo: 'Steve', status: 'Pending', date: 'Sun, Jul 3' },
    { id: 3, report: 'Exercitationem ullam corporis ab illo inventore veritatis et quasi...', assignedTo: 'Jack', status: 'In Progress', date: 'Fri, Mar 17' },
    { id: 4, report: 'Sed ut perspiciatis unde omnis iste ab illo inventore veritatis et quasi...', assignedTo: 'Steve', status: 'resolved', date: 'Tue, Jan 14' },
    { id: 5, report: 'Exercitationem ullam corporis ab illo inventore veritatis et quasi...', assignedTo: 'Liam', status: 'resolved', date: 'Sat, Apr 16' },
    { id: 6, report: 'Consequuntur magni dolores eos qui ratione ab illo inventore veritatis et quasi...', assignedTo: 'Jack', status: 'Pending', date: 'Sat, Jan 21' },
  ];

  // Add state for filtering
  const [filteredStatus, setFilteredStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter reports based on status and search query
  const filteredReports = allReports.filter(report => {
    const matchesStatus = filteredStatus ? report.status.toLowerCase() === filteredStatus.toLowerCase() : true;
    const matchesSearch = report.report.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         report.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Statistics
  const stats = {
    totalReports: allReports.length,
    pendingReports: allReports.filter(report => report.status === "Pending").length,
    inProgressReports: allReports.filter(report => report.status === "In Progress").length,
    resolvedReports: allReports.filter(report => report.status === "resolved").length,
  };

  // Handler for card clicks
  const handleFilterByStatus = (status: string | null) => {
    setFilteredStatus(status === filteredStatus ? null : status);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary relative pb-3 after:content-[''] after:absolute after:w-24 after:h-1 after:bg-primary after:bottom-0 after:left-1/2 after:-translate-x-1/2">Reports Management</h1>

      {/* Clickable stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div 
          className={`rounded-lg p-6 bg-lightinfo shadow-sm min-h-[120px] flex items-center justify-center cursor-pointer ${filteredStatus === null ? 'ring-2 ring-info' : ''}`}
          onClick={() => handleFilterByStatus(null)}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-info mb-2">TOTAL</div>
            <p className="text-3xl font-bold text-info">{stats.totalReports}</p>
          </div>
        </div>
        
        <div 
          className={`rounded-lg p-6 bg-lighterror shadow-sm min-h-[120px] flex items-center justify-center cursor-pointer ${filteredStatus === 'pending' ? 'ring-2 ring-error' : ''}`}
          onClick={() => handleFilterByStatus('pending')}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-error mb-2">PENDING</div>
            <p className="text-3xl font-bold text-error">{stats.pendingReports}</p>
          </div>
        </div>
        
        <div 
          className={`rounded-lg p-6 bg-lightwarning shadow-sm min-h-[120px] flex items-center justify-center cursor-pointer ${filteredStatus === 'in progress' ? 'ring-2 ring-warning' : ''}`}
          onClick={() => handleFilterByStatus('in progress')}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-warning mb-2">INPROGRESS</div>
            <p className="text-3xl font-bold text-warning">{stats.inProgressReports}</p>
          </div>
        </div>
        
        <div 
          className={`rounded-lg p-6 bg-lightsuccess shadow-sm min-h-[120px] flex items-center justify-center cursor-pointer ${filteredStatus === 'resolved' ? 'ring-2 ring-success' : ''}`}
          onClick={() => handleFilterByStatus('resolved')}
        >
          <div className="text-center">
            <div className="text-sm font-bold text-success mb-2">RESOLVED</div>
            <p className="text-3xl font-bold text-success">{stats.resolvedReports}</p>
          </div>
        </div>
      </div>

      {/* Search box with filter indicator */}
      <div className="flex justify-between mb-4">
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {filteredStatus && (
          <div className="flex items-center">
            <span className="mr-2">Filtered by: {filteredStatus}</span>
            <button 
              className="text-sm text-gray-500 hover:text-red-500"
              onClick={() => setFilteredStatus(null)}
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Table with reports */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Report</TableHead>
              <TableHead>Sent From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell className="max-w-xs truncate">{report.report}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gray-300 mr-2"></span>
                    {report.assignedTo}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status.toLowerCase() === 'resolved'
                        ? 'bg-success/20 text-success border border-success/30'
                        : report.status.toLowerCase() === 'pending'
                        ? 'bg-error/20 text-error border border-error/30'
                        : 'bg-warning/20 text-warning border border-warning/30'
                    }`}
                  >
                    {report.status}
                  </span>
                </TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <button className="text-gray-500 hover:text-red-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
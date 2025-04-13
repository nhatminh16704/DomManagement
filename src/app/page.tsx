"use client";

import { useEffect, useState } from "react";
import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UsersIcon,
  MegaphoneIcon

} from "@heroicons/react/24/outline";
import Chart from "@/components/charts/Chart";
import DonutChart from "@/components/charts/DonutChart";
import { Dashboard, getDashboard } from "@/services/dashboardService";



export default function Home() {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Báo cáo",
      value: dashboardData?.reportCount || "0",
      icon: <DocumentTextIcon className="w-8 h-8 text-blue-500" />,
      bgColor: "bg-blue-100/80",
      textColor: "text-blue-500",
    },
    {
      title: "Doanh thu",
      value: dashboardData ? `${dashboardData.revenue.toLocaleString()} ₫` : "$0",
      icon: <CurrencyDollarIcon className="w-8 h-8 text-green-500" />,
      bgColor: "bg-green-100/80",
      textColor: "text-green-500",
    },
    {
      title: "Thông báo",
      value: dashboardData?.notificationCount?.toString() || "0",
      icon: <MegaphoneIcon className="w-8 h-8 text-red-500" />,
      bgColor: "bg-red-100/80",
      textColor: "text-red-500",
    },
    {
      title: "Phòng",
      value: dashboardData?.roomCount?.toString() || "0",
      icon: <BuildingOfficeIcon className="w-8 h-8 text-blue-400" />,
      bgColor: "bg-blue-200/80",
      textColor: "text-blue-400",
    },
    {
      title: "Sinh viên",
      value: dashboardData?.studentCount?.toLocaleString() || "0",
      icon: <UserGroupIcon className="w-8 h-8 text-orange-500" />,
      bgColor: "bg-orange-100/80",
      textColor: "text-orange-500",
    },
    {
      title: "Nhân viên",
      value: dashboardData?.staffCount?.toString() || "0",
      icon: <UsersIcon className="w-8 h-8 text-purple-500" />,
      bgColor: "bg-purple-100/80",
      textColor: "text-purple-500",
    },
  ];



  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${stat.bgColor} flex flex-col items-center justify-center text-center`}
          >
            <div className="mb-2">{stat.icon}</div>
            <h3 className={`${stat.textColor} text-sm font-medium`}>
              {stat.title}
            </h3>
            <p className={`text-2xl font-semibold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full h-90">
          <Chart />
        </div>
        <div className="w-full h-90">
            <div className="flex justify-between items-center mb-2 ">
            <DonutChart 
              total={dashboardData?.totalRoomCapacity}
              available={dashboardData?.availableRoomCount}
            />
            </div>
        </div>
      </div>
    </div>
  );
}

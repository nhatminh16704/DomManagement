// components/Stats.tsx
import {
  DocumentChartBarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import { JSX } from "react";

// Định nghĩa type cho stat item
interface Stat {
  title: string;
  value: string;
  icon: JSX.Element;
  bgColor: string;
  textColor: string;
}

// Dữ liệu tĩnh ban đầu
const staticStats: Stat[] = [
  {
    title: "Reports",
    value: "59",
    icon: <DocumentChartBarIcon className="w-8 h-8 text-blue-500" />,
    bgColor: "bg-blue-100/80",
    textColor: "text-blue-500",
  },
 
  {
    title: "Events",
    value: "696",
    icon: <CalendarIcon className="w-8 h-8 text-red-500" />,
    bgColor: "bg-red-100/80",
    textColor: "text-red-500",
  },
  {
    title: "Rooms",
    value: "356",
    icon: <BuildingOfficeIcon className="w-8 h-8 text-green-400" />,
    bgColor: "bg-blue-200/80",
    textColor: "text-green-400",
  },
  {
    title: "Students",
    value: "3,560",
    icon: <UserGroupIcon className="w-8 h-8 text-orange-500" />,
    bgColor: "bg-orange-100/80",
    textColor: "text-orange-500",
  },
  {
    title: "Staffs",
    value: "96",
    icon: <UsersIcon className="w-8 h-8 text-purple-500" />,
    bgColor: "bg-purple-100/80",
    textColor: "text-purple-500",
  },
];

// Định nghĩa type cho dữ liệu từ API
interface ApiStat {
  title: string;
  value: string;
}

// Hàm fetch dữ liệu từ API
async function fetchStats(): Promise<ApiStat[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`, {
    cache: "no-store",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  
  const data: ApiStat[] = await response.json();
  return data;
}

// Component Stats (Server Component)
const Stats = async () => {
  let stats: Stat[] = staticStats;

  try {
    const apiData = await fetchStats();
    stats = staticStats.map(stat => ({
      ...stat,
      value: apiData.find(d => d.title === stat.title)?.value || stat.value,
    }));
  } catch (error) {
    console.error("Error fetching stats:", error);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${stat.bgColor} flex flex-col items-center justify-center text-center`}
        >
          <div className="mb-2">{stat.icon}</div>
          <h3 className={`${stat.textColor} text-sm font-medium`}>{stat.title}</h3>
          <p className={`text-2xl font-semibold ${stat.textColor}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Stats;


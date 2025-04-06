import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Chart from "@/components/charts/Chart";
import DonutChart from "@/components/charts/DonutChart";

const stats = [
  {
    title: "Reports",
    value: "59",
    icon: <DocumentTextIcon className="w-8 h-8 text-blue-500" />,
    bgColor: "bg-blue-100/80",
    textColor: "text-blue-500",
  },
  {
    title: "Revenue",
    value: "$96k",
    icon: <CurrencyDollarIcon className="w-8 h-8 text-green-500" />,
    bgColor: "bg-green-100/80",
    textColor: "text-green-500",
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
    icon: <BuildingOfficeIcon className="w-8 h-8 text-blue-400" />,
    bgColor: "bg-blue-200/80",
    textColor: "text-blue-400",
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

export default function Home() {
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
            <DonutChart />
          </div>
        </div>
      </div>
    </div>
  );
}

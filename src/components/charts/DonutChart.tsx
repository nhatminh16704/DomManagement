"use client";

import React from "react";
import Chart from "react-apexcharts";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

interface Props {
  total: number | undefined;
  available: number | undefined;
}

const YearlyBreakupChart: React.FC<Props> = ({ total, available })  => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Đang ở", "Còn trống"],
    colors: ["#EF4444", "#10B981"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
  };


  const series = [Math.max(0, (total || 0) - (available || 0)), (available || 0)];



  return (
    <div className="w-full h-full bg-white p-6 rounded-x1 shadow-md">
      <div className="flex flex-row items-center pl-10">
        {/* Left side information */}
        <div className="flex-1">
            <h3 className="text-gray-600 text-md font-medium">Tổng sức chứa</h3>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          


          {/* Legend */}
          <div className="flex flex-col space-y-2 mt-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Đang ở
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              Còn trống
            </div>
          </div>
        </div>

        {/* Chart - bigger size */}
        <div className="flex-1">
          <Chart options={options} series={series} type="donut" width="200px" height="200px" />
        </div>
      </div>
    </div>
  );
};

export default YearlyBreakupChart;

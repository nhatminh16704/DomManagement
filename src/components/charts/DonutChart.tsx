"use client";

import React from "react";
import Chart from "react-apexcharts";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

const YearlyBreakupChart = () => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Occupied", "Available"], // Changed order
    colors: ["#EF4444", "#10B981"], // Changed order: Red-500 and Green-500
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

  const series = [60, 40]; // Changed order to match labels

  return (
    <div className="w-full h-full bg-white p-6 rounded-x1 shadow-md">
      <div className="flex flex-row items-center pl-10">
        {/* Left side information */}
        <div className="flex-1">
          <h3 className="text-gray-600 text-md font-medium">Total Room Capacity</h3>
          <p className="text-2xl font-bold text-gray-900">36,358</p>
          
          {/* Growth indicator */}
          <div className="flex items-center mt-2">
            <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
              <ArrowUpRightIcon className="w-4 h-4 text-green-500" />
              <span className="text-green-600 text-sm font-semibold ml-1">+9%</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">last month</span>
          </div>

          {/* Legend */}
          <div className="flex flex-col space-y-2 mt-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Occupied
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              Available
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

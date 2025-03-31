"use client";

import React, { useState } from "react";
import Chart from "react-apexcharts";

const RevenueChart: React.FC = () => {
  const [period, setPeriod] = useState<string>("first-half");

  const periodData = {
    "first-half": {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [1.5, 2.8, 2.1, 3.5, 1.2, 0.8]
    },
    "second-half": {
      categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [0.9, 1.8, 2.7, 3.2, 2.5, 3.9]
    }
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 6,
      },
    },
    xaxis: {
      categories: periodData[period as keyof typeof periodData].categories,
    },
    colors: ["#3b82f6", "#6366f1"],
    dataLabels: { enabled: false },
    grid: { show: true },
    yaxis: { 
      labels: { 
        show: true,
        formatter: (value) => `$${value}k` 
      },
    },
    tooltip: { enabled: true },
  };

  const series = [
    {
      name: "Earnings",
      data: periodData[period as keyof typeof periodData].data,
    },
  ];

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod(e.target.value);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Revenue Updates
          </h2>
          <p className="text-sm text-gray-500">Overview of profit</p>
        </div>
        <select 
          className="border border-blue-300 rounded-md px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={period}
          onChange={handlePeriodChange}
        >
          <option value="first-half">Jan - Jun 2024</option>
          <option value="second-half">Jul - Dec 2024</option>
        </select>
      </div>

      <div className="flex">
        <div className="flex-1">
          <Chart options={options} series={series} type="bar" height={250} />
        </div>
        <div className="flex flex-col justify-center ml-4 min-w-[180px]">
          <div className="flex items-center mb-4 p-3 bg-blue-50 rounded-xl">
            <div className="bg-blue-100 p-3 rounded-lg mr-3">
              <span className="block w-5 h-5 bg-blue-500 rounded-md"></span>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">$63,489.50</p>
              <p className="text-sm text-gray-500">Total Earnings</p>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl">
            <p className="text-sm text-gray-500">Earnings this month</p>
            <p className="text-xl font-semibold text-indigo-600">$48,820</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;

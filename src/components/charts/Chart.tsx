"use client";

import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { getMonthlyIncome } from "@/services/dashboardService";

const RevenueChart: React.FC = () => {
  const [period, setPeriod] = useState<string>("first-half");
  const [monthlyIncome, setMonthlyIncome] = useState<number[]>([]);

  useEffect(() => {
    const fetchMonthlyIncome = async () => {
      try {
        const data = await getMonthlyIncome();
        setMonthlyIncome(data);
      } catch (error) {
        console.error("Error fetching monthly income:", error);
      }
    };
    fetchMonthlyIncome();
  }, []);

  // Transform monthly income data (divide by 100 million and multiply by 4)
  const transformedData = monthlyIncome.map(income => Number(((income / 100000000) * 4).toFixed(3)));
  
  const periodData = {
    "first-half": {
      categories: ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6"],
      data: transformedData.slice(0, 6)
    },
    "second-half": {
      categories: ["Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"],
      data: transformedData.slice(6, 12)
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
        formatter: (value) => `${value * 25} tr`, 
      },
    },
    tooltip: { enabled: true },
  };

  const series = [
    {
      name: "Doanh thu",
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
            Cập Nhật Thu Phí
          </h2>
          <p className="text-sm text-gray-500">Tổng quan tiền thu phí theo tháng</p>
        </div>
        <select 
          className="border border-blue-300 rounded-md px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={period}
          onChange={handlePeriodChange}
        >
            <option value="first-half">Thg 1 - Thg 6 {new Date().getFullYear()}</option>
            <option value="second-half">Thg 7 - Thg 12 {new Date().getFullYear()}</option>
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
                <p className="text-2xl font-bold text-blue-700">
                {(monthlyIncome.reduce((sum, income) => sum + income, 0) / 1000000).toFixed(2)} tr
                </p>
              <p className="text-sm text-gray-500">Tổng Thu</p>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl">
            <p className="text-sm text-gray-500">Tổng thu tháng này</p>
            <p className="text-xl font-semibold text-indigo-600">
              {(monthlyIncome[new Date().getMonth()] / 1000000).toFixed(2)} tr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;

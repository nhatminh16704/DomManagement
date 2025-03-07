"use client";
import { useRouter } from "next/navigation";
import React,{ useState } from "react";

export default function AddAnnouncementPage() {

    return (
    <div className="flex-col flex bg-[#F7F8FA] ">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Tạo Thông Báo Mới
      </h2>
      <form className="space-y-4 items-center">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Nội dung
          </label>
          <textarea
            id="content"
            name="content"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="flex flex-row items-center mb-5 gap-2">
            <div>
                <label htmlFor="created_date" className="block text-sm font-medium text-gray-700">
                    Ngày tạo
                </label>
                <input
                    type="date"
                    id="created_date"
                    name="created_date"
                    className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    />
            </div>
          <div> 
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Loại thông báo
            </label>
            <input
                type="text"
                id="type"
                name="type"
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
            />
          </div>
         
        </div>



        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Gửi Thông Báo
        </button>
      </form>
    </div>
    )
}

"use client"

import authService from "@/services/authService";
import { findMessageByIdForAdmin, getmessagesbyId, message } from "@/services/messageService";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MessageDetail(){
    const router=useRouter();
    const {id} = useParams();
    const [message , setmessage] = useState<message|null>();
    const userId = Number(authService.getUserId());
    const role = authService.getRole();
    useEffect(()=>{
        const messageID= Number(id);
        if(isNaN(messageID)||isNaN(userId)) return;
        if(role==="ADMIN"){
            findMessageByIdForAdmin(messageID).then((data)=>{
                setmessage(data)
            })
        }else{
            getmessagesbyId(messageID,userId).then((data)=>{
                setmessage(data);
            })
        }
        
    })

    return(
        <div className="h-full flex flex-col bg-gray-100 p-4">
    <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-200 rounded-full" 
            onClick={() => router.back()}
            >
                <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H6l4-4m0 0l-4 4m4-4v12"
                ></path>
                </svg>
            </button>
        </div>
    </div>

    {/* Nội dung chính */}
    <div className="flex-grow overflow-y-auto h-[500px] border border-gray-300 rounded-md p-4 bg-white space-y-3">
    <h1 className="text-xl font-bold">{message?.title}</h1> {/* Tăng kích thước chữ */}
    <div className="flex justify-between">
        <span className="font-medium text-gray-900">
            {message?.sentBy}
        </span>
        <span className="text-gray-500 text-sm">
            {message?.date
                ? new Date(message?.date).toLocaleDateString("vi-VN")
                : "Không có ngày"}
        </span>
    </div>
    <p className="text-gray-600 text-sm">{message?.content}</p>
</div>

</div>

    


    )
}
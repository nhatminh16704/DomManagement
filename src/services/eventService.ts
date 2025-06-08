import { ApiResponse } from "@/types/api";

export interface event{
    id: number,
    namecreator: string,
    name: string,
    startDate: Date,
    endDate: Date,
}

export interface createEvent{
    creator: number;
    name: string;
    startDate: string;
    endDate:string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/registrations";
const token = localStorage.getItem("token");

export const getAll= async(): Promise<event[]> =>{
    try{
        if (!token) {
            throw new Error("Không tìm thấy token!");
        }

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Lỗi khi lấy dữ liệu thời gian đăng ký");
        }

        const data: ApiResponse<event[]> = await response.json();
        return data.data || [];
    }catch(error){
        console.error("Lỗi khi fetch dữ liệu thời gian đăng ký : ",error);
        return [];
    }
}

export const createrEvent= async(createrevent:createEvent): Promise<string>=>{
    if (!token) {
        throw new Error("Không tìm thấy token!");
    }
    const response = await fetch(API_URL,{
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(createrevent),
    })
    if (!response.ok) {
        throw new Error("Lỗi khi thêm thời gian đăng ký ");
    }
    
    const data: ApiResponse<string> = await response.json();
    return data.data || "";
}
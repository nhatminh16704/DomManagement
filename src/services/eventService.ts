import { date, number, string } from "zod";
import authService from "./authService";

export type event={
    id: number,
    namecreator: string,
    name: string,
    startDate: Date,
    endDate: Date,
    isActive: boolean
}

export type createEvent={
    creator: number;
    name: string;
    startDate: string;
    endDate:string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/registrations";
const accountId = authService.getUserId();
const role = authService.getRole();
const token = localStorage.getItem("token");

export const getAll= async(): Promise<event[]> =>{
    try{
        if (!token) {
            throw new Error("Không tìm thấy token!");
        }

        const response = await fetch(API_URL + "/getAll", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Lỗi khi lấy dữ liệu thời gian đăng ký");
        }

        const data = await response.json();
        return data;
    }catch(error){
        console.error("Lỗi khi fetch dữ liệu thời gian đăng ký : ",error);
        return [];
    }
}

export const createrEvent= async(createrevent:createEvent): Promise<string>=>{
    if (!token) {
        console.error("Không có token, cần đăng nhập!");
        throw new Error("Người dùng chưa đăng nhập.");
    }
    const response = await fetch(API_URL+ "/create",{
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
    return response.text();
}
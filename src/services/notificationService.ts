const API_URL = process.env.NEXT_PUBLIC_API_URL + "/notifications";
import { Notification, createNotification } from "@/types/notification";
import { ApiResponse } from "@/types/api";

const token = localStorage.getItem("token");

export const getnotification = async (): Promise<Notification[]> => {
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
            throw new Error("Lỗi khi lấy dữ liệu thông báo");
        }

        const data: ApiResponse<Notification[]> = await response.json();
        return data.data || [];
    }catch(error){
        console.error("Lỗi khi fetch dữ liệu thông báo : ",error);
        return [];
    }
}

export const getnotificationtype = async(type:string): Promise<Notification[]> =>{
    try{ 
        if (!token) {
            throw new Error("Không tìm thấy token!");
        }

        const response = await fetch(`${API_URL}/type/${type}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });
        
        const notificationdata: ApiResponse<Notification[]> = await response.json();
        return notificationdata.data || [];
    }catch(error){
        console.error(" lỗi khi fetch dữ liệu thông báo : ",error);
        return [];
    }
}

export const addnotification = async(notification: createNotification): Promise<string> =>{
    if (!token) {
        throw new Error("Người dùng chưa đăng nhập.");
    }
    
    const response = await fetch(API_URL,{
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(notification),
    })
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi khi thêm thông báo: ${response.status} - ${errorText}`);
    }
    
    const result: ApiResponse<string> = await response.json();
    return result.data || "";
}

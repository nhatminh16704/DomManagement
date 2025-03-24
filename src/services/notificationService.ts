import { error } from "console";
import { number } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/notifications";
export type notification = {
    id: number;
    account_id: number;
    title: string;
    content: string;
    created_date: Date;
    type: string;
}
const token = localStorage.getItem("token");
export const getnotification = async (): Promise<notification[]> => {
    try{
        if (!token) {
            throw new Error("Không tìm thấy token!");
        }

        const response = await fetch(API_URL + "/findAll", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Lỗi khi lấy dữ liệu thông báo");
        }

        const data = await response.json();
        return data;
    }catch(error){
        console.error("Lỗi khi fetch dữ liệu thông báo : ",error);
        return [];
    }
}

export const getnotificationtype = async(type:string): Promise<notification[]> =>{
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
        const notificationdata = await response.json();
        return notificationdata;
        }catch(error){
        console.error(" lỗi khi fetch dữ liệu thông báo : ",error);
        return [];
    }
}

export const gettype= async(): Promise<string[]> =>{
    try{
        if (!token) {
            throw new Error("Không tìm thấy token!");
        }

        const response = await fetch(API_URL + "/types", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        }); 
        const type = await response.json();
        return type;
    }catch(e){
        console.error("lỗi khi lấy loại thông báo: ", e);
        return [];
    }
}


export const getnotificationId = async(id: number): Promise<notification | null> =>{
        try{
            
            if (!token) {
                throw new Error("Không tìm thấy token!");
            }
    
            const response = await fetch(`${API_URL}/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json"
                }
            }); 
            if(!response.ok){
                throw new Error("lỗi lấy dữ liệu thông báo");
            }
            const notificationdata = await response.json();
            return notificationdata;

        }catch(error){
            console.error(" lỗi khi fetch dữ liệu thông báo : ",error);
            return null;
        }
    }
export const addnotification = async(notification: Omit<notification, "id">): Promise< notification > =>{
    const response = await fetch(API_URL+ "/create",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
    })
    if (!response.ok) {
        throw new Error("Lỗi khi thêm thông báo ");
    }
    return response.json();
}

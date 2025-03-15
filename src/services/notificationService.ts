import { error } from "console";
import { number } from "zod";

const API_URL = "http://localhost:3001/notification";
export type notification = {
    id: number;
    title: string;
    content: string;
    created_date: Date;
    account_id: number;
    type: string;
}
export const getnotification = async (): Promise<notification[]> => {
    try{
        const response = await fetch(API_URL);
        if(!response.ok){
            throw new Error("lỗi khi lấy dữ liệu thong báo ");
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
        const response = await fetch(`${API_URL}?type=${type}`);
    if(!response.ok){
        throw new Error("lỗi lấy dữ liệu thông báo");
    }
        const notificationdata = await response.json();
        return notificationdata;
        }catch(error){
        console.error(" lỗi khi fetch dữ liệu thông báo : ",error);
        return [];
    }
}
    export const getnotificationId = async(id: number): Promise<notification | null> =>{
        try{
            const response = await fetch(`${API_URL}/${id}`);
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
export const addnotification = async(notification: notification): Promise< notification > =>{
    const response = await fetch(API_URL,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
    })
    if (!response.ok) {
        throw new Error("Lỗi khi thêm thông báo ");
    }
    return response.json();
}

export const updatenotification = async(notification: notification): Promise<notification> =>{
    const response = await fetch(`${API_URL}/${notification.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      });
      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật thông báo");
      }
      return response.json();
}
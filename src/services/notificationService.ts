

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/notifications";
export type notification = {
    id: number;
    name_person_create: string;
    title: string;
    content: string;
    create_date: Date;
    type: string;
}

export type createNotification={
    createdBy: number;
    title: string;
    content: string;
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


export const addnotification = async(notification: createNotification): Promise< String > =>{
    if (!token) {
        throw new Error("Người dùng chưa đăng nhập.");
    }
    const response = await fetch(API_URL+ "/create",{
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(notification),
    })
    if (!response.ok) {
        throw new Error("Lỗi khi thêm thông báo ");
    }
    return response.text();
}

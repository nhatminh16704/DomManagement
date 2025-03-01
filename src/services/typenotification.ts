const API_URL = "http://localhost:3001/typenotification";
export type typenotification = {
    id: number;
    name: String
}

export const getTypeNotification = async(): Promise<typenotification[]> =>{
    try{
        const response = await fetch(API_URL);
        if(!response.ok){
            throw new Error(" lỗi khi lấy dữ liệu loại thông báo ");
        }
        const data = await response.json();
        return data;
    }catch(error){
        console.error(" lỗi khi fetch dữ liệu loại thông báo ",error);
        return [];
    }
}

export const getTypeNotificationId = async(id: number): Promise<typenotification|null>=>{
    try{
        const response = await fetch(`${API_URL}/${id}`);
        if(!response.ok){
            throw new Error(" lỗi khi lấy dữ liệu id loại thông báo ");
        }
        const typenotificationdata= await response.json();
        return typenotificationdata;
    }catch(error){
        console.error(" lỗi khi fetch dữ liệu id loại thông báo ",error);
        return null;
    }
} 

export const addnotification = async(typenotification: typenotification): Promise< typenotification > =>{
    const response = await fetch(API_URL,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(typenotification),
    })
    if (!response.ok) {
        throw new Error("Lỗi khi thêm thông báo ");
    }
    return response.json();
}

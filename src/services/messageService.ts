import { MessageRequest, UseSearchDTO } from "@/app/(menu)/messages/page";
import { promises } from "dns";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/messages";
export type message = {
    id: number;
    title: String;
    content: String;
    sentBy : String;
    date: Date;
    read: boolean;
}

const token = localStorage.getItem("token");
export const getmessages = async(id: number): Promise<message[]> =>{
    try{
        if(!token){
            throw new Error("Không tìm thấy token!");
        }
        const response = await fetch(`${API_URL}/${id}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });
        const messages = await  response.json();
        return messages;
    }catch(e){
        console.error("lỗi khi lấy tin nhắn của 1 người: ",e);
        return []
    }   
}

export const getmessagesBySender= async(id: number): Promise<message[]>=>{
    try{
        if(!token){
            throw new Error("Không tìm thấy token!");
        }
        const response = await fetch(`${API_URL}/sent/${id}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });
        const messages = await  response.json();
        return messages;
    }catch(e){
        console.error("lỗi khi lấy tin nhắn của 1 người: ",e);
        return []
    }   
}

export const getmessagesbyId = async(id: number,receiver: number): Promise<message| null> =>{
    try{
        if(!token){
            throw new Error("Không tìm thấy token!");
        }
        const response = await fetch(`${API_URL}/${id}/${receiver}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });
        const messages = await  response.json();
        return messages;
    }catch(e){
        console.error("lỗi khi lấy tin nhắn của 1 người: ",e);
        return null
    }  
}

export const createmessage = async(message: MessageRequest): Promise<string> =>{
    if(!token){
        throw new Error("Không tìm thấy token!");
    }
    const response = await fetch(API_URL+ "/create",{
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message),
    });
    if (!response.ok) {
        throw new Error("Lỗi khi thêm thông báo ");
    }
    return response.text();
}

export const searchUser = async(key: String): Promise<UseSearchDTO[]> =>{
    try{
        if(!token){
            throw new Error("Không tìm thấy token!");
        }
        const response = await fetch(`${API_URL}/users/search?keyword=${key}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });
        const messagesdto = await  response.json();
        return messagesdto;
    }catch(e){
        console.error("lỗi khi lấy tin nhắn của 1 người: ",e);
        return []
    }  
}

export const findMessageByIdForAdmin = async(id: number): Promise<message|null> =>{
    try{
        if(!token){
            throw new Error("Không tìm thấy token!");
        }
        const response = await fetch(`${API_URL}/findId/${id}`,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        });
        const messagesdto = await  response.json();
        return messagesdto;
    }catch(e){
        console.error("lỗi khi lấy tin nhắn của 1 người: ",e);
        return null
    }  
}


import { Message, MessageDetail, MessageRequest, UseSearchDTO, RoomSearchDTO } from "@/types/message";
import authService from "@/services/authService";
import { ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/messages";

export async function getMessages(): Promise<Message[]> {
  const role = authService.getRole();
  let path = "";
  if(role ==="ADMIN"){
    path = `${API_URL}/sent`;
  }else{
    path = `${API_URL}`;
  }
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(path, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching messages");
    }
    const apiResponse: ApiResponse<Message[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

export async function getMessageById(messageId: number): Promise<MessageDetail> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching message with id ${messageId}`);
    }
    const apiResponse: ApiResponse<MessageDetail> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
}

export async function markMessageAsRead(messageId: number): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    const accountId = authService.getUserId();
    const response = await fetch(`${API_URL}/${messageId}/mark-read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({accountId})
    });
    
    if (!response.ok) {
      throw new Error(`Error marking message ${messageId} as read`);
    }
  } catch (error) {
    console.error("Error updating message read status:", error);
    throw error;
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/unread`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching unread messages count");
    }
    const apiResponse: ApiResponse<number> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    throw error;
  }
}

export const searchUser = async(key: string): Promise<UseSearchDTO[]> =>{
  try{
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/users/search?keyword=${key}`,{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
      }
    });
    const apiResponse: ApiResponse<UseSearchDTO[]> = await response.json();
    return apiResponse.data;
  }catch(e){
    console.error("lỗi khi tim nguoi gui: ",e);
    return []
  }  
}

export const roomSearch = async(key: string): Promise<RoomSearchDTO[]>=>{
  try{
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/room/search?keyword=${key}`,{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
      }
    });
    const apiResponse: ApiResponse<RoomSearchDTO[]> = await response.json();
    return apiResponse.data;
  }catch(e){
    console.error("lỗi khi tìm phòng: ",e);
    return []
  }  
}

export const createmessage = async(message: MessageRequest): Promise<string> =>{
  const token = localStorage.getItem('token');
  const response = await fetch(API_URL,{
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`, 
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    throw new Error("Lỗi khi thêm tin nhắn ");
  }
  const apiResponse: ApiResponse<string> = await response.json();
  return apiResponse.data;
}

// services/roomService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/rooms";
import { Room, RoomDetail } from "@/types/room";
import { ApiResponse } from "@/types/api";

export const getRooms = async (): Promise<Room[]> => {
  try {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
      headers
    });

    if (!response.ok) {
      throw new Error("Lỗi khi lấy dữ liệu phòng");
    }
    const data: ApiResponse<Room[]> = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu phòng:", error);
    return [];
  }
};

export const getRoomDetail = async (roomId: number): Promise<RoomDetail | null> => {
  try {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${roomId}`, {
      headers
    });

    if (!response.ok) {
      throw new Error("Lỗi khi lấy chi tiết phòng");
    }
    
    const data: ApiResponse<RoomDetail> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Lỗi khi fetch chi tiết phòng:", error);
    return null;
  }
};

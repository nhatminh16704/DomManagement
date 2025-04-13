// services/roomService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/rooms";
import { Student } from "@/services/studentService";
export interface Room {
  id: number;
  roomName: string;        
  price: number;        
  blockType: string;     
  typeRoom: string;    
  maxStudents: number;
  available: number;
  // Add your new fields here
}

export interface Device {
  id: number;
  deviceName: string;
  quantity: number;
}
export interface RoomDetail extends Room {
  students: Student[];
  devices: Device[];
}


// Hàm lấy dữ liệu phòng từ API
export const getRooms = async (): Promise<Room[]> => {
  try {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL + "/findAll", {
      headers
    });

    if (!response.ok) {
      throw new Error("Lỗi khi lấy dữ liệu phòng");
    }
    const data = await response.json();

    return data;
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
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi fetch chi tiết phòng:", error);
    return null;
  }
};

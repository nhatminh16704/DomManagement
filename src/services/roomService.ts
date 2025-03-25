// services/roomService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/rooms";

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

// Hàm lấy dữ liệu phòng từ API
export const getRooms = async (): Promise<Room[]> => {
  try {
    // Fix for Next.js SSR - check if window exists before accessing localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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

// getRoomById function already has the fix for localStorage in SSR

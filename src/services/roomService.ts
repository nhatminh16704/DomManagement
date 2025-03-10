
// services/roomService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/rooms";

export interface Room {
  roomId: string;        
  price: number;        
  blockType: string;     
  typeRoom: string;    
  totalBeds: number;
  availableBeds: number;
}


// Hàm lấy dữ liệu phòng từ API
export const getRooms = async (): Promise<Room[]> => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
  

    const response = await fetch(API_URL + "/findAll", {
      headers : {
        'Authorization': `Bearer ${token}`
      }
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

// Hàm lấy phòng theo ID
export const getRoomById = async (roomId: string): Promise<Room | null> => {
  try {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
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
      throw new Error("Lỗi khi lấy dữ liệu phòng");
    }

    const roomData = await response.json();
    return roomData;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu phòng:", error);
    return null;
  }
};


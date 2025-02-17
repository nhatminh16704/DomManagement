// services/roomService.ts
const API_URL = "http://localhost:3001/rooms";
export interface Room {
  id: string;
  type: string;
  price: number;
  occupancy: number;
  available_beds: number;
}

// Hàm lấy dữ liệu phòng từ API
export const getRooms = async (): Promise<Room[]> => {
  try {
    // Gọi API để lấy danh sách phòng
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Lỗi khi lấy dữ liệu phòng");
    }

    // Chuyển đổi dữ liệu JSON từ API
    const data = await response.json();

    // Trả về danh sách phòng
    return data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu phòng:", error);
    return [];
  }
};

// Hàm lấy phòng theo ID
export const getRoomById = async (roomId: string): Promise<Room | null> => {
  try {
    const response = await fetch(`${API_URL}/${roomId}`);

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



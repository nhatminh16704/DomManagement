import { PaymentRequest, roomRentalRequest } from "@/app/(menu)/rooms/[id]/page";

export interface RoomRental{
  id: number;
  startDate: Date;
  endDate: Date;
  price: number;
  status: string;
  roomName: string;
  roomType: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/roomrental";

export async function getRoomRentalsByStudentId(studentId: number): Promise<RoomRental[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/student/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching room rentals for student ${studentId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching room rentals for student ${studentId}:`, error);
    throw error;
  }
}

export const registrationRoom = async(roomRental: roomRentalRequest): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(roomRental),
      
    });
    if (!response.ok) {
      console.log("Response status:", response.status);
      if (response.status === 400) {
        const errorMessage = await response.text(); 
        return errorMessage;
      }
      throw new Error(`Lỗi fetch đăng ký phòng: ${response.statusText}`);
      
    }
    return await response.json();
  } catch (error) {
    console.error(`Lỗi đăng ký phòng:`, error);
    throw error;
  }
}

export const payment= async(paymentrequest: PaymentRequest): Promise<string> =>{
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL +'/vnpay/create', {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(paymentrequest),
    });
    if (!response.ok) {
      const errorMessage = await response.text(); 
      return errorMessage;
      
    }
    return await response.text();
  } catch (error) {
    console.error(`Lỗi đăng ký phòng:`, error);
    throw error;
  }
}







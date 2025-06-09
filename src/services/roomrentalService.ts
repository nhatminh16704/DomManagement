import { roomRentalRequest, RoomRental } from "@/types/room";
import { ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/room-rental";

export async function getRoomRentalsByStudentId(studentId: number): Promise<RoomRental[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/student/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || await response.text();
      throw new Error(errorMessage);
    }

    const apiResponse: ApiResponse<RoomRental[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
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
      const errorData = await response.json();
      const errorMessage = errorData.message || await response.text();
      throw new Error(errorMessage);
    }

    const apiResponse: ApiResponse<string> = await response.json();
    return apiResponse.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}



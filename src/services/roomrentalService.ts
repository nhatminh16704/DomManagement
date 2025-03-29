
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







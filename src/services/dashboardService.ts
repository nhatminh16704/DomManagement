export interface Dashboard {
  reportCount: number;
  roomCount: number;
  studentCount: number;
  staffCount: number;
  revenue: number;
  totalRoomCapacity: number;
  availableRoomCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/dashboard";

export async function getDashboard(): Promise<Dashboard> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching dashboard data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    throw error;
  }
}
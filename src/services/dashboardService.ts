import { ApiResponse } from "@/types/api";

export interface Dashboard {
  reportCount: number;
  roomCount: number;
  studentCount: number;
  staffCount: number;
  revenue: number;
  notificationCount: number;
  totalRoomCapacity: number;
  availableRoomCount: number;
}



const API_URL = process.env.NEXT_PUBLIC_API_URL + "/dashboard";

export async function getDashboard(): Promise<ApiResponse<Dashboard>> {
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
    const apiResponse: ApiResponse<Dashboard> = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    throw error;
  }
}


export async function getMonthlyIncome(): Promise<number[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-bills/monthly-income`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching monthly income data");
    }
    const apiResponse: ApiResponse<number[]> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching monthly income:", error);
    throw error;
  }
}
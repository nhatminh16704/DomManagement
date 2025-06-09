import { RoomBill } from "@/types/room";
import { requestBill } from "@/types/payment";
import { ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/room-bills";

export const getAllBills = async (): Promise<RoomBill[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch bills: ${response.status} ${response.statusText}`
      );
    }

    const data: ApiResponse<RoomBill[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};

export const getBillsByMonthAndStatus = async (
  month: string,
  status: string
): Promise<RoomBill[]> => {
  try {
    const token = localStorage.getItem("token");
    const url = new URL(API_URL);
    url.searchParams.append("month", month);
    url.searchParams.append("status", status);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bills: ${response.status}`);
    }

    const data: ApiResponse<RoomBill[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching bills by month and status:", error);
    throw error;
  }
};

export const updateElectricityReading = async (
  roomId: number,
  billMonth: string,
  newEnd: number
): Promise<RoomBill> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/electricity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId,
        billMonth,
        newEnd,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update electricity reading: ${response.status}`
      );
    }

    const data: ApiResponse<RoomBill> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating electricity reading:", error);
    throw error;
  }
};

export const getStudentBills = async (): Promise<RoomBill[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/student`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch student bills: ${response.status} ${response.statusText}`
      );
    }

    const data: ApiResponse<RoomBill[]> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching student bills:", error);
    throw error;
  }
};

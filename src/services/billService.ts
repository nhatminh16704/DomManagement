export type RoomBill = {
  id: number;
  roomId: number;
  roomName: string;
  billMonth: string;
  electricityStart: number;
  electricityEnd: number;
  totalAmount: number;
  status: "PAID" | "UNPAID" | "PENDING";
};

// You might also want to define an enum for the status values
export enum BillStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PENDING = "PENDING_READING",
}

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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching student bills:", error);
    throw error;
  }
};
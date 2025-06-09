import { Staff } from "@/types/user";
import { ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/staffs";

export async function getStaffs(): Promise<Staff[]> {
  try {
    const token = localStorage.getItem('token');
    console.log(token);
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách nhan viên");
    }
    const apiResponse: ApiResponse<Staff[]> = await response.json();
    return apiResponse.data.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
}

export async function getStaffById(staffId: number): Promise<Staff> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${staffId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    const apiResponse: ApiResponse<Staff> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
}

export async function getStaffProfile(): Promise<Staff> {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Lỗi khi lấy thông tin hồ sơ nhân viên");
    }

    const apiResponse: ApiResponse<Staff> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    throw error;
  }
}

export async function createStaff(staff: Omit<Staff, 'id'>): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(staff)
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

export async function updateStaff(id: number, staff: Staff): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(staff)
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



export async function updateStaffProfile(data: { email: string; phoneNumber: string }) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Chưa đăng nhập!");

  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Lỗi khi cập nhật thông tin nhân viên");
  }

  const apiResponse: ApiResponse<void> = await response.json();
  return apiResponse.data;
}



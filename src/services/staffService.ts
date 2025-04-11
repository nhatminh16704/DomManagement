export type Staff = {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  address: string;
  email: string;
  phoneNumber: string;
  startDate: string;
  position: string;
};


const API_URL = process.env.NEXT_PUBLIC_API_URL + "/staffs";


export async function getStaffs(): Promise<Staff[]> {
  try {
    const token = localStorage.getItem('token');
    console.log(token);
    const response = await fetch(API_URL + "/findAll", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách nhan viên");
    }
    return await response.json();
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
    return await response.json();
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    throw error;
  }
}


export async function createStaff(staff: Omit<Staff, 'id'>): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL + "/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(staff)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.text();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

export async function updateStaff(id: number, staff: Staff): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(staff)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.text();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

export async function deleteStaff(id: number): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    return await response.text();
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
}

export async function changeStaffPassword(data: { currentPassword: string; newPassword: string }) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Chưa đăng nhập!");

  const response = await fetch(`${API_URL}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Lỗi khi đổi mật khẩu nhân viên");
  }
}


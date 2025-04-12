const API_URL = process.env.NEXT_PUBLIC_API_URL + "/students";
const VIOLATIONS_API_URL = process.env.NEXT_PUBLIC_API_URL + "/violations";

export type Student = {
  id: number;
  studentCode: string;
  fullName: string;
  birthday: string;
  gender: string;
  className: string;
  phoneNumber: string;
  email: string;
  hometown: string;
};

export type RoomRental = {
  id: number;
  roomName: string;
  startDate: string;
  roomType: string;
  status: string;
  price: number;
  endDate: string;
};

export type Violation = {
  id: number;
  violationType: string;
  reportDate: string;
}

export type StudentProfile = {
  studentCode: string;
  fullName: string;
  birthday: string;
  gender: string;
  phoneNumber: string;
  email: string;
  hometown: string;
  className: string;
  roomRentals: RoomRental[];
  violations: Violation[];
};





// Lấy danh sách sinh viên
export async function getStudents(): Promise<Student[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL + "/findAll", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách sinh viên");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

export async function getStudentById(studentCode: number): Promise<StudentProfile> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${studentCode}`, {
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
    console.error("Error fetching student:", error);
    throw error;
  }
}
export async function getStudentByAccountIdFromStudent(): Promise<Student> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/info`, {
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
    console.error("Error fetching student:", error);
    throw error;
  }
}

export async function getStudentProfile(): Promise<StudentProfile> {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Lỗi khi lấy thông tin hồ sơ sinh viên");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL + "/create", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(student)
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


export async function updateStudent(id: number, student: Student): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(student)
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

export async function deleteStudent(id: number): Promise<string> {
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

export async function updateStudentProfile(data: { email: string; phoneNumber: string }) {
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
    throw new Error(errorMessage || "Lỗi khi cập nhật thông tin sinh viên");
  }
}

export async function changeStudentPassword(data: { currentPassword: string; newPassword: string }) {
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
    throw new Error(errorMessage || "Lỗi khi đổi mật khẩu sinh viên");
  }
}

export async function createViolation(data: { studentId: number; violationType: string; reportDate: string }) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("Chưa đăng nhập!");

  const response = await fetch(`${VIOLATIONS_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || "Lỗi khi tạo vi phạm");
  }

  return await response.json(); // Giả sử API trả về dữ liệu violation vừa tạo
}


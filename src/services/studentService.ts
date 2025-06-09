const API_URL = process.env.NEXT_PUBLIC_API_URL + "/students";
const VIOLATIONS_API_URL = process.env.NEXT_PUBLIC_API_URL + "/violations";
import { ApiResponse } from "@/types/api";
import { Student, StudentProfile } from "@/types/user";

// Lấy danh sách sinh viên
export async function getStudents(): Promise<Student[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách sinh viên");
    }
    const apiResponse: ApiResponse<Student[]> = await response.json();
    return apiResponse.data.sort((a, b) => b.id - a.id);
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
    const apiResponse: ApiResponse<StudentProfile> = await response.json();
    return apiResponse.data;
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
    const apiResponse: ApiResponse<Student> = await response.json();
    return apiResponse.data;
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

    const apiResponse: ApiResponse<StudentProfile> = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
}

export async function createStudent(student: Omit<Student, 'id'>): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(student)
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

export async function updateStudent(id: number, student: Student): Promise<string> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(student)
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


export async function updateStudentProfile(data: { email: string; phoneNumber: string }) {
  try {
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
      const errorData = await response.json();
      const errorMessage = errorData.message || await response.text();
      throw new Error(errorMessage);
    }

    const apiResponse: ApiResponse<void> = await response.json();
    return apiResponse.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}



export async function createViolation(data: { studentId: number; violationType: string; reportDate: string }) {
  try {
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


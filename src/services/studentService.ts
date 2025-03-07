export type Student = {
  id: number;
  studentCode: string;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  className: string;
  phoneNumber: string;
  email: string;
  hometown: string;
};


const API_URL = process.env.NEXT_PUBLIC_API_URL + "/students";


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

// Lấy sinh viên theo mã
export async function getStudentById(studentCode: number): Promise<Student> {
  try {
    const response = await fetch(`${API_URL}/${studentCode}`);
    if (!response.ok) {
      throw new Error("Không tìm thấy sinh viên");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
}

// Thêm sinh viên mới
export async function addStudent(student: Student): Promise<Student> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      throw new Error("Lỗi khi thêm sinh viên");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
}

// Cập nhật sinh viên
export async function updateStudent(student: Student): Promise<Student> {
  try {
    const response = await fetch(`${API_URL}/${student.studentCode}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      throw new Error("Lỗi khi cập nhật sinh viên");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
}

// Xóa sinh viên
export async function deleteStudent(studentCode: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/${studentCode}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Lỗi khi xóa sinh viên");
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}

export type Student = {
  id: number;
  student_code: string;
  first_name: string;
  name: string;
  birthday: string;
  gender: string;
  class: string;
  phone_number: string;
  email: string;
  hometown: string;
};

const API_URL = "http://localhost:3001/students";

// Lấy danh sách sinh viên
export async function getStudents(): Promise<Student[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Lỗi khi lấy danh sách sinh viên");
  }
  return response.json();
}

// Lấy sinh viên theo mã
export async function getStudentById(studentCode: number): Promise<Student> {
  const response = await fetch(`${API_URL}/${studentCode}`);
  if (!response.ok) {
    throw new Error("Không tìm thấy sinh viên");
  }
  return response.json();
}

// Thêm sinh viên mới
export async function addStudent(student: Student): Promise<Student> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  if (!response.ok) {
    throw new Error("Lỗi khi thêm sinh viên");
  }
  return response.json();
}

// Cập nhật sinh viên
export async function updateStudent(student: Student): Promise<Student> {
  const response = await fetch(`${API_URL}/${student.student_code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  if (!response.ok) {
    throw new Error("Lỗi khi cập nhật sinh viên");
  }
  return response.json();
}

// Xóa sinh viên
export async function deleteStudent(studentCode: number): Promise<void> {
  const response = await fetch(`${API_URL}/${studentCode}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Lỗi khi xóa sinh viên");
  }
}

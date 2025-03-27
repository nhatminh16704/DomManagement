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



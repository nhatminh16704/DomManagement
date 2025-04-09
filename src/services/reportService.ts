const API_URL = process.env.NEXT_PUBLIC_API_URL + "/reports";

export interface Report {
  id: number;
  createdBy: {
    id: number;
    userName: string;
    roleName: string;
  };
  title: string;
  content: string;
  sentDate: string;
  status: string;
}

export async function getReports(): Promise<Report[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const response = await fetch(`${API_URL}/findAll`, {
      headers: {
        "Authorization": `Bearer ${token || ""}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi lấy danh sách báo cáo: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

export async function updateReportStatus(id: number, status: string): Promise<string> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ status }), // Gửi nguyên Report không cần thiết, chỉ gửi status
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi cập nhật trạng thái: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}

export async function deleteReport(id: number): Promise<string> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const response = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token || ""}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi xóa báo cáo: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
}
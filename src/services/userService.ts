'use client'

import authService from "./authService";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { getStudentProfile, updateStudentProfile } from "./studentService";
import { getStaffProfile, updateStaffProfile } from "./staffService";
import { ApiResponse } from "@/types/api";

export async function getProfile() {
  try {
    const role = authService.getRole();

    if (role === "STUDENT") {
      return await getStudentProfile();
    } else {
      return await getStaffProfile();
    }
  } catch (error) {
    throw new Error(`Failed to get profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateProfile(data: { email: string; phoneNumber: string }) {
  try {
    const role = authService.getRole();

    if (role === "STUDENT") {
      await updateStudentProfile(data);
    } else {
      await updateStaffProfile(data);
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

export async function changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<string>> {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Chưa đăng nhập!");

    const response = await fetch(`${API_URL}/auth/password-change`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || await response.text();
      throw new Error(errorMessage);
    }

    const apiResponse: ApiResponse<string> = await response.json();
    return apiResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

'use client'

import authService from "./authService";
import { getStudentProfile, updateStudentProfile, changeStudentPassword } from "./studentService";
import { getStaffProfile, updateStaffProfile, changeStaffPassword } from "./staffService";

export async function getProfile() {
  const role = authService.getRole();

  if (role === "STUDENT") {
    return await getStudentProfile();
  } else {
    return await getStaffProfile();
  }
}

export async function updateProfile(data: { email: string; phoneNumber: string }) {
  const role = authService.getRole();

  if (role === "STUDENT") {
    await updateStudentProfile(data);
  } else {
    await updateStaffProfile(data);
  } 
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const role = authService.getRole();

  if (role === "STUDENT") {
    await changeStudentPassword(data);
  } else {
    await changeStaffPassword(data);
  } 
}
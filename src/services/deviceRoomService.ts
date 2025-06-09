import { DeviceRoom, Device } from "../types/room";
import { ApiResponse } from "../types/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/device-rooms";

export const updateDeviceQuantity = async (deviceRoom: DeviceRoom): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(deviceRoom),
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
};

export const deleteDeviceRoom = async (deviceRoom: DeviceRoom): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(deviceRoom),
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
};

export const getDevices = async (): Promise<Device[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/devices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || await response.text();
      throw new Error(errorMessage);
    }

    const apiResponse: ApiResponse<Device[]> = await response.json();
    return apiResponse.data || [];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const addDeviceToRoom = async (deviceRoom: DeviceRoom): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(deviceRoom),
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
};

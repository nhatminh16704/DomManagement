export interface DeviceRoom {
  roomId: number;
  deviceId: number;
  newQuantity: number;
}

import { Device } from "@/services/roomService";
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/device-rooms";

export const updateDeviceQuantity = async (deviceRoom: DeviceRoom): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/update-quantity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(deviceRoom),
    });

    if (!response.ok) {
      const errorMessage = await response.text(); 
      return errorMessage; 
    }
    
    return "Successfully updated device quantity";
  } catch (error) {
    console.error("Error updating device quantity:", error);
    return "Failed to update device quantity";
  }
};



export const deleteDeviceRoom = async (deviceRoom: DeviceRoom): Promise<string> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(deviceRoom),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return errorMessage;
    }
    
    return "Successfully deleted device from room";
  } catch (error) {
    console.error("Error deleting device from room:", error);
    return "Failed to delete device from room";
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
      console.error("Error fetching devices:", await response.text());
      return [];
    }
    
    const devices: Device[] = await response.json();
    return devices;
  } catch (error) {
    console.error("Error fetching devices:", error);
    return [];
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
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    
    return "Successfully added device to room";
  } catch (error) {
    console.error("Error adding device to room:", error);
    throw error;
  }
};


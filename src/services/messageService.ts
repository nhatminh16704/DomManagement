export type Message = {
  id: number;
  title: string;
  preview: string;
  sentBy: string;
  date: Date;
  read: boolean;
};
export type MessageDetail = {
  id: number;
  title: string;
  content: string;
  sentBy: string;
  date: Date;
};

import authService from "@/services/authService";
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/messages";


export async function getMessages(): Promise<Message[]> {
  try {
    const accountId = authService.getUserId();
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/account/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching messages");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

export async function getMessageById(messageId: number): Promise<MessageDetail> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching message with id ${messageId}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
}

export async function markMessageAsRead(messageId: number): Promise<void> {
  try {
    const accountId = authService.getUserId();
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/${messageId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accountId })
    });
    
    if (!response.ok) {
      throw new Error(`Error marking message ${messageId} as read`);
    }
  } catch (error) {
    console.error("Error updating message read status:", error);
    throw error;
  }
}

export async function getUnreadMessagesCount(): Promise<number> {
  try {
    const accountId = authService.getUserId();
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/unread/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Error fetching unread messages count");
    }
    const count = await response.text();
    return parseInt(count);
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    throw error;
  }
}










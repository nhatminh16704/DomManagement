
export interface Notification {
  id: number;
  createdBy: string;
  title: string;
  content: string;
  createdDate: string;
  type: string;
}

export interface createNotification{
  createdBy: number;
  title: string;
  content: string;
  type: string;
}
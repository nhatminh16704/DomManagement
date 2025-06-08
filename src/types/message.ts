export interface Message {
  id: number;
  title: string;
  preview: string;
  sentBy: string;
  date: Date;
  read: boolean;
}

export interface MessageDetail {
  id: number;
  title: string;
  content: string;
  sentBy: string;
  date: Date;
}

export interface UseSearchDTO {
  id: number;
  username: string;
}

export interface RoomSearchDTO {
  id: number;
  name: string;
  userid: number[];
}

export interface MessageRequest {
  title: string;
  content: string;
  sentBy: number;
  receivers: number[];
}

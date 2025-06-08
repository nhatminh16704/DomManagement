import { Student } from "./user";

export interface RoomRental{
  id: number;
  startDate: Date;
  endDate: Date;
  price: number;
  status: string;
  roomName: string;
  roomType: string;
}

export interface Room {
  id: number;
  roomName: string;              
  blockType: string;     
  typeRoom: string;    
  maxStudents: number;
  available: number;
}

export interface Device {
  deviceName: string;
  quantity: number;
}
export interface RoomDetail extends Room {
  students: Student[];
  devices: Device[];
}

export interface RoomBill {
  id: number;
  roomId: number;
  roomName: string;
  billMonth: string;
  electricityStart: number;
  electricityEnd: number;
  totalAmount: number;
  status: "PAID" | "UNPAID" | "PENDING";
};

export interface requestBill {
  amount : number,
  bankCode : string,
  idRef : number
}

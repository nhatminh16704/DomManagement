import { RoomRental } from "./room";
import { Violation } from "./violation";


export interface Student {
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

export interface StudentProfile {
  studentCode: string;
  fullName: string;
  birthday: string;
  gender: string;
  phoneNumber: string;
  email: string;
  hometown: string;
  className: string;
  roomRentals: RoomRental[];
  violations: Violation[];
};

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  address: string;
  email: string;
  phoneNumber: string;
  startDate: string;
  position: string;
};

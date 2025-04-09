"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  RoomBill,
  getStudentBills
} from "@/services/billService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";




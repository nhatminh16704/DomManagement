"use client";
import { createEvent, createrEvent, event, getAll } from '@/services/eventService';
import { tree } from 'next/dist/build/templates/app-page';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { number } from 'zod';
import authService from '@/services/authService';

export default function Events() {
  const [event, setEvent] = useState<event[]>([]);
  const [isvisible,setisvisible]= useState<boolean>(false);
  const [showForm,setShowForm] = useState<boolean>(false);
  const userId = authService.getUserId();
  const role = authService.getRole();
  if(userId === null){
    console.error("lỗi lấy id");
  }

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState("");

  //định dạng time 
  const formatDateToLocal = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    
  
    if (!formData?.startDate || !formData?.endDate || !formData?.name) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    const now = new Date();
    now.setHours(0, 0, 0, 0); 
  
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
  
    if (start <= now) {
      setError("Ngày bắt đầu phải lớn hơn ngày hiện tại");
      return;
    }
  
    if (end <= start) {
      setError("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      return;
    }
  
    setError("");
    const newEvent: createEvent = {
      creator: userId,
      name: formData.name,
      startDate:formatDateToLocal(new Date(formData.startDate)),
      endDate: formatDateToLocal(new Date(formData.endDate)),
    };
    createrEvent(newEvent).then(() => {
      
      setShowForm(false);
    }).catch((err) => {
      setError("Lỗi khi tạo sự kiện: " + err.message);
    });
  };

  useEffect(()=>{
    getAll().then((data) => {
          setEvent(data);
        }).catch((err) => {
          console.error("Lỗi khi lấy danh sách thông báo:", err);
        });
  })
  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4">
      <div className="flex justify-between items-center p-4 border-b">
          <div className="text-xl font-bold">Thời gian đăng ký phòng</div>
          
          <div>
            <button className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                  role !== "ADMIN" ? "hidden" : ""
                }`}
            onClick={()=>setShowForm(true)}
           >
              Đăng ký
            </button>
          </div>
        </div>
    <div className="bg-white rounded-lg shadow-md">
      {/* Thanh tiêu đề */}
      <div className="grid grid-cols-4 font-medium text-gray-600 px-4 py-2 border-b bg-gray-50">
        <div>Tên sự kiện</div>
        <div>Ngày bắt đầu</div>
        <div>Ngày kết thúc</div>
        <div>Trạng thái</div>
      </div>
  
      {/* Danh sách sự kiện */}
      {event.map((event, index) => {
        const goToMessageDetail = () => {
          setisvisible(true);
        };
  
        return (
          <div
            key={index}
            className="grid grid-cols-4 items-center px-4 py-4 border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            onClick={goToMessageDetail}
          >
            <div className="text-gray-900">{event.name}</div>
            <div className="text-gray-500 text-sm">
              {new Date(event.startDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-gray-500 text-sm">
              {new Date(event.endDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex items-center text-gray-500 font-normal">
            {event.isActive === "ACTIVE" && (
              <>
                Đang diễn ra
                <span className="ml-2 w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              </>
            )}
            {event.isActive === "ENDED" && (
              <>
                Đã kết thúc
                <span className="ml-2 w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              </>
            )}
            {event.isActive === "NOT_STARTED" && (
              <>
                Chưa bắt đầu
                <span className="ml-2 w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
              </>
            )}
            </div>
          </div>
        );
      })}
    </div>

    {showForm && (
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center text-black">
              Tạo Sự Kiện Mới
            </DialogTitle>
          </DialogHeader>

          <form className="flex flex-col gap-4 mt-2" onSubmit={handleCreateEvent}>
            <div>
              <label htmlFor="name" className="block text-black mb-1">Tên sự kiện</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-600"
                required
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-black mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-600"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-black mb-1">Ngày kết thúc</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-600"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Tạo sự kiện
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )}

    
  </div>
  
  )
}

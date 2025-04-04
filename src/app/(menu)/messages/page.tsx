// pages/inbox.js
"use client"
import authService from "@/services/authService";
import { createmessage, getmessages, getmessagesBySender, message, searchUser } from "@/services/messageService";
import  Select  from "react-select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import Menu from "@/components/layouts/Menu";

export type UseSearchDTO = {
    id: number;
    username: string;
}

export type MessageRequest  ={
   title: string;
   content: string;
   sentBy:  number;
   receivers: number[] ;
}

export default function Messages() {
  const router = useRouter();
  const [showmessage, setshowmessage] = useState<message[]>([]);
  const [userSearch, setUserSearch] = useState<UseSearchDTO[]>([]);
  const [showForm, setShowForm] = useState(false);
  const userId = authService.getUserId();
  const role = authService.getRole();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    receivers: [] as number[],
  });
  const [inputValue, setInputValue] = useState("");

  
  useEffect(()=>{
    if(userId!=null){
      if(role =="ADMIN"){
        getmessagesBySender(userId).then((data) => {
          setshowmessage(data);
        }).catch((e) =>{
          console.error("lỗi khi lấy danh sách messagebysender: ", e);
        });
      }else{
          getmessages(userId).then((data) => {
          setshowmessage(data);
          const unreadMessages = data.filter((message) => !message.read).length;
          localStorage.setItem("numberMessage", unreadMessages.toString());
          window.dispatchEvent(new Event("numberMessageUpdated"));
        }).catch((e) =>{
          console.error("lỗi khi lấy danh sách message: ", e);
        });
      };
    }else{
        console.error("lỗi khi lấy useId bằng null")
    };  
    
  },[]);

  const viewMessageDetails = (messageId: number) => {
    router.push(`/messages/${messageId}`);
  };

  const getUserSearch =(key: string)=>{
    searchUser(key).then((data)=>{
      setUserSearch(data)
    }).catch((e) =>{
      console.error("lỗi khi lấy danh sách userSearch: ", e);
    });
  }

  const debouncedSearch = debounce((value: string) => {
    getUserSearch(value);
  }, 100);

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
    debouncedSearch(inputValue);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    const newmessage: MessageRequest = {
      title: formData.title,
      content: formData.content,
      sentBy: userId,
      receivers: formData.receivers
    };
    try {
      await createmessage(newmessage);
      alert("Tin nhắn đã được gửi");
      setShowForm(false);
    } catch (e) {
      console.error("Lỗi:", e);
      alert("Gửi thông báo thất bại!");
    }
  };


  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4 ">
      <div className={`flex justify-between items-center mb-4 ${ role === 'ADMIN' ? '' : 'hidden'}`}>        
        <div className={"flex space-x-2"}>
          {/* <button className="p-2 hover:bg-gray-200 rounded-full hidden" 
          title="Hộp thư đến"
          onClick={changemessages}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full" 
          title="Thư đã gửi"
          onClick={changemessagesbysender}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M22 2L11 13M22 2L15 22l-4-9-9-4z"
              ></path>
            </svg>
          </button> */}
          <button className="p-2 hover:bg-gray-200 rounded-full" title="Soạn thư" onClick={()=>setShowForm(true)}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {showmessage.map((email, index) => (
          <div
            key={index}
            className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50"
            onClick={()=> viewMessageDetails(email.id)}
          >
            {/* Placeholder for avatar */}
            <div className={email.read? " font-medium flex-1" :"font-bold flex-1"}>
              <div className=" flex justify-between ">
                <span className="text-gray-900">
                  {email.sentBy}
                </span>
                <span className="text-gray-500 text-sm">{
                  email?.date
                  ? new Date(email.date).toLocaleDateString("vi-VN")
                  : "Không có ngày"}
                </span>
              </div>
              <p className="text-gray-600 text-sm truncate">{email.title}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-4/5 max-w-lg">
          <h2 className="text-2xl font-semibold text-center text-black mb-4">Gửi tin nhắn</h2>
          <form className="flex flex-col gap-4" onSubmit={addMessage}>
            <div>
              <label htmlFor="title" className="block text-black mb-1">Tiêu đề</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md bg-white text-white border border-gray-600"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-black mb-1">Nội dung</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full h-[200px] px-3 py-2 rounded-md bg-white text-white border border-gray-600"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-black mb-1">Gửi Đến</label>
              <Select
                id="type"
                className="w-full"
                options={userSearch.map((item) => ({ value: item.id, label: item.username }))}
                placeholder="Nhập và chọn"
                isClearable
                isMulti
                isSearchable
                onInputChange={(newValue) => handleInputChange(newValue)}
                onChange={(selectedOption) => 
                  setFormData({
                    ...formData,
                    receivers: selectedOption ? selectedOption.map(option => option.value) : []
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition">
                Hủy
              </button>
              <button type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
                Gửi Tin nhắn 
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      
    </div>
  );
}

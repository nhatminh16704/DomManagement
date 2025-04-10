"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  markMessageAsRead,
  getMessages,
  Message,
  searchUser,
  UseSearchDTO,
  MessageRequest,
  createmessage,
} from "@/services/messageService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UnreadMessagesContext } from "@/contexts/UnreadMessagesContext";
import { debounce } from "lodash";
import authService from "@/services/authService";
import  Select  from "react-select";

export default function Messages() {
  const context = useContext(UnreadMessagesContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const [userSearch, setUserSearch] = useState<UseSearchDTO[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    receivers: [] as number[],
  });
  const [inputValue, setInputValue] = useState("");
  const role = authService.getRole();
  const userId = authService.getUserId();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages();
        // Sort messages by date (newest first)
        fetchedMessages.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setMessages(fetchedMessages);
      } catch (error) {
        toast.error("Failed to load messages");
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);



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
    console.error(newmessage);
    try {
      await createmessage(newmessage);
      alert("Tin nhắn đã được gửi");
      setShowForm(false);
    } catch (e) {
      console.error("Lỗi:", e);
      alert("Gửi tin nhắn thất bại!");
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4 ">
      {/* Header with Compose Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-200 rounded-full">
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
                d="M4 4h16M4 8h16M4 12h16M4 16h16M4 20h16"
              ></path>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
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
                d="M15 12H9m6-6H9m6 12H9m-7-6h20"
              ></path>
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
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
        <button className={`bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 ${
                  role !== "ADMIN" ? "hidden" : ""
                }`}
        onClick={()=> setShowForm(true)}
        >
          <span>Compose</span>
        </button>
        <div className="flex items-center space-x-2">
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600">Show 1–10 of 10</span>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-lg shadow-md">
        {messages.map((email, index) => {
          const goToMessageDetail = () => {
            router.push(`/messages/${email.id}`);
            // Mark message as read if it's currently unread
            if (!email.read) {
              try {
                markMessageAsRead(email.id);
                context?.setUnreadCount((prev) => prev - 1);
              } catch (error) {
                console.error("Error marking message as read:", error);
                toast.error("Failed to mark message as read");
              }
            }
          };

          return (
            <div
              key={index}
              className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              onClick={goToMessageDetail}
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-4">
                {email.sentBy.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">
                    {email.sentBy}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(email.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <h4
                    className={`${
                      email.read ? "font-normal" : "font-bold"
                    } text-gray-800 mr-2`}
                  >
                    {email.title}
                  </h4>
                  <span className="text-gray-500 text-sm">
                    {email.preview}...
                  </span>
                </div>
              </div>
            </div>
          );
        })}
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
                className="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-600"
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
                className="w-full h-[200px] px-3 py-2 rounded-md bg-white text-black border border-gray-600"
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
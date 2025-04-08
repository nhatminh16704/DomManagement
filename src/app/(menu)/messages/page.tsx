"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  markMessageAsRead,
  getMessages,
  Message,
} from "@/services/messageService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UnreadMessagesContext } from "@/contexts/UnreadMessagesContext";

export default function Messages() {
  const context = useContext(UnreadMessagesContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

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
      </div>

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
    </div>
  );
}

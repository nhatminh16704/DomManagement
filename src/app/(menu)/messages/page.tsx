// pages/inbox.js
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const emails = [
  {
    sender: "Neil Sims",
    title: "Project Update",
    content:
      "Am no an listening depending up believing. Enough around remove to barton agreed regret in or it. Advantage mr estimable be commanded pro...",
    time: "17 April at 09:28 PM",
  },
  {
    sender: "Bonnie Green",
    title: "Meeting Schedule",
    content:
      "For norland produce age wishing. To figure on it spring season up. Her provision acuteness had excellent two why intention. As called mr nee...",
    time: "16 April at 10:28 PM",
  },
  {
    sender: "Roberta Casas",
    title: "Design Approval",
    content:
      "Silent sir say desire fat him letter. Whatever settling goodness too and honoured she building answered her. Strongly thoughts remember mr to...",
    time: "16 April at 02:28 PM",
  },
  {
    sender: "Michael Gough",
    title: "Feedback Request",
    content:
      "Smallest directly families surprise honoured am an. Speaking replying mistress him numerous she returned feelings may day. Evening way luckily s...",
    time: "15 April at 10:28 PM",
  },
  {
    sender: "Jese Leos",
    title: "Weekly Report",
    content:
      "Sing long her way size. Waited end mutual missed myself the little sister one. So in pointed or chicken cheered neither spirits invited. Marianne an...",
    time: "14 April at 07:28 PM",
  },
];



export default function Messages() {
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
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
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-900">
                  {email.sender}
                </span>
                <span className="text-gray-500 text-sm">{email.time}</span>
              </div>
              <div className="flex items-baseline">
                <h4 className="font-bold text-gray-800 mr-2">{email.title}</h4>
                <p className="text-gray-600 text-sm truncate">- {email.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

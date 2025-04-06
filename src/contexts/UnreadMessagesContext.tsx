import { createContext, useState, useEffect, ReactNode } from 'react';
import { getUnreadMessagesCount } from '@/services/messageService';

interface UnreadMessagesContextType {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}


export const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

// Provider component
export const UnreadMessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const count = await getUnreadMessagesCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };
    fetchUnreadMessages();
  }, []);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

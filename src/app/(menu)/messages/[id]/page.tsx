'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MessageDetail, getMessageById } from '@/services/messageService';
import { toast } from 'react-toastify';
import { ArrowLeftIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MessageDetailPage() {
  const params = useParams();
  const messageId = Number(params.id);
  const [message, setMessage] = useState<MessageDetail | null>(null);

  useEffect(() => {
    async function fetchMessage() {
      try {
        const messageData = await getMessageById(messageId);
        setMessage(messageData);
      } catch (error) {
        toast.error("Failed to load message");
        console.error("Error fetching message:", error);
      }
    }

    if (messageId) {
      fetchMessage();
    }
  }, [messageId]);

  if (!message) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="text-gray-500 text-lg">Message not found</div>
      </div>
    );
  }

  const formattedDate = new Date(message.date).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border border-gray-100 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6 mr-2" />
                <span className="font-medium">Back</span>
              </button>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-5 w-5 mr-1.5" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">{message.title}</CardTitle>
            <div className="flex items-center text-gray-600">
              <UserCircleIcon className="h-6 w-6 mr-2" />
              <span className="text-sm">From: {message.sentBy}</span>
            </div>
          </CardHeader>
          
          <CardContent className="border-t border-gray-100 pt-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {message.content}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

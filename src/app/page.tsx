"use client";
import React, { useEffect, useState } from "react";
import ChatbotWrapper from "@/components/ChatbotWrapper";

interface Chatbot {
  chatbot: {
    id: string;
    client_id: string;
    created_at: string;
    name: string;
  };
}

export default function Home() {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);

  async function fetchChatbot(chatbotId: string) {
    try {
      const response = await fetch(`/api/chatbot?id=${chatbotId}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching chatbot:", errorData.error);
        return;
      }

      const chatbotData = await response.json();
      setChatbot(chatbotData);
      console.log("Chatbot details:", chatbotData);
      return chatbotData;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  useEffect(() => {
    fetchChatbot("0f4ac1dc-5c2a-4db3-84ea-f74ae972fa9a");
  }, []);

  const chatbotId = chatbot?.chatbot?.id;

  console.log("Extracted Chatbot ID:", chatbotId);

  return (
    <div>
      <h1>Embeddable Chatbot Demo</h1>
      <ChatbotWrapper chatbotId={chatbotId || ""} />
    </div>
  );
}

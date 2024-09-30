"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const DynamicChatbotUI = dynamic(() => import("./ChatbotUI"), {
  ssr: false,
  loading: () => <p>Loading chatbot...</p>,
});

interface ChatbotWrapperProps {
  chatbotId: string;
}

const ChatbotWrapper: React.FC<ChatbotWrapperProps> = ({ chatbotId }) => {
  return (
    <Suspense fallback={<p>Loading chatbot...</p>}>
      <DynamicChatbotUI chatbotId={chatbotId} />
    </Suspense>
  );
};

export default ChatbotWrapper;

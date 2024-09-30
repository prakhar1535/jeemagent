"use client";
import React from "react";
import ChatbotUI from "../components/ChatbotUI";

export default function Home() {
  return (
    <div>
      <h1>Embeddable Chatbot Demo</h1>
      <ChatbotUI chatbotId="-bot" />
    </div>
  );
}

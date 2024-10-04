"use client";
import React from "react";
// import ChatbotUI from "../components/ChatbotUI";
import ChatbotWrapper from "@/components/ChatbotWrapper";

export default function Home() {
  return (
    <div>
      <h1>Embeddable Chatbot Demo</h1>
      <ChatbotWrapper chatbotId="-bot" />
    </div>
  );
}

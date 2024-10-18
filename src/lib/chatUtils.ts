import { Dispatch, SetStateAction } from "react";
import { Message } from "./types";

export const handleSend = async (
  message: string,
  chatbotId: string,
  setMessages: Dispatch<SetStateAction<Message[]>>,
  setInput: Dispatch<SetStateAction<string>>,
  setError: Dispatch<SetStateAction<string | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  if (message.trim()) {
    const userMessage: Message = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat?chatbotId=${chatbotId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage: Message = {
        text: data.reply,
        sender: "bot",
        recommendations: data.recommendations,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setError(
        (error as Error).message ||
          "An error occurred while processing your request"
      );
    } finally {
      setIsLoading(false);
    }
  }
};

export const handleFeedback = async (
  messageId: string,
  isPositive: boolean,
  feedbackText: string,
  score: number,
  chatbotId: string,
  setFeedbackState: Dispatch<
    SetStateAction<Record<number, "positive" | "negative" | null>>
  >
) => {
  setFeedbackState((prevState) => ({
    ...prevState,
    [parseInt(messageId)]: isPositive ? "positive" : "negative",
  }));

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId,
        isPositive,
        feedbackText,
        chatbotId,
        score,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit feedback");
    }

    // Optionally, you can handle successful feedback submission here
    console.log("Feedback submitted successfully");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    // Optionally, you can handle the error here, e.g., show an error message to the user
  }
};

export const generateSuggestions = async (
  lastBotMessage: string,
  chatbotId: string,
  setSuggestedMessages: Dispatch<SetStateAction<string[]>>
) => {
  try {
    const response = await fetch(`/api/chat?chatbotId=${chatbotId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Based on your last message: "${lastBotMessage}", generate 3-4 follow-up questions that a user might ask. Provide only the questions, separated by newlines.`,
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    const suggestions = data.reply
      .split("\n")
      .filter((s: string) => s.trim() !== "")
      .map((s: string) => s.trim().replace(/^-\s*/, "")); // Remove leading "-" if present

    setSuggestedMessages(suggestions);
  } catch (error) {
    console.error("Failed to generate suggestions:", error);
    setSuggestedMessages([]);
  }
};

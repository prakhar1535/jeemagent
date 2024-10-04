/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ChatHome from "../components/ui/ChatHome";
import TopBar from "./ui/TopBar";
import Input from "./ui/Input";
import Watermark from "./ui/Watermark";
import RecommendationList from "./RecommadationsList";

interface Message {
  text: string;
  sender: "user" | "bot";
  recommendations?: Recommendation[];
}

interface ChatbotWrapperProps {
  chatbotId: string;
}

interface Recommendation {
  title: string;
  subtitle: string;
}

const ChatbotWrapper: React.FC<ChatbotWrapperProps> = ({ chatbotId }) => {
  const [showChatUI, setShowChatUI] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
  const [expand, setExpand] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(error);

  const handleSend = async (message: string = input) => {
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
        console.log(botMessage);

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        setError(
          // @ts-ignore
          error.message || "An error occurred while processing your request"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setMessages([{ text: `Hello there how can I help you ?`, sender: "bot" }]);
    if (initialMessage) {
      handleSend(initialMessage);
    }
  }, [chatbotId, initialMessage]);

  const handleStartChat = (message: string) => {
    setInitialMessage(message);
    setShowChatUI(true);
  };

  const handleRecommendationSelect = (item: Recommendation) => {
    handleSend(item.title);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        background: !showChatUI
          ? "linear-gradient(to bottom, #343A40, #808080, #F7F7F7)"
          : "white",
      }}
      transition={{ duration: 0.5 }}
      style={{
        borderRadius: "15px",
        maxWidth: expand ? "416px" : "575px",
        minHeight: "575px",
        maxHeight: "650px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TopBar
        expand={expand}
        setExpand={() => setExpand(!expand)}
        backgroundColor={showChatUI ? "#343A40" : "unset"}
      />
      <AnimatePresence mode="wait">
        {!showChatUI ? (
          <motion.div
            key="chatHome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatHome expand={expand} />
          </motion.div>
        ) : (
          <motion.div
            key="chatUI"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flexGrow: 1, overflowY: "auto", padding: "12px" }}
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        message.sender === "user" ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1,
                        borderRadius:
                          message.sender === "user"
                            ? "8px 8px 0px 8px"
                            : "0px 8px 8px 8px",
                        backgroundColor:
                          message.sender === "user" ? "#343A40" : "#EEEEEE",
                        color: message.sender === "user" ? "white" : "black",
                        boxShadow: "none",
                        maxWidth: "80%",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "16px",
                          lineHeight: "24px",
                        }}
                      >
                        {message.text}
                      </Typography>
                    </Paper>
                  </Box>
                  {message.recommendations &&
                    message.recommendations.length > 0 && (
                      <RecommendationList
                        title="Type or select any choice"
                        items={message.recommendations}
                        onSelect={handleRecommendationSelect}
                      />
                    )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <CircularProgress size={24} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Box
        border={!showChatUI ? "1px solid #CDCDCD" : "1px solid #CDCDCD"}
        width={"100%"}
      >
        <Input
          input={input}
          handleSend={() => {
            handleStartChat(initialMessage);
            handleSend();
          }}
          setInput={setInput}
        />
        <Watermark />
      </Box>
    </motion.div>
  );
};

export default ChatbotWrapper;

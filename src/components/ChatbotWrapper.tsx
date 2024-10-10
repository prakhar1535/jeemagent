/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  IconButton,
  Chip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ChatHome from "../components/ui/ChatHome";
import TopBar from "./ui/TopBar";
import Input from "./ui/Input";
import Watermark from "./ui/Watermark";
import RecommendationList from "./RecommadationsList";
import AnimatedIconButton from "./WidgetButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
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
  const MarkdownComponents = {
    // @ts-ignore
    p: ({ node, ...props }) => <Typography {...props} />,
    // @ts-ignore
    ul: ({ node, ...props }) => <Box component="ul" ml={2} {...props} />,
    // @ts-ignore
    ol: ({ node, ...props }) => <Box component="ol" ml={2} {...props} />,
    // @ts-ignore
    li: ({ node, ...props }) => <Box component="li" mb={0} {...props} />,
  };

  const [showChatUI, setShowChatUI] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");
  const [expand, setExpand] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
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
  const handleInfoCardClick = (message: string) => {
    setShowChatUI(true);
    handleSend(message);
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  const resetChat = () => {
    setMessages([{ text: `Hello there how can I help you ?`, sender: "bot" }]);
    setShowChatUI(false);
    setInitialMessage("");
    setInput("");
    setError(null);
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - (suggestionsRef.current?.offsetLeft || 0));
    setScrollLeft(suggestionsRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (suggestionsRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Adjust scrolling speed
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollLeft = scrollLeft - walk;
    }
  };
  const generateSuggestions = async (lastBotMessage: string) => {
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
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "bot") {
        generateSuggestions(lastMessage.text);
      }
    }
  }, [messages]);
  const handleSuggestedMessageClick = (message: string) => {
    handleSend(message);
  };
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        right: { md: "20px", xs: "0px" },
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <Box
            sx={{
              width: expand
                ? { md: "420px", xs: "100%" }
                : { md: "575px", xs: "100%" },
            }}
          >
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                borderRadius: "15px",
                height: expand ? "635px" : "635px",
                maxHeight: "650px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <motion.div
                initial={false}
                animate={{
                  background: !showChatUI
                    ? "linear-gradient(to bottom, #343A40, #808080, #F7F7F7)"
                    : "transparent",
                }}
                transition={{ duration: 0.5 }}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TopBar
                  expand={expand}
                  setExpand={() => setExpand(!expand)}
                  backgroundColor={showChatUI ? "#343A40" : "unset"}
                  onReset={resetChat}
                />
                <AnimatePresence mode="wait">
                  {!showChatUI ? (
                    <motion.div
                      key="chatHome"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChatHome
                        expand={expand}
                        marginTop={expand ? "144px" : "144px"}
                        onInfoCardClick={handleInfoCardClick}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chatUI"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      style={{
                        flexGrow: 1,
                        overflowY: "auto",
                        padding: "12px",
                        backgroundColor: "white",
                      }}
                    >
                      <AnimatePresence>
                        {messages.map((message, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.1 }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent:
                                  message.sender === "user"
                                    ? "flex-end"
                                    : "flex-start",
                                mb: messages[messages.length - 1] ? 1 : 2,
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
                                    message.sender === "user"
                                      ? "#343A40"
                                      : "#EEEEEE",
                                  color:
                                    message.sender === "user"
                                      ? "white"
                                      : "black",
                                  boxShadow: "none",
                                  maxWidth: "80%",
                                }}
                              >
                                <ReactMarkdown
                                  // @ts-ignore
                                  components={MarkdownComponents}
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw]}
                                >
                                  {message.text}
                                </ReactMarkdown>
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
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginTop: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              marginBottom: "8px",
                              backgroundColor: "#f0f0f0",
                              borderRadius: "0px 8px 8px 8px",
                              padding: "4px 8px",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#666",
                                marginBottom: "4px",
                              }}
                            >
                              Thinking...
                            </Typography>
                            <LinearProgress
                              sx={{
                                width: "50px",
                                height: "2px",
                                backgroundColor: "#e0e0e0",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#666",
                                },
                              }}
                            />
                          </Box>
                          {/* <Skeleton
                            variant="rectangular"
                            sx={{
                              borderRadius: "0px 8px 8px 8px",
                            }}
                            width={250}
                            height={35}
                          /> */}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <Box
                  border={
                    !showChatUI ? "1px solid #CDCDCD" : "1px solid #CDCDCD"
                  }
                  width={"100%"}
                >
                  {suggestedMessages.length > 0 && (
                    <Box
                      sx={{
                        backgroundColor: "white",
                        pt: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          overflowX: "auto",
                          whiteSpace: "nowrap",
                          "&::-webkit-scrollbar": { display: "none" },
                          scrollbarWidth: "none",
                        }}
                      >
                        {showChatUI &&
                          suggestedMessages.map((msg, index) => (
                            <Chip
                              key={index}
                              label={msg}
                              onClick={() => handleSuggestedMessageClick(msg)}
                              sx={{
                                mr: 1,
                                my: 0.5,
                                bgcolor: "#343A40",
                                color: "white",
                              }}
                            />
                          ))}
                      </Box>
                    </Box>
                  )}
                  <Input
                    input={input}
                    handleSend={() => {
                      handleStartChat(initialMessage);
                      handleSend();
                    }}
                    setInput={setInput}
                    back={!showChatUI ? "transparent" : "white"}
                  />
                  <Watermark back={!showChatUI ? "transparent" : "white"} />
                </Box>
              </motion.div>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      <AnimatedIconButton isOpen={isOpen} toggleChat={toggleChat} />
    </Box>
  );
};

export default ChatbotWrapper;

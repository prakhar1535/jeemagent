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
  TextField,
  Button,
  Modal,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
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
  id?: string;
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
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [currentFeedbackMessageId, setCurrentFeedbackMessageId] = useState<
    string | null
  >(null);
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

  const handleFeedback = async (
    messageId: string,
    isPositive: boolean,
    feedbackText: string = "",
    score: number
  ) => {
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
      // Optionally, update UI to show feedback was received
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Optionally, show error message to user
    }
  };

  const handleThumbsUp = (messageId: string, score: number) => {
    handleFeedback(messageId, true, "positive feedback", 1);
  };

  const handleThumbsDown = (messageId: string, score: number) => {
    setCurrentFeedbackMessageId(messageId);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = () => {
    if (currentFeedbackMessageId) {
      handleFeedback(currentFeedbackMessageId, false, feedbackMessage, 0);
    }
    setFeedbackModalOpen(false);
    setFeedbackMessage("");
    setCurrentFeedbackMessageId(null);
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
            >
              <Box
                sx={{
                  borderRadius: "15px",
                  height: expand ? "635px" : "635px",
                  maxHeight: "650px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  marginBottom: "10px",
                  border: "none !important",
                  "& > *": {
                    border: "none !important",
                  },
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
                    justifyContent: !showChatUI ? "space-between" : "unset",
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
                          marginTopmd={expand ? "144px" : "191px"}
                          marginTopxs={"144px"}
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
                                onMouseEnter={() =>
                                  setHoveredMessageId(String(index))
                                }
                                onMouseLeave={() => setHoveredMessageId(null)}
                              >
                                <Box
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
                                </Box>
                                {message.sender === "bot" &&
                                  hoveredMessageId === String(index) && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 2,
                                        right: "60px",
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleThumbsUp(String(index) || "", 1)
                                        }
                                      >
                                        <ThumbUpIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleThumbsDown(
                                            String(index) || "",
                                            0
                                          )
                                        }
                                      >
                                        <ThumbDownIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  )}
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
                    border={!showChatUI ? "1px solid #CDCDCD" : "transparent"}
                    width={"100%"}
                  >
                    {showChatUI && suggestedMessages.length > 0 && (
                      <Box
                        sx={{
                          backgroundColor: "white",
                          pt: "55px",
                          border: "none",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            "&::-webkit-scrollbar": { display: "none" },
                            scrollbarWidth: "none",
                            border: "none",
                          }}
                        >
                          {showChatUI &&
                            suggestedMessages.map((msg, index) => (
                              <Box
                                key={index}
                                onClick={() => handleSuggestedMessageClick(msg)}
                                sx={{
                                  ml: "12px",
                                  my: 1,
                                  bgcolor: "#EEEEEE",
                                  borderRadius: "8px",
                                  padding: "6px 8px",
                                  color: "black",
                                  border: "1px solid #D2D2D2",
                                  cursor: "pointer",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#151515",
                                  }}
                                >
                                  {msg.length > 10
                                    ? `${msg.substring(0, 25)}...`
                                    : msg}
                                </Typography>
                              </Box>
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
              </Box>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      <AnimatedIconButton isOpen={isOpen} toggleChat={toggleChat} />
      <Modal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 id="feedback-modal-title">Provide Feedback</h2>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="What could be improved?"
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={handleFeedbackSubmit}>
            Submit feedback
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ChatbotWrapper;

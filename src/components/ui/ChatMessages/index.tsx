/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import { Box, Typography, IconButton, LinearProgress } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpOnAltIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Message, Recommendation } from "@/lib/types";
import RecommendationList from "../../RecommadationsList";

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

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  feedbackState: Record<number, "positive" | "negative" | null>;
  handleFeedback: (
    messageId: string,
    isPositive: boolean,
    score: number
  ) => void;
  handleSend?: (item: any) => void;
  setFeedbackModalOpen: (open: boolean) => void;
  setCurrentFeedbackMessageId: (id: string | null) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  feedbackState,
  handleFeedback,
  setFeedbackModalOpen,
  setCurrentFeedbackMessageId,
  handleSend,
}) => {
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  // const handleRecommendationSelect = (item: Recommendation) => {
  //   handleSend(item?.title || undefined);
  // };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                mb: "1.5rem",
              }}
              onMouseEnter={() => setHoveredMessageId(String(index))}
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
                    message.sender === "user" ? "#343A40" : "#EEEEEE",
                  color: message.sender === "user" ? "white" : "black",
                  boxShadow: "none",
                  maxWidth: "85%",
                }}
              >
                <ReactMarkdown
                  //@ts-ignore
                  components={MarkdownComponents}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {message.text}
                </ReactMarkdown>
              </Box>
              {message.sender === "bot" && (
                <Box sx={{ width: "fit-content", ml: 1 }}>
                  {(hoveredMessageId === String(index) ||
                    feedbackState[index]) && (
                    <>
                      {(!feedbackState[index] ||
                        feedbackState[index] === "positive") && (
                        <IconButton
                          size="small"
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          sx={{
                            cursor:
                              feedbackState[index] === "positive"
                                ? "default"
                                : "pointer",
                          }}
                          onClick={() => handleFeedback(String(index), true, 1)}
                        >
                          {feedbackState[index] === "positive" ? (
                            <ThumbUpIcon
                              fontSize="small"
                              sx={{
                                width: "16px",
                                height: "16px",
                                color: "#60a5fa",
                              }}
                            />
                          ) : (
                            <ThumbUpOnAltIcon
                              fontSize="small"
                              sx={{ width: "16px", height: "16px" }}
                            />
                          )}
                        </IconButton>
                      )}
                      {(!feedbackState[index] ||
                        feedbackState[index] === "negative") && (
                        <IconButton
                          size="small"
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          sx={{
                            cursor:
                              feedbackState[index] === "negative"
                                ? "default"
                                : "pointer",
                          }}
                          onClick={() => {
                            setCurrentFeedbackMessageId(String(index));
                            setFeedbackModalOpen(true);
                          }}
                        >
                          {feedbackState[index] === "negative" ? (
                            <ThumbDownIcon
                              fontSize="small"
                              sx={{
                                width: "16px",
                                height: "16px",
                                color: "#ff6347",
                              }}
                            />
                          ) : (
                            <ThumbUpOffAltIcon
                              fontSize="small"
                              sx={{ width: "16px", height: "16px" }}
                            />
                          )}
                        </IconButton>
                      )}
                    </>
                  )}
                </Box>
              )}
            </Box>
            {message.recommendations && message.recommendations.length > 0 && (
              <RecommendationList
                title="Type or select any choice"
                items={message.recommendations}
                onSelect={() => {}}
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
              sx={{ color: "#666", marginBottom: "4px" }}
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
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessages;

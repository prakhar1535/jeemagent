"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatbotUIProps {
  chatbotId: string;
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const ChatbotUI: React.FC<ChatbotUIProps> = ({ chatbotId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages([
      {
        text: `Hello! I'm chatbot ${chatbotId}. How can I help you?`,
        sender: "bot",
      },
    ]);
  }, [chatbotId]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" as const };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setError(null);

      try {
        const response = await fetch(`/api/chat?chatbotId=${chatbotId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const botMessage = { text: data.reply, sender: "bot" as const };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        setError(
          error.message || "An error occurred while processing your request"
        );
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          p: 2,
          maxWidth: 400,
          maxHeight: 500,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Chat with Bot {chatbotId}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
          {messages.map((message, index) => (
            <Box
              key={index}
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
                  backgroundColor:
                    message.sender === "user"
                      ? "primary.light"
                      : "secondary.light",
                  color:
                    message.sender === "user"
                      ? "primary.contrastText"
                      : "secondary.contrastText",
                  maxWidth: "80%",
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex" }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
          />
          <Button variant="contained" onClick={handleSend} sx={{ ml: 1 }}>
            Send
          </Button>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ChatbotUI;

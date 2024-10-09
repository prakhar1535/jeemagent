"use client";
import { Box } from "@mui/material";
import React, { useState } from "react";
import Input from "../Input";
import Watermark from "../Watermark";

interface Props {
  onStartChat: (message: string) => void;
}

const ChatFooter: React.FC<Props> = ({ onStartChat }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onStartChat(input);
    }
  };
  return (
    <>
      <Box>
        {" "}
        <Box sx={{ borderTop: "2px solid #CDCDCD", padding: "10px" }}>
          <Input
            back="white"
            input={input}
            handleSend={handleSend}
            setInput={setInput}
          />
        </Box>
        <Watermark back="white" />
      </Box>
    </>
  );
};

export default ChatFooter;

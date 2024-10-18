import React from "react";
import { Box, Typography } from "@mui/material";
import Input from "../Input";

interface InputAreaProps {
  showChatUI: boolean;
  suggestedMessages: string[];
  input: string;
  setInput: (input: string) => void;
  handleSend: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  showChatUI,
  suggestedMessages,
  input,
  setInput,
  handleSend,
}) => {
  return (
    <Box
      sx={{
        borderTop: "1px solid #cdcdcd",
        backgroundColor: showChatUI ? "white" : "transparent",
      }}
    >
      {showChatUI && suggestedMessages.length > 0 && (
        <Box
          sx={{
            backgroundColor: "white",
            pt: "5px",
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
            {suggestedMessages.map((msg, index) => (
              <Box
                key={index}
                onClick={() => {
                  setInput(msg);
                  handleSend();
                }}
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
                  {msg}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <Input
        input={input}
        handleSend={handleSend}
        setInput={setInput}
        back={showChatUI ? "white" : "transparent"}
      />
    </Box>
  );
};

export default InputArea;

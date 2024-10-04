import { Box, IconButton, InputBase } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";

interface Inputs {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}

const Input: React.FC<Inputs> = ({ input, setInput, handleSend }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "4px 16px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <InputBase
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        placeholder="Write your message..."
        sx={{
          fontSize: "14px",
          "& .MuiInputBase-input": {
            padding: "8px 0",
          },
        }}
      />
      <IconButton
        onClick={handleSend}
        sx={{
          padding: "15px 12px",
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        <SendIcon
          sx={{ fontSize: 20, color: (theme) => theme.palette.text.secondary }}
        />
      </IconButton>
    </Box>
  );
};

export default Input;

import React, { KeyboardEvent } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface InputProps {
  input: string;
  handleSend: () => void;
  setInput: (input: string) => void;
  back: string;
}

const Input: React.FC<InputProps> = ({ input, handleSend, setInput, back }) => {
  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        backgroundColor: back,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            backgroundColor: "#F5F5F5",
          },
        }}
      />
      <IconButton
        onClick={handleSend}
        color="primary"
        sx={{ marginLeft: "10px" }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default Input;

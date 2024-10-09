import React from "react";
import { IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LayersIcon from "@mui/icons-material/Layers";
import CloseIcon from "@mui/icons-material/Close";

const AnimatedIconButton: React.FC<{
  isOpen: boolean;
  toggleChat: () => void;
}> = ({ isOpen, toggleChat }) => {
  return (
    <IconButton
      onClick={toggleChat}
      sx={{
        color: "white",
        "&:hover": {
          backgroundColor: "#2563EB",
        },
        width: "60px",
        height: "60px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#343A40",
      }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", top: "17px" }}
          >
            <CloseIcon />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "10px",
            }}
          >
            <LayersIcon
              sx={{ height: "36px", width: "36px", color: "white" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </IconButton>
  );
};

export default AnimatedIconButton;

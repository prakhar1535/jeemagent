import React from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  feedbackMessage: string;
  setFeedbackMessage: (message: string) => void;
  handleSubmit: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  feedbackMessage,
  setFeedbackMessage,
  handleSubmit,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="feedback-modal-title"
      aria-describedby="feedback-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { md: "30%", xs: "90%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          id="feedback-modal-title"
          variant="h6"
          component="h2"
          sx={{
            color: "#151515",
            mb: 2,
          }}
        >
          Provide Feedback
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="What could be improved?"
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={() => {
            handleSubmit();
            onClose();
          }}
          disableRipple
          sx={{
            boxShadow: "none",
            textTransform: "none",
            backgroundColor: "#343A40",
            "&:hover": {
              backgroundColor: "#4a5661",
            },
          }}
        >
          Submit feedback
        </Button>
      </Box>
    </Modal>
  );
};

export default FeedbackModal;

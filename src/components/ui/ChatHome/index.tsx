import { Box, Grid2, Typography } from "@mui/material";
import React from "react";
import InfoCards from "./components/InfoCards";

const ChatHome = ({ expand }: { expand: boolean }) => {
  const demoInfo = [
    { title: "Food 101", subtitle: "Top recommended books" },
    { title: "Robotics 101", subtitle: "Top recommended books" },
    { title: "Sales 101", subtitle: "Top recommended books" },
    { title: "Chat", subtitle: "Top recommended books" },
  ];

  return (
    <Box
      padding={"15px"}
      display={"flex"}
      flexDirection={"column"}
      flexGrow={1}
    >
      <Box mt={2}>
        <Typography
          sx={{
            color: "white",
            fontWeight: "600",
            lineHeight: "32px",
            fontSize: "24px",
          }}
        >
          Hello there.
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontWeight: "600",
            lineHeight: "24px",
            fontSize: "24px",
          }}
        >
          How can I help you?
        </Typography>
      </Box>
      <Grid2 container spacing={1} sx={{ marginTop: "144px", marginBottom: 2 }}>
        {demoInfo.map((item, index) => (
          <Grid2 key={index} size={6}>
            <InfoCards
              title={item.title}
              subtitle={item.subtitle}
              onclick={() => {}}
              minwidth={expand ? "190px" : "270px"}
            />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default ChatHome;

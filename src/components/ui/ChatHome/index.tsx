import { Box, Grid2, Typography } from "@mui/material";
import React from "react";
import InfoCards from "./components/InfoCards";

const ChatHome = ({
  expand,
  marginTopmd,
  marginTopxs,
  onInfoCardClick,
}: {
  expand: boolean;

  onInfoCardClick: (message: string) => void;
  marginTopmd?: string;
  marginTopxs?: string;
}) => {
  const demoInfo = [
    {
      title: "Food 101",
      subtitle: "Top recommended books",
      message: "Give some food recipes recommendations",
    },
    {
      title: "Robotics 101",
      subtitle: "Top recommended books",
      message: "Give some food recipes recommendations",
    },
    {
      title: "Sales 101",
      subtitle: "Top recommended books",
      message: "Share some effective sales techniques",
    },
    {
      title: "Chat",
      subtitle: "Top recommended books",
      message: "Let's start a general conversation",
    },
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
      <Grid2
        container
        spacing={1}
        sx={{
          marginTop: { md: marginTopmd, xs: marginTopxs },
          marginBottom: 2,
        }}
      >
        {demoInfo.map((item, index) => (
          <Grid2 key={index} size={6}>
            <InfoCards
              title={item.title}
              subtitle={item.subtitle}
              onclick={() => onInfoCardClick(item.message)}
              minwidth={expand ? "190px" : "270px"}
            />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default ChatHome;

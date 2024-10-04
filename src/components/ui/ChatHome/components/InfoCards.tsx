import { Box, Typography } from "@mui/material";
import React from "react";
interface Props {
  title: string;
  subtitle: string;
  onclick: () => void;
  minwidth: string;
}
const InfoCards: React.FC<Props> = ({ title, subtitle, onclick, minwidth }) => {
  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        padding={"15px"}
        gap={"3px"}
        onClick={onclick}
        borderRadius={"12px"}
        minWidth={{ md: minwidth, xs: "auto" }}
        sx={{
          cursor: "pointer",
          backgroundColor: "white",
        }}
      >
        <Typography
          sx={{
            color: "#121212",
            fontWeight: "500",
            lineHeight: "24px",
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: "#3E3E3E",
            fontWeight: "400",
            lineHeight: "24px",
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </>
  );
};

export default InfoCards;

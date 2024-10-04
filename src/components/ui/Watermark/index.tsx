import { Box, Typography } from "@mui/material";
import React from "react";

const Watermark = () => {
  return (
    <>
      <Box
        display={"flex"}
        padding={"9px 16px"}
        width={"100%"}
        justifyContent={"flex-end"}
      >
        <Typography
          sx={{
            color: "#878787",
            fontSize: "12px",
            fontWeight: "500",
            textAlign: "right",
          }}
        >
          Powered by Jeemagent
        </Typography>
      </Box>
    </>
  );
};

export default Watermark;

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

interface Props {
  expand: boolean;
  setExpand: (value: React.SetStateAction<boolean>) => void;
  backgroundColor?: string;
}

const TopBar: React.FC<Props> = ({ expand, setExpand, backgroundColor }) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      padding={"15px"}
      sx={{
        backgroundColor: backgroundColor ? backgroundColor : "unset",
      }}
    >
      <Box display={"flex"} gap={"8px"} alignItems={"center"}>
        <Box
          padding={"7px"}
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            width: "39px",
            height: "39px",
          }}
        >
          <LayersIcon
            sx={{ height: "23px", width: "23px", color: "#343A40" }}
          />
        </Box>
        <Typography
          sx={{
            color: "white",
            fontWeight: "600",
            lineHeight: "24px",
            fontSize: "18px",
          }}
        >
          Jeemagent
        </Typography>
      </Box>
      <IconButton onClick={() => setExpand(!expand)}>
        {expand ? (
          <OpenInFullIcon
            sx={{
              cursor: "pointer",
              color: "white",
              width: "18px",
              height: "18px",
            }}
          />
        ) : (
          <CloseFullscreenIcon
            sx={{
              cursor: "pointer",
              color: "white",
              width: "18px",
              height: "18px",
            }}
          />
        )}
      </IconButton>
    </Box>
  );
};

export default TopBar;

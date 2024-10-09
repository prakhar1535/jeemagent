import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LayersIcon from "@mui/icons-material/Layers";
interface TopBarProps {
  expand: boolean;
  setExpand: () => void;
  backgroundColor: string;
  onReset: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  expand,
  setExpand,
  backgroundColor,
  onReset,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        backgroundColor: backgroundColor,
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
      <Box>
        <IconButton
          onClick={onReset}
          sx={{ color: "white", marginRight: "8px" }}
        >
          <RestartAltIcon
            sx={{
              width: "18px",
            }}
          />
        </IconButton>
        <IconButton onClick={setExpand} sx={{ color: "white" }}>
          {expand ? (
            <OpenInFullIcon
              sx={{
                width: "18px",
              }}
            />
          ) : (
            <CloseFullscreenIcon
              sx={{
                width: "18px",
              }}
            />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopBar;

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion, AnimatePresence } from "framer-motion";

interface Recommendation {
  title: string;
  subtitle: string;
}

interface RecommendationListProps {
  title: string;
  items: Recommendation[];
  onSelect: (item: Recommendation) => void;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  title,
  items,
  onSelect,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Typography sx={{ p: "8px", fontWeight: "400", color: "#343A40" }}>
        {title}
      </Typography>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              when: "beforeChildren",
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <Box
          sx={{
            p: 0,
            // gap: "8px",
            display: "flex",
            flexDirection: "column",
            padding: "8px",
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Box
                onClick={() => onSelect(item)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  backgroundColor:
                    hoveredIndex === index ? "#ededed" : "transparent",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      color: "black",
                      fontWeight: "600",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <ArrowForwardIcon
                    sx={{
                      width: "14px",
                      height: "14px",
                      color: "#373737",
                      transform: "rotate(-45deg)",
                    }}
                  />
                </Box>
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Typography
                        sx={{
                          color: "#666",
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.subtitle}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
};

export default RecommendationList;

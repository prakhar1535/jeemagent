import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion, AnimatePresence } from "framer-motion";

interface Recommendation {
  title: string;
  subtitle: string;
  link?: string;
  price?: string;
  thumbnail?: string;
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
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    items.forEach((item) => {
      if (item.link && !item.thumbnail) {
        setLoading((prev) => ({ ...prev, [item.title]: true }));
        fetch(`/api/fetch-image?title=${encodeURIComponent(item.title)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.thumbnail) {
              setThumbnails((prev) => ({
                ...prev,
                [item.title]: data.thumbnail,
              }));
            }
            setLoading((prev) => ({ ...prev, [item.title]: false }));
          })
          .catch(() => {
            setLoading((prev) => ({ ...prev, [item.title]: false }));
          });
      }
    });
  }, [items]);

  const renderScrollableLayout = (item: Recommendation, index: number) => (
    <Box
      key={index}
      onClick={() => {
        window.location.href = `${item.link}`;
        onSelect(item);
      }}
      sx={{
        flexShrink: 0,
        width: "200px",
        marginRight: "16px",
        borderRadius: "8px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "background-color 0.3s",
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: "rgba(255, 165, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "120px",
          position: "relative",
          marginBottom: "8px",
        }}
      >
        {loading[item.title] ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <img
            src={
              item.thumbnail ||
              thumbnails[item.title] ||
              "/api/placeholder/150/150"
            }
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        )}
      </Box>
      <Typography sx={{ fontWeight: 600, color: "#151515", fontSize: "18px" }}>
        {item.title}
      </Typography>
      {item.price && (
        <Typography sx={{ fontWeight: 600, color: "green" }}>
          {item.price}
        </Typography>
      )}
    </Box>
  );

  const renderListLayout = (item: Recommendation, index: number) => (
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
          backgroundColor: hoveredIndex === index ? "#ededed" : "transparent",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ color: "black", fontWeight: "600" }}>
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
              <Typography sx={{ color: "#666", fontSize: "0.875rem" }}>
                {item.subtitle}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );

  const hasExtendedInfo = items.some((item) => item.link && item.price);

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: "0px 8px 8px 8px",
        overflow: "hidden",
      }}
    >
      <Typography sx={{ p: "16px", fontWeight: "400", color: "#343A40" }}>
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
        {hasExtendedInfo ? (
          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              overflowX: "auto",
              padding: "16px",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            {items.map((item, index) => renderScrollableLayout(item, index))}
          </Box>
        ) : (
          <Box
            sx={{ display: "flex", flexDirection: "column", padding: "8px" }}
          >
            {items.map((item, index) => renderListLayout(item, index))}
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default RecommendationList;

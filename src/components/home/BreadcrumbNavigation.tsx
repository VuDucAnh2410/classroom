import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { MdChevronRight } from "react-icons/md";

const BreadcrumbNavigation = ({ items }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.onClick ? (
            <Link
              component="button"
              onClick={item.onClick}
              underline="hover"
              color="inherit"
              sx={{ fontSize: "1rem", fontWeight: 500 }}
            >
              {item.label}
            </Link>
          ) : (
            <Typography
              color="text.primary"
              sx={{ fontSize: "1rem", fontWeight: 600 }}
            >
              {item.label}
            </Typography>
          )}

          {index < items.length - 1 && (
            <MdChevronRight style={{ margin: "0 4px" }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default BreadcrumbNavigation;

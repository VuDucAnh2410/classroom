import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import PersonalInfo from "./PersonalInfo";
import DisplaySettings from "./DisplaySettings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: "calc(100vh - 88px)",
        p: 2,
      }}
    >
      <Paper
        sx={{
          display: "flex",
          minHeight: "75vh",
          width: "100%",
          maxWidth: "1100px",
          boxShadow: 3,
        }}
      >
        {/* Menu con của trang Settings */}
        <Box sx={{ width: 240, borderRight: "1px solid #e0e0e0", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Cài đặt
          </Typography>
          <List>
            <ListItemButton
              selected={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
            >
              <ListItemText primary="Thông tin cá nhân" />
            </ListItemButton>
            <ListItemButton
              selected={activeTab === "display"}
              onClick={() => setActiveTab("display")}
            >
              <ListItemText primary="Chế độ hiển thị" />
            </ListItemButton>
          </List>
        </Box>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {activeTab === "personal" && <PersonalInfo />}
          {activeTab === "display" && <DisplaySettings />}
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;

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
    <Paper sx={{ display: "flex", minHeight: "80vh" }}>
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

      {/* Nội dung tương ứng với tab */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {activeTab === "personal" && <PersonalInfo />}
        {activeTab === "display" && <DisplaySettings />}
      </Box>
    </Paper>
  );
};

export default SettingsPage;

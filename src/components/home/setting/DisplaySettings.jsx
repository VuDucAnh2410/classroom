// src/components/home/settings/DisplaySettings.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";

const DisplaySettings = () => {
  const [settings, setSettings] = useState({
    utilities: true,
    notifications: true,
    showPhone: false,
    darkMode: false,
    boldMode: true,
  });

  const handleChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box>
      <Typography variant="h6">Tiện ích</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={settings.utilities}
            onChange={handleChange}
            name="utilities"
          />
        }
        label="Bật/Tắt tiện ích"
      />
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Thông báo</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications}
            onChange={handleChange}
            name="notifications"
          />
        }
        label="Nhận thông báo qua email"
      />
      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Chế độ hiển thị</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={settings.showPhone}
              onChange={handleChange}
              name="showPhone"
            />
          }
          label="Hiển thị số điện thoại"
        />
        {/* <FormControlLabel
          control={
            <Switch
              checked={settings.darkMode}
              onChange={handleChange}
              name="darkMode"
            />
          }
          label="Chế độ nền tối"
        /> */}
        <FormControlLabel
          control={
            <Switch
              checked={settings.boldMode}
              onChange={handleChange}
              name="boldMode"
            />
          }
          label="Chế độ chữ đậm"
        />
      </FormGroup>
    </Box>
  );
};

export default DisplaySettings;

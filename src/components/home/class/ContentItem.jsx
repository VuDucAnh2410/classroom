import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import {
  MdDelete,
  MdEdit,
  MdFolder,
  MdInsertDriveFile,
  MdMoreVert,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";



// Component ContentItem nhận props listFolder.
export const ContentItem = ({
  folder
}) => {
  const [anchorElMap, setAnchorElMap] = useState({});
  const navigation = useNavigate();
  // Xử lý mở menu
  const handleMenuOpen = (event, itemId) => {
    event.stopPropagation();
    setAnchorElMap((prev) => ({ ...prev, [itemId]: event.currentTarget }));
  };



  // Xử lý đóng menu
  const handleMenuClose = (event, itemId) => {
    event.stopPropagation();
    setAnchorElMap((prev) => ({ ...prev, [itemId]: null }));
  };

console.log(folder);


  return (
    <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              mb: 1,
              backgroundColor: "white",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              cursor: "pointer",
              "&:hover": { boxShadow: 1, borderColor: "primary.main" },
            }}
          >
              <MdFolder size={28} className="text-blue-500" />
            <Typography sx={{ ml: 2, flexGrow: 1, fontWeight: 500 }}>
              {folder?.name}
            </Typography>
            <IconButton
              size="small"
            >
              <MdMoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorElMap[folder?.id]}
              open={Boolean(anchorElMap[folder?.id])}
              onClose={(e) => handleMenuClose(e, folder?.id)}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem>
                {/* Để icon và text cùng nằm trên một hàng, bạn có thể
                  sử dụng Box với display flex hoặc thêm sx vào MenuItem
                */}
                <MdEdit style={{ marginRight: 8 }} />
                Sửa
              </MenuItem>
              <MenuItem>
                <MdDelete style={{ marginRight: 8 }} />
                Xóa
              </MenuItem>
            </Menu>
          </Box>
    </>
  );
};


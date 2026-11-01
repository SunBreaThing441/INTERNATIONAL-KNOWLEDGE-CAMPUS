import React, { useState } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { currentRole, currentUser } = useSelector((state) => state.user);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getRoleColor = (role) => {
    if (role === "Admin") return "#00A3FF";
    if (role === "Teacher") return "#00C49F";
    return "#A855F7";
  };

  const roleColor = getRoleColor(currentRole);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Ecosystem Identity">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              ml: 1.5,
              border: `2px solid ${roleColor}60`,
              boxShadow: `0 0 12px ${roleColor}30`,
              transition: "all 0.2s",
              "&:hover": {
                borderColor: roleColor,
                transform: "scale(1.05)",
              },
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "rgba(0, 119, 212, 0.25)",
                color: "#F8FAFC",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              {currentUser?.name ? String(currentUser.name).charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            background: "rgba(11, 19, 43, 0.92)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "14px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
            minWidth: 200,
            color: "#F8FAFC",
            p: 1,
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
            {currentUser?.name || "Authenticated User"}
          </Typography>
          <Typography variant="caption" sx={{ color: roleColor, fontWeight: 700, textTransform: "uppercase" }}>
            {currentRole === "Admin" ? "Chancellor" : currentRole === "Teacher" ? "Academic Mentor" : "Global Scholar"}
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5, borderColor: "rgba(255, 255, 255, 0.08)" }} />

        <MenuItem component={Link} to={`/${currentRole}/profile`} sx={{ borderRadius: "8px", my: 0.5 }}>
          <ListItemIcon sx={{ color: "#00A3FF", minWidth: 32 }}>
            <Person fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Dossier & Profile</Typography>
        </MenuItem>

        <MenuItem component={Link} to="/logout" sx={{ borderRadius: "8px", my: 0.5, color: "#EF4444" }}>
          <ListItemIcon sx={{ color: "#EF4444", minWidth: 32 }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Sign Out</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;

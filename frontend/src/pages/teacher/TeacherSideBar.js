import * as React from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Tooltip,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import { useSelector } from "react-redux";

const TeacherSideBar = ({ open = true }) => {
  const { currentUser } = useSelector((state) => state.user);
  const sclassName = currentUser?.teachSclass?.sclassName || "Assigned Cohort";
  const location = useLocation();

  const isNavActive = (path) => {
    if (path === "/" || path === "/Teacher/dashboard") {
      return location.pathname === "/" || location.pathname === "/Teacher/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const navItemStyle = (active) => ({
    my: 0.5,
    mx: 1,
    borderRadius: "10px",
    background: active ? "linear-gradient(135deg, rgba(0, 196, 159, 0.25) 0%, rgba(0, 119, 212, 0.15) 100%)" : "transparent",
    border: active ? "1px solid rgba(0, 196, 159, 0.4)" : "1px solid transparent",
    color: active ? "#FFFFFF" : "#94A3B8",
    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.05)",
      color: "#F8FAFC",
    },
  });

  return (
    <Box sx={{ py: 1 }}>
      {open ? (
        <ListSubheader
          component="div"
          sx={{
            backgroundColor: "transparent",
            color: "#00C49F",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 2,
            py: 0.75,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Faculty Terminal
        </ListSubheader>
      ) : (
        <Tooltip title="Faculty Terminal" placement="right">
          <Box sx={{ height: 14, my: 0.5 }} />
        </Tooltip>
      )}

      {/* Home */}
      <ListItemButton component={Link} to="/Teacher/dashboard" sx={navItemStyle(isNavActive("/Teacher/dashboard"))}>
        <Tooltip title="Overview">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Teacher/dashboard") ? "#00C49F" : "#94A3B8" }}>
            <HomeIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Overview"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Teacher/dashboard") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Class Details */}
      <ListItemButton component={Link} to="/Teacher/class" sx={navItemStyle(isNavActive("/Teacher/class"))}>
        <Tooltip title={`Class ${sclassName}`}>
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Teacher/class") ? "#00C49F" : "#94A3B8" }}>
            <ClassOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary={`Class ${sclassName}`}
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Teacher/class") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Complain */}
      <ListItemButton component={Link} to="/Teacher/complain" sx={navItemStyle(isNavActive("/Teacher/complain"))}>
        <Tooltip title="Faculty Grievance / Oversight">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Teacher/complain") ? "#00C49F" : "#94A3B8" }}>
            <AnnouncementOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Complaints"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Teacher/complain") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      <Divider sx={{ my: 1.5, borderColor: "rgba(255, 255, 255, 0.08)" }} />

      {open ? (
        <ListSubheader
          component="div"
          sx={{
            backgroundColor: "transparent",
            color: "#94A3B8",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 2,
            py: 0.75,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Identity & Session
        </ListSubheader>
      ) : (
        <Tooltip title="Identity & Session" placement="right">
          <Box sx={{ height: 14, my: 0.5 }} />
        </Tooltip>
      )}

      {/* Profile */}
      <ListItemButton component={Link} to="/Teacher/profile" sx={navItemStyle(isNavActive("/Teacher/profile"))}>
        <Tooltip title="Faculty Profile & Dossier">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Teacher/profile") ? "#00C49F" : "#94A3B8" }}>
            <AccountCircleOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Profile"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Teacher/profile") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Logout */}
      <ListItemButton component={Link} to="/logout" sx={navItemStyle(false)}>
        <Tooltip title="Sign Out">
          <ListItemIcon sx={{ minWidth: 40, color: "#EF4444" }}>
            <ExitToAppIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Sign Out"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", color: "#EF4444", whiteSpace: "nowrap" }}
        />
      </ListItemButton>
    </Box>
  );
};

export default TeacherSideBar;

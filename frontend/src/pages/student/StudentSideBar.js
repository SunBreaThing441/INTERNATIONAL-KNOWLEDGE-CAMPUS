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
import AssignmentIcon from "@mui/icons-material/Assignment";

const StudentSideBar = ({ open = true }) => {
  const location = useLocation();

  const isNavActive = (path) => {
    if (path === "/" || path === "/Student/dashboard") {
      return location.pathname === "/" || location.pathname === "/Student/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const navItemStyle = (active) => ({
    my: 0.5,
    mx: 1,
    borderRadius: "10px",
    background: active ? "linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(0, 119, 212, 0.15) 100%)" : "transparent",
    border: active ? "1px solid rgba(168, 85, 247, 0.4)" : "1px solid transparent",
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
            color: "#A855F7",
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
          Scholar Navigation
        </ListSubheader>
      ) : (
        <Tooltip title="Scholar Navigation" placement="right">
          <Box sx={{ height: 14, my: 0.5 }} />
        </Tooltip>
      )}

      {/* Home */}
      <ListItemButton component={Link} to="/Student/dashboard" sx={navItemStyle(isNavActive("/Student/dashboard"))}>
        <Tooltip title="Overview">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Student/dashboard") ? "#A855F7" : "#94A3B8" }}>
            <HomeIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Overview"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Student/dashboard") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Subjects */}
      <ListItemButton component={Link} to="/Student/subjects" sx={navItemStyle(isNavActive("/Student/subjects"))}>
        <Tooltip title="Knowledge Domains">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Student/subjects") ? "#A855F7" : "#94A3B8" }}>
            <AssignmentIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Subjects"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Student/subjects") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Attendance */}
      <ListItemButton component={Link} to="/Student/attendance" sx={navItemStyle(isNavActive("/Student/attendance"))}>
        <Tooltip title="Attendance Analytics">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Student/attendance") ? "#A855F7" : "#94A3B8" }}>
            <ClassOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Attendance"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Student/attendance") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Complain */}
      <ListItemButton component={Link} to="/Student/complain" sx={navItemStyle(isNavActive("/Student/complain"))}>
        <Tooltip title="Ethical Oversight / Grievance">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Student/complain") ? "#A855F7" : "#94A3B8" }}>
            <AnnouncementOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Complaints"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Student/complain") ? 700 : 500, whiteSpace: "nowrap" }}
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
          Scholar Identity
        </ListSubheader>
      ) : (
        <Tooltip title="Scholar Identity" placement="right">
          <Box sx={{ height: 14, my: 0.5 }} />
        </Tooltip>
      )}

      {/* Profile */}
      <ListItemButton component={Link} to="/Student/profile" sx={navItemStyle(isNavActive("/Student/profile"))}>
        <Tooltip title="Scholar Dossier">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Student/profile") ? "#00C49F" : "#94A3B8" }}>
            <AccountCircleOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Profile"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Student/profile") ? 700 : 500, whiteSpace: "nowrap" }}
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

export default StudentSideBar;

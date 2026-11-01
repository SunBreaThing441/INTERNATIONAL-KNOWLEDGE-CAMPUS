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
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ReportIcon from "@mui/icons-material/Report";
import AssignmentIcon from "@mui/icons-material/Assignment";

const SideBar = ({ open = true }) => {
  const location = useLocation();

  const isNavActive = (path) => {
    if (path === "/" || path === "/Admin/dashboard") {
      return location.pathname === "/" || location.pathname === "/Admin/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const navItemStyle = (active) => ({
    my: 0.5,
    mx: 1,
    borderRadius: "10px",
    background: active ? "linear-gradient(135deg, rgba(0, 119, 212, 0.3) 0%, rgba(0, 163, 255, 0.15) 100%)" : "transparent",
    border: active ? "1px solid rgba(0, 163, 255, 0.4)" : "1px solid transparent",
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
            color: "#00A3FF",
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
          Academic Operations
        </ListSubheader>
      ) : (
        <Tooltip title="Academic Operations" placement="right">
          <Box sx={{ height: 14, my: 0.5 }} />
        </Tooltip>
      )}

      {/* Home / Overview */}
      <ListItemButton component={Link} to="/Admin/dashboard" sx={navItemStyle(isNavActive("/Admin/dashboard"))}>
        <Tooltip title="Overview">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Admin/dashboard") ? "#00A3FF" : "#94A3B8" }}>
            <HomeIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Overview"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Admin/dashboard") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Cohorts / Classes */}
      <ListItemButton component={Link} to="/Admin/classes" sx={navItemStyle(isNavActive("/Admin/classes"))}>
        <Tooltip title="Learning Cohorts">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Admin/classes") ? "#00A3FF" : "#94A3B8" }}>
            <ClassOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Classes"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Admin/classes") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Subjects */}
      <ListItemButton component={Link} to="/Admin/subjects" sx={navItemStyle(isNavActive("/Admin/subjects"))}>
        <Tooltip title="Knowledge Domains">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Admin/subjects") ? "#00A3FF" : "#94A3B8" }}>
            <AssignmentIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Subjects"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Admin/subjects") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Teachers / Faculty Mentors */}
      <ListItemButton component={Link} to="/Admin/teachers" sx={navItemStyle(isNavActive("/Admin/teachers"))}>
        <Tooltip title="Faculty Mentors">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Admin/teachers") ? "#00A3FF" : "#94A3B8" }}>
            <SupervisorAccountOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Faculty Mentors"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Admin/teachers") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Students / Scholars */}
      <ListItemButton component={Link} to="/Admin/students" sx={navItemStyle(isNavActive("/Admin/students"))}>
        <Tooltip title="Global Scholars">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Admin/students") ? "#00A3FF" : "#94A3B8" }}>
            <PersonOutlineIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Students"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Admin/students") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Notices */}
      <ListItemButton component={Link} to="/Admin/notices" sx={navItemStyle(isNavActive("/Admin/notices"))}>
        <Tooltip title="Global Gazettes">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Admin/notices") ? "#00A3FF" : "#94A3B8" }}>
            <AnnouncementOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Notices"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Admin/notices") ? 700 : 500, whiteSpace: "nowrap" }}
        />
      </ListItemButton>

      {/* Complains / Grievances */}
      <ListItemButton component={Link} to="/Admin/complains" sx={navItemStyle(isNavActive("/Admin/complains"))}>
        <Tooltip title="Ethical Oversight">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Admin/complains") ? "#EF4444" : "#94A3B8" }}>
            <ReportIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Complaints"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Admin/complains") ? 700 : 500, whiteSpace: "nowrap" }}
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
      <ListItemButton component={Link} to="/Admin/profile" sx={navItemStyle(isNavActive("/Admin/profile"))}>
        <Tooltip title="Profile Settings & Dossier">
          <ListItemIcon sx={{ minWidth: 40, color: isNavActive("/Admin/profile") ? "#00C49F" : "#94A3B8" }}>
            <AccountCircleOutlinedIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText
          primary="Profile"
          sx={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}
          primaryTypographyProps={{ fontSize: "0.88rem", fontWeight: isNavActive("/Admin/profile") ? 700 : 500, whiteSpace: "nowrap" }}
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

export default SideBar;

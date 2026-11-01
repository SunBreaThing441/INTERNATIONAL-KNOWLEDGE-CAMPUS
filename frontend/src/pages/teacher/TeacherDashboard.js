import { useState } from "react";
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TeacherSideBar from "./TeacherSideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Logout from "../Logout";
import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";
import StudentAttendance from "../admin/studentRelated/StudentAttendance";

import TeacherClassDetails from "./TeacherClassDetails";
import TeacherComplain from "./TeacherComplain";
import TeacherHomePage from "./TeacherHomePage";
import TeacherProfile from "./TeacherProfile";
import TeacherViewStudent from "./TeacherViewStudent";
import StudentExamMarks from "../admin/studentRelated/StudentExamMarks";

const TeacherDashboard = () => {
  // State to manage the drawer's open/close state (open by default on desktop)
  const [open, setOpen] = useState(window.innerWidth >= 960);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    // Main container for the teacher dashboard
    <>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <CssBaseline />
        <AppBar open={open} position="absolute">
          {/* Toolbar for the app bar */}
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "28px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon sx={{ color: "#00C49F" }} />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ fontWeight: 800, letterSpacing: "-0.01em", flexShrink: 0 }}
              >
                LUMINA <span style={{ color: "#00C49F" }}>ACADEMIC MENTOR</span>
              </Typography>
              <span className="lumina-badge emerald" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                Faculty Terminal
              </span>
            </Box>
            <AccountMenu />
          </Toolbar>
        </AppBar>
        <Drawer
          // Drawer component for the sidebar
          variant="permanent"
          open={open}
          sx={open ? styles.drawerStyled : styles.hideDrawer}
        >
          <Toolbar sx={styles.toolBarStyled}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          {/* Sidebar component */}
          <List component="nav">
            <TeacherSideBar open={open} />
          </List>
        </Drawer>
        {/* Main content area */}
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<TeacherHomePage />} />
            <Route path="dashboard" element={<TeacherHomePage />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="complain" element={<TeacherComplain />} />

            <Route path="class" element={<TeacherClassDetails />} />
            <Route
              path="class/student/:id"
              element={<TeacherViewStudent />}
            />

            <Route
              path="class/student/attendance/:studentID/:subjectID"
              element={<StudentAttendance situation="Subject" />}
            />
            <Route
              path="class/student/marks/:studentID/:subjectID"
              element={<StudentExamMarks situation="Subject" />}
            />

            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default TeacherDashboard;

const styles = {
  // Styles for the main content area
  boxStyled: {
    backgroundColor: "transparent",
    color: "#F8FAFC",
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  // Styles for the toolbar
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: [1],
  },
  // Styles for the drawer when it's open
  drawerStyled: {
    display: "flex",
  },
  // Styles for the drawer when it's hidden
  hideDrawer: {
    display: "flex",
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
};

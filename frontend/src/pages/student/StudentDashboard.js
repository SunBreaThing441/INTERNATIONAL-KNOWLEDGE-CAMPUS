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
import StudentSideBar from "./StudentSideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import StudentHomePage from "./StudentHomePage";
import StudentProfile from "./StudentProfile";
import StudentForm from "./StudentForm";
import StudentSubjects from "./StudentSubjects";
import ViewStdAttendance from "./ViewStdAttendance";
import StudentComplain from "./StudentComplain";
import Logout from "../Logout";
import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";

const StudentDashboard = () => {
  // State to manage the drawer's open/close state (open by default on desktop)
  const [open, setOpen] = useState(window.innerWidth >= 960);
  // Function to toggle the drawer's open/close state
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    // Main container for the student dashboard
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
              <MenuIcon sx={{ color: "#A855F7" }} />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ fontWeight: 800, letterSpacing: "-0.01em", flexShrink: 0 }}
              >
                LUMINA <span style={{ color: "#A855F7" }}>GLOBAL SCHOLAR</span>
              </Typography>
              <span className="lumina-badge" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                Open Learner Workspace
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
          <List component="nav">
            {/* Sidebar component */}
            <StudentSideBar open={open} />
          </List>
        </Drawer>
        <Box component="main" sx={styles.boxStyled}>
          {/* Main content area */}
          <Toolbar />
          <Routes>
            <Route path="/" element={<StudentHomePage />} />
            <Route path="dashboard" element={<StudentHomePage />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="form" element={<StudentForm />} />

            <Route path="subjects" element={<StudentSubjects />} />
            <Route path="attendance" element={<ViewStdAttendance />} />
            <Route path="complain" element={<StudentComplain />} />

            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default StudentDashboard;

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

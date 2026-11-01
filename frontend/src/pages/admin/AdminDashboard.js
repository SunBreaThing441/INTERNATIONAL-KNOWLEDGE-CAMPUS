/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  
  // eslint-disable-next-line no-unused-vars
  Button,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppBar, Drawer } from "../../components/styles";
import Logout from "../Logout";
import SideBar from "./SideBar";
import AdminProfile from "./AdminProfile";
import AdminHomePage from "./AdminHomePage";

import AddStudent from "./studentRelated/AddStudent";
import SeeComplains from "./studentRelated/SeeComplains";
import ShowStudents from "./studentRelated/ShowStudents";
import StudentAttendance from "./studentRelated/StudentAttendance";
import StudentExamMarks from "./studentRelated/StudentExamMarks";
import ViewStudent from "./studentRelated/ViewStudent";

import AddNotice from "./noticeRelated/AddNotice";
import ShowNotices from "./noticeRelated/ShowNotices";

import ShowSubjects from "./subjectRelated/ShowSubjects";
import SubjectForm from "./subjectRelated/SubjectForm";
import ViewSubject from "./subjectRelated/ViewSubject";

import AddTeacher from "./teacherRelated/AddTeacher";
import ChooseClass from "./teacherRelated/ChooseClass";
import ChooseSubject from "./teacherRelated/ChooseSubject";
import ShowTeachers from "./teacherRelated/ShowTeachers";
import TeacherDetails from "./teacherRelated/TeacherDetails";

import AddClass from "./classRelated/AddClass";
import ClassDetails from "./classRelated/ClassDetails";
import ShowClasses from "./classRelated/ShowClasses";
import AccountMenu from "../../components/AccountMenu";

// Define the AdminDashboard component
const AdminDashboard = () => {
  const [open, setOpen] = useState(window.innerWidth >= 960);
  const [, setHasData] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  // eslint-disable-next-line no-unused-vars
  const addData = () => {
    setHasData(true);
  };

  const removeData = () => {
    setHasData(false);
  };
  // Render the component
  return (
    <>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <CssBaseline />
        {/* App bar */}
        <AppBar open={open} position="absolute">
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
              <MenuIcon sx={{ color: "#00A3FF" }} />
            </IconButton>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ fontWeight: 800, letterSpacing: "-0.01em", flexShrink: 0 }}
              >
                LUMINA <span style={{ color: "#00C49F" }}>CHANCELLOR</span>
              </Typography>
              <span className="lumina-badge" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                UNESCO Accredited Hub
              </span>
            </Box>
            <AccountMenu />
          </Toolbar>
        </AppBar>
        {/* Drawer */}
        <Drawer
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
            <SideBar open={open} />
          </List>
        </Drawer>
        {/* Main content */}
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<AdminHomePage />} />
            <Route path="dashboard" element={<AdminHomePage />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="complains" element={<SeeComplains />} />

            {/* Notice */}
            <Route path="addnotice" element={<AddNotice />} />
            <Route path="notices" element={<ShowNotices />} />

            {/* Subject */}
            <Route path="subjects" element={<ShowSubjects />} />
            <Route
              path="subjects/subject/:classID/:subjectID"
              element={<ViewSubject />}
            />
            <Route
              path="subjects/chooseclass"
              element={<ChooseClass situation="Subject" />}
            />

            <Route path="addsubject/:id" element={<SubjectForm />} />
            <Route
              path="class/subject/:classID/:subjectID"
              element={<ViewSubject />}
            />

            <Route
              path="subject/student/attendance/:studentID/:subjectID"
              element={<StudentAttendance situation="Subject" />}
            />
            <Route
              path="subject/student/marks/:studentID/:subjectID"
              element={<StudentExamMarks situation="Subject" />}
            />

            {/* Class */}
            <Route path="addclass" element={<AddClass />} />
            <Route path="classes" element={<ShowClasses />} />
            <Route path="classes/class/:id" element={<ClassDetails />} />
            <Route
              path="class/addstudents/:id"
              element={<AddStudent situation="Class" />}
            />

            {/* Student */}
            <Route
              path="addstudents"
              element={<AddStudent situation="Student" />}
            />
            <Route path="students" element={<ShowStudents />} />
            <Route
              path="students/student/:id"
              element={<ViewStudent />}
            />
            <Route
              path="students/student/attendance/:id"
              element={<StudentAttendance situation="Student" />}
            />
            <Route
              path="students/student/marks/:id"
              element={<StudentExamMarks situation="Student" />}
            />

            {/* Teacher */}
            <Route path="teachers" element={<ShowTeachers />} />
            <Route
              path="teachers/teacher/:id"
              element={<TeacherDetails />}
            />
            <Route
              path="teachers/chooseclass"
              element={<ChooseClass situation="Teacher" />}
            />
            <Route
              path="teachers/choosesubject/:id"
              element={<ChooseSubject situation="Norm" />}
            />
            <Route
              path="teachers/choosesubject/:classID/:teacherID"
              element={<ChooseSubject situation="Teacher" />}
            />
            <Route
              path="teachers/addteacher/:id"
              element={<AddTeacher />}
            />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

// Export the component
export default AdminDashboard;

const styles = {
  boxStyled: {
    backgroundColor: "transparent",
    color: "#F8FAFC",
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    px: [1],
  },

  drawerStyled: {
    display: "flex",
  },
  
  hideDrawer: {
    display: "flex",
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
};

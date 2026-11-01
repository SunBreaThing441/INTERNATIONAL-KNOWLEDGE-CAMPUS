import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/LoginPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import ChooseUser from "./pages/ChooseUser";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  const { currentRole, currentUser } = useSelector((state) => state.user);
  const isAuthenticated = Boolean(currentUser && currentUser._id && currentRole);

  return (
    <Router>
      <Routes>
        {/* Public Discovery Experience */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${currentRole}/dashboard`} replace />
            ) : (
              <Homepage />
            )
          }
        />

        {/* Public / Guest Onboarding Portals (Guarded against authenticated cross-contamination) */}
        <Route
          path="/choose"
          element={
            <PublicRoute>
              <ChooseUser visitor="normal" />
            </PublicRoute>
          }
        />
        <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />

        <Route
          path="/Adminlogin"
          element={
            <PublicRoute>
              <LoginPage role="Admin" />
            </PublicRoute>
          }
        />
        <Route
          path="/Studentlogin"
          element={
            <PublicRoute>
              <LoginPage role="Student" />
            </PublicRoute>
          }
        />
        <Route
          path="/Teacherlogin"
          element={
            <PublicRoute>
              <LoginPage role="Teacher" />
            </PublicRoute>
          }
        />
        <Route
          path="/Adminregister"
          element={
            <PublicRoute>
              <AdminRegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Chancellor / Admin Ecosystem */}
        <Route
          path="/Admin/*"
          element={
            <ProtectedRoute allowedRoles={["Admin"]} redirectPath="/Adminlogin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Faculty / Teacher Ecosystem */}
        <Route
          path="/Teacher/*"
          element={
            <ProtectedRoute allowedRoles={["Teacher"]} redirectPath="/Teacherlogin">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Scholar / Student Ecosystem */}
        <Route
          path="/Student/*"
          element={
            <ProtectedRoute allowedRoles={["Student"]} redirectPath="/Studentlogin">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Universal Secure Session Termination */}
        <Route
          path="/logout"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Teacher", "Student"]} redirectPath="/choose">
              <Logout />
            </ProtectedRoute>
          }
        />

        {/* Global Fallback Route Guard */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to={`/${currentRole}/dashboard`} replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

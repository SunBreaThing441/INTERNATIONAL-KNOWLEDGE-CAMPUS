import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Grid,
  Box,
  Container,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { AccountBalance, Psychology, School, ArrowForward, Public } from "@mui/icons-material";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, currentRole } = useSelector((state) => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        setLoader(true);
        dispatch(loginUser({ email: "sampleadmin@gmail.com", password: "123" }, "Admin"));
      } else {
        navigate("/Adminlogin");
      }
    } else if (user === "Student") {
      if (visitor === "guest") {
        setLoader(true);
        dispatch(loginUser({ rollNum: "1", studentName: "DANIEL MUSYOKI", password: "12345" }, "Student"));
      } else {
        navigate("/Studentlogin");
      }
    } else if (user === "Teacher") {
      if (visitor === "guest") {
        setLoader(true);
        dispatch(loginUser({ email: "teacher4@gmail.com", password: "12345" }, "Teacher"));
      } else {
        navigate("/Teacherlogin");
      }
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") navigate("/Admin/dashboard");
      else if (currentRole === "Student") navigate("/Student/dashboard");
      else if (currentRole === "Teacher") navigate("/Teacher/dashboard");
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Communication Failure. Ensure Backend is active on Port 5000.");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <ShellContainer>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Public sx={{ color: "#00A3FF", fontSize: 24 }} />
            <Typography variant="overline" sx={{ color: "#00A3FF", fontWeight: 700, letterSpacing: "0.1em" }}>
              INTERNATIONAL KNOWLEDGE CAMPUS Ecosystem
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
            Choose Your <span style={{ color: "#00C49F" }}>Access Terminal</span>
          </Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8", mt: 1, maxWidth: 640, mx: "auto" }}>
            {visitor === "guest"
              ? "Instant Sandbox Mode: Select an institutional identity below to automatically authenticate with live demo credentials."
              : "Select your institutional role to authenticate into your dedicated workspace."}
          </Typography>
        </Box>

        <Grid container spacing={3.5} justifyContent="center" alignItems="stretch">
          {/* Admin Terminal */}
          <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
            <TerminalCard onClick={() => navigateHandler("Admin")}>
              <IconHalo color="#0077D4">
                <AccountBalance sx={{ fontSize: 34, color: "#00A3FF" }} />
              </IconHalo>
              <RoleTitle>Chancellor Console</RoleTitle>
              <RoleSubtitle>Institutional Governance</RoleSubtitle>
              <RoleDesc>
                Manage class cohorts, onboard faculty, oversee academic records, and configure institutional circulars.
              </RoleDesc>
              <AccessFooter color="#0077D4">
                <span>{visitor === "guest" ? "Launch Demo Chancellor" : "Enter Console"}</span>
                <ArrowForward sx={{ fontSize: 16 }} />
              </AccessFooter>
            </TerminalCard>
          </Grid>

          {/* Teacher / Faculty Terminal */}
          <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
            <TerminalCard onClick={() => navigateHandler("Teacher")}>
              <IconHalo color="#00C49F">
                <Psychology sx={{ fontSize: 34, color: "#00C49F" }} />
              </IconHalo>
              <RoleTitle>Faculty Mentor</RoleTitle>
              <RoleSubtitle>Academic Faculty & Curricula</RoleSubtitle>
              <RoleDesc>
                Conduct live classroom sessions, mark verified attendance, grade assessments, and track scholar metrics.
              </RoleDesc>
              <AccessFooter color="#00C49F">
                <span>{visitor === "guest" ? "Launch Demo Mentor" : "Enter Terminal"}</span>
                <ArrowForward sx={{ fontSize: 16 }} />
              </AccessFooter>
            </TerminalCard>
          </Grid>

          {/* Student Terminal */}
          <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
            <TerminalCard onClick={() => navigateHandler("Student")}>
              <IconHalo color="#A855F7">
                <School sx={{ fontSize: 34, color: "#A855F7" }} />
              </IconHalo>
              <RoleTitle>Global Scholar</RoleTitle>
              <RoleSubtitle>Learner Workspace & Identity</RoleSubtitle>
              <RoleDesc>
                Review enrolled syllabi, view interactive attendance gauges, inspect test marks, and submit feedback.
              </RoleDesc>
              <AccessFooter color="#A855F7">
                <span>{visitor === "guest" ? "Launch Demo Scholar" : "Enter Portal"}</span>
                <ArrowForward sx={{ fontSize: 16 }} />
              </AccessFooter>
            </TerminalCard>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Link to="/" style={{ color: "#94A3B8", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Return to Ecosystem Landing
          </Link>
        </Box>
      </Container>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
          <Typography variant="body2" sx={{ mt: 2, color: "#00A3FF", fontWeight: 600 }}>
            Provisioning Ecosystem Session...
          </Typography>
        </Box>
      </Backdrop>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </ShellContainer>
  );
};

export default ChooseUser;

const ShellContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 20px 60px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const TerminalCard = styled.div`
  background: rgba(15, 26, 58, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(0, 119, 212, 0.5);
    box-shadow: 0 20px 48px -10px rgba(0, 0, 0, 0.6), 0 0 24px rgba(0, 119, 212, 0.2);
  }
`;

const IconHalo = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: ${(props) => props.color || "#0077D4"}18;
  border: 1px solid ${(props) => props.color || "#0077D4"}40;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const RoleTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #F8FAFC;
  margin-bottom: 4px;
`;

const RoleSubtitle = styled.span`
  font-size: 0.76rem;
  font-weight: 700;
  color: #00A3FF;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
`;

const RoleDesc = styled.p`
  font-size: 0.86rem;
  line-height: 1.55;
  color: #94A3B8;
  flex-grow: 1;
  margin-bottom: 20px;
`;

const AccessFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.88rem;
  font-weight: 600;
  color: ${(props) => props.color || "#0077D4"};
`;

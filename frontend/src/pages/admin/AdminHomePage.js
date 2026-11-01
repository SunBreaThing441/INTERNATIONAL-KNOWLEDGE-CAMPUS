import React, { useEffect } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import {
  School,
  ClassOutlined,
  SupervisorAccount,
  AccountBalanceWallet,
  AddCircleOutline,
  Campaign,
  ArrowForward,
  Public,
} from "@mui/icons-material";
import styled from "styled-components";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";
import SeeNotice from "../../components/SeeNotice";
import { DarkBlueButton, BlueButton, GreenButton } from "../../components/buttonStyles";

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllStudents(adminID));
      dispatch(getAllSclasses(adminID, "Sclass"));
      dispatch(getAllTeachers(adminID));
    }
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList ? studentsList.length : 0;
  const numberOfClasses = sclassesList ? sclassesList.length : 0;
  const numberOfTeachers = teachersList ? teachersList.length : 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
      {/* Welcome Banner */}
      <WelcomeGlassCard>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <span className="lumina-badge">
                <Public sx={{ fontSize: 14 }} /> UNESCO Accredited Node
              </span>
              <span className="lumina-badge emerald">System Active</span>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              Welcome, Chancellor {currentUser?.name || "Administrator"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
              Institutional Command Center for <strong style={{ color: "#00A3FF" }}>{currentUser?.schoolName || "Academic Academy"}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Link to="/Admin/addstudents">
              <BlueButton variant="contained" size="small" startIcon={<AddCircleOutline />}>
                Enroll Scholar
              </BlueButton>
            </Link>
            <Link to="/Admin/addclass">
              <GreenButton variant="contained" size="small" startIcon={<AddCircleOutline />}>
                Create Cohort
              </GreenButton>
            </Link>
            <Link to="/Admin/addnotice">
              <DarkBlueButton variant="contained" size="small" startIcon={<Campaign />}>
                Broadcast Gazette
              </DarkBlueButton>
            </Link>
          </Box>
        </Box>
      </WelcomeGlassCard>

      {/* Primary Telemetry Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Scholars */}
        <Grid item xs={12} sm={6} md={3}>
          <TelemetryCard color="#00A3FF">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Enrolled Scholars
              </Typography>
              <IconWrapper color="#0077D4">
                <School sx={{ fontSize: 24, color: "#00A3FF" }} />
              </IconWrapper>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 1 }}>
              <CountUp start={0} end={numberOfStudents} duration={2} />
            </Typography>
            <Link to="/Admin/students" style={{ color: "#00A3FF", fontSize: "0.82rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
              View Scholar Roster <ArrowForward sx={{ fontSize: 14 }} />
            </Link>
          </TelemetryCard>
        </Grid>

        {/* Classes / Cohorts */}
        <Grid item xs={12} sm={6} md={3}>
          <TelemetryCard color="#00C49F">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Active Cohorts
              </Typography>
              <IconWrapper color="#00C49F">
                <ClassOutlined sx={{ fontSize: 24, color: "#00C49F" }} />
              </IconWrapper>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 1 }}>
              <CountUp start={0} end={numberOfClasses} duration={2} />
            </Typography>
            <Link to="/Admin/classes" style={{ color: "#00C49F", fontSize: "0.82rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Explore Cohort Standards <ArrowForward sx={{ fontSize: 14 }} />
            </Link>
          </TelemetryCard>
        </Grid>

        {/* Teachers / Mentors */}
        <Grid item xs={12} sm={6} md={3}>
          <TelemetryCard color="#A855F7">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Faculty Mentors
              </Typography>
              <IconWrapper color="#A855F7">
                <SupervisorAccount sx={{ fontSize: 24, color: "#A855F7" }} />
              </IconWrapper>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 1 }}>
              <CountUp start={0} end={numberOfTeachers} duration={2} />
            </Typography>
            <Link to="/Admin/teachers" style={{ color: "#A855F7", fontSize: "0.82rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
              Manage Faculty Roster <ArrowForward sx={{ fontSize: 14 }} />
            </Link>
          </TelemetryCard>
        </Grid>

        {/* Endowments / Fees */}
        <Grid item xs={12} sm={6} md={3}>
          <TelemetryCard color="#F59E0B">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Endowment Balance
              </Typography>
              <IconWrapper color="#F59E0B">
                <AccountBalanceWallet sx={{ fontSize: 24, color: "#F59E0B" }} />
              </IconWrapper>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 1 }}>
              <CountUp start={0} end={28500} duration={2.5} prefix="$" separator="," />
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 500 }}>
              Fiscal Year 2026 Allocated
            </Typography>
          </TelemetryCard>
        </Grid>
      </Grid>

      {/* Global Gazettes & Notices Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
              Institutional Gazettes & Dispatches
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Broadcast communications published to mentors and scholars
            </Typography>
          </Box>
          <Link to="/Admin/addnotice">
            <BlueButton size="small" variant="contained">
              + New Dispatch
            </BlueButton>
          </Link>
        </Box>

        <NoticeContainer>
          <SeeNotice />
        </NoticeContainer>
      </Box>
    </Container>
  );
};

export default AdminHomePage;

const WelcomeGlassCard = styled.div`
  background: rgba(15, 26, 58, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 28px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
`;

const TelemetryCard = styled.div`
  background: rgba(11, 19, 43, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 3px solid ${(props) => props.color || "#0077D4"};
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-4px);
    border-color: ${(props) => props.color || "#0077D4"};
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
  }
`;

const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${(props) => props.color || "#0077D4"}18;
  border: 1px solid ${(props) => props.color || "#0077D4"}40;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoticeContainer = styled.div`
  background: rgba(11, 19, 43, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  overflow: hidden;
`;

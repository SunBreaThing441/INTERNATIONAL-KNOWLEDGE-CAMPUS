import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { calculateOverallAttendancePercentage } from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import styled from "styled-components";
import SeeNotice from "../../components/SeeNotice";
import CountUp from "react-countup";
import { School, AssignmentOutlined, Public, CheckCircle, WarningAmber } from "@mui/icons-material";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";

const StudentHomePage = () => {
  const dispatch = useDispatch();

  const { userDetails, currentUser } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);

  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const classID = currentUser?.sclassName?._id;

  useEffect(() => {
    if (currentUser?._id && classID) {
      dispatch(getUserDetails(currentUser._id, "Student"));
      dispatch(getSubjectList(classID, "ClassSubjects"));
    }
  }, [dispatch, currentUser, classID]);

  const numberOfSubjects = subjectsList ? subjectsList.length : 0;

  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const isGoodAttendance = overallAttendancePercentage >= 75;

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
      {/* Welcome Banner */}
      <WelcomeCard>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <span className="lumina-badge">
                <Public sx={{ fontSize: 14 }} /> Global Scholar Workspace
              </span>
              <span className="lumina-badge emerald">Roll #{currentUser?.rollNum || "1"}</span>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              Welcome back, {currentUser?.name || "Scholar"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
              Standard: <strong style={{ color: "#00A3FF" }}>{currentUser?.sclassName?.sclassName || "Class Section"}</strong> • Institution: {currentUser?.school?.schoolName || "Accredited Knowledge Hub"}
            </Typography>
          </Box>
        </Box>
      </WelcomeCard>

      {/* Top Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Disciplines */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard color="#00A3FF">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
                Enrolled Disciplines
              </Typography>
              <IconWrapper color="#0077D4">
                <School sx={{ fontSize: 24, color: "#00A3FF" }} />
              </IconWrapper>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 0.5 }}>
              <CountUp start={0} end={numberOfSubjects} duration={2} />
            </Typography>
            <Typography variant="caption" sx={{ color: "#00A3FF", fontWeight: 600 }}>
              Active Knowledge Modules
            </Typography>
          </MetricCard>
        </Grid>

        {/* Assignments */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard color="#A855F7">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>
                Evaluations Recorded
              </Typography>
              <IconWrapper color="#A855F7">
                <AssignmentOutlined sx={{ fontSize: 24, color: "#A855F7" }} />
              </IconWrapper>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 0.5 }}>
              <CountUp start={0} end={userDetails?.examResult?.length || 0} duration={2} />
            </Typography>
            <Typography variant="caption" sx={{ color: "#A855F7", fontWeight: 600 }}>
              Graded Curriculum Milestones
            </Typography>
          </MetricCard>
        </Grid>

        {/* Attendance Donut Gauge */}
        <Grid item xs={12} md={6}>
          <ChartCard>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
                  Verified Attendance Gauge
                </Typography>
                <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                  Target Minimum: 75% for Accreditation
                </Typography>
              </Box>
              <span className={`lumina-badge ${isGoodAttendance ? "emerald" : "amber"}`}>
                {isGoodAttendance ? <CheckCircle sx={{ fontSize: 14 }} /> : <WarningAmber sx={{ fontSize: 14 }} />}
                {overallAttendancePercentage}% Rating
              </span>
            </Box>

            {subjectAttendance && subjectAttendance.length > 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CustomPieChart data={chartData} />
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4, color: "#94A3B8" }}>
                <Typography variant="body2">No Attendance Logs Established Yet</Typography>
              </Box>
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Institutional Notices */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 2 }}>
          Institutional Gazettes & Circulars
        </Typography>
        <NoticeBox>
          <SeeNotice />
        </NoticeBox>
      </Box>
    </Container>
  );
};

export default StudentHomePage;

const WelcomeCard = styled.div`
  background: rgba(15, 26, 58, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 28px;
`;

const MetricCard = styled.div`
  background: rgba(11, 19, 43, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 3px solid ${(props) => props.color || "#0077D4"};
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartCard = styled.div`
  background: rgba(11, 19, 43, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px 24px;
  height: 100%;
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

const NoticeBox = styled.div`
  background: rgba(11, 19, 43, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  overflow: hidden;
`;

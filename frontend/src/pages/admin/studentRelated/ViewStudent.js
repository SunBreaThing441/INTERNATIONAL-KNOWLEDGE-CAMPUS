import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetails, deleteUser } from "../../../redux/userRelated/userHandle";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  School,
  ArrowBack,
  Badge,
  Delete as DeleteIcon,
  CheckCircle,
  AccountBalance,
  BarChart,
  Grade,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import {
  calculateOverallAttendancePercentage,
  groupAttendanceBySubject,
} from "../../../components/attendanceCalculator";
import CustomPieChart from "../../../components/CustomPieChart";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import Popup from "../../../components/Popup";
import styled from "styled-components";

const ViewStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const { userDetails, loading } = useSelector((state) => state.user);
  const studentID = params.id;
  const address = "Student";

  const [tabValue, setTabValue] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (studentID) {
      dispatch(getUserDetails(studentID, address));
    }
  }, [dispatch, studentID]);

  const deleteHandler = () => {
    dispatch(deleteUser(studentID, address)).then(() => {
      setMessage("Scholar credentials revoked and purged.");
      setShowPopup(true);
      setTimeout(() => {
        navigate("/Admin/students");
      }, 700);
    });
  };

  const subjectAttendance = userDetails?.attendance || [];
  const examResult = userDetails?.examResult || [];

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Attended Sessions", value: overallAttendancePercentage },
    { name: "Unattended Sessions", value: overallAbsentPercentage },
  ];

  // Attendance Breakdown Table
  const attendanceColumns = [
    { id: "subName", label: "Discipline", minWidth: 160 },
    { id: "present", label: "Attended", minWidth: 100 },
    { id: "sessions", label: "Total Sessions", minWidth: 100 },
    { id: "percentage", label: "Attendance Metric", minWidth: 120 },
  ];

  const groupedAttendance = groupAttendanceBySubject(subjectAttendance);
  const attendanceRows = Object.entries(groupedAttendance).map(([subName, data], idx) => {
    const pct = Math.round((data.present / (data.sessions || 1)) * 100);
    return {
      id: idx,
      subName,
      present: `${data.present} Days`,
      sessions: `${data.sessions || 30} Total`,
      percentage: `${pct}% Rate`,
    };
  });

  // Examination Marks Table
  const markColumns = [
    { id: "subject", label: "Discipline", minWidth: 160 },
    { id: "marks", label: "Score Obtained", minWidth: 120 },
    { id: "grade", label: "Academic Standing", minWidth: 120 },
  ];

  const markRows = Array.isArray(examResult)
    ? examResult.map((res, idx) => {
        const score = Number(res.marksObtained);
        let grade = "Pass";
        if (score >= 90) grade = "High Distinction (A+)";
        else if (score >= 80) grade = "Distinction (A)";
        else if (score >= 70) grade = "Commendable (B)";
        else if (score >= 60) grade = "Satisfactory (C)";
        else if (score < 50) grade = "Remedial (F)";

        return {
          id: idx,
          subject: res.subName?.subName || "Discipline Assessment",
          marks: `${res.marksObtained}/100`,
          grade,
        };
      })
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4, mb: 6 }}>
      {/* Top Navigation */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Back to Scholar Roster
        </BackBtn>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <GreenButton
            variant="contained"
            onClick={() => navigate(`/Admin/students/student/attendance/${studentID}`)}
          >
            + Log Attendance
          </GreenButton>
          <BlueButton
            variant="contained"
            onClick={() => navigate(`/Admin/students/student/marks/${studentID}`)}
          >
            + Grade Marks
          </BlueButton>
          <Tooltip title="Revoke Scholar Credentials">
            <IconButton
              onClick={deleteHandler}
              sx={{
                color: "#EF4444",
                background: "rgba(239, 68, 68, 0.1)",
                "&:hover": { background: "rgba(239, 68, 68, 0.2)" },
              }}
            >
              <DeleteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Header Dossier */}
      {loading ? (
        <TableSkeleton rows={4} columns={3} />
      ) : (
        <>
          <HeaderCard>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "rgba(0, 119, 212, 0.25)",
                  color: "#00A3FF",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  border: "2px solid #00A3FF50",
                }}
              >
                {userDetails?.name ? String(userDetails.name).charAt(0).toUpperCase() : "S"}
              </Avatar>

              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <span className="lumina-badge cyan">
                    <CheckCircle sx={{ fontSize: 13 }} /> Enrolled Scholar
                  </span>
                  <span className="lumina-badge">Roll #{userDetails?.rollNum || "N/A"}</span>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
                  {userDetails?.name || "Global Scholar"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                  Cohort: {userDetails?.sclassName?.sclassName || "Standard Standard"} • {userDetails?.school?.schoolName || "Accredited Knowledge Hub"}
                </Typography>
              </Box>

              {/* Attendance Donut Quick Insight */}
              {subjectAttendance.length > 0 && (
                <Box sx={{ width: 140, height: 100, display: "flex", justifyContent: "center" }}>
                  <CustomPieChart data={chartData} />
                </Box>
              )}
            </Box>

            {/* Details Strip */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={3}>
                <MetricTile>
                  <Badge sx={{ fontSize: 20, color: "#00A3FF" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                      Matriculation Roll
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#F8FAFC", fontWeight: 800 }}>
                      {userDetails?.rollNum || "Unassigned"}
                    </Typography>
                  </Box>
                </MetricTile>
              </Grid>

              <Grid item xs={6} sm={3}>
                <MetricTile>
                  <School sx={{ fontSize: 20, color: "#00C49F" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                      Academic Standard
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#F8FAFC", fontWeight: 800 }}>
                      {userDetails?.sclassName?.sclassName || "Unassigned Cohort"}
                    </Typography>
                  </Box>
                </MetricTile>
              </Grid>

              <Grid item xs={6} sm={3}>
                <MetricTile>
                  <AssignmentTurnedIn sx={{ fontSize: 20, color: "#A855F7" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                      Overall Attendance
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#00C49F", fontWeight: 800 }}>
                      {overallAttendancePercentage}% Rate
                    </Typography>
                  </Box>
                </MetricTile>
              </Grid>

              <Grid item xs={6} sm={3}>
                <MetricTile>
                  <AccountBalance sx={{ fontSize: 20, color: "#F59E0B" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                      Accredited Academy
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#F8FAFC", fontWeight: 800 }}>
                      {userDetails?.school?.schoolName || "INTERNATIONAL KNOWLEDGE CAMPUS"}
                    </Typography>
                  </Box>
                </MetricTile>
              </Grid>
            </Grid>
          </HeaderCard>

          {/* Navigation Tabs */}
          <GlassTabsContainer>
            <Tabs
              value={tabValue}
              onChange={(e, val) => setTabValue(val)}
              textColor="inherit"
              sx={{
                "& .MuiTabs-indicator": { backgroundColor: "#00A3FF", height: 3 },
                "& .MuiTab-root": {
                  color: "#94A3B8",
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  "&.Mui-selected": { color: "#00A3FF" },
                },
              }}
            >
              <Tab icon={<BarChart sx={{ fontSize: 18 }} />} iconPosition="start" label="Attendance Analytics" />
              <Tab icon={<Grade sx={{ fontSize: 18 }} />} iconPosition="start" label={`Academic Scores (${markRows.length})`} />
            </Tabs>
          </GlassTabsContainer>

          {/* Tab Content */}
          {tabValue === 0 && (
            <Box sx={{ mt: 3 }}>
              {attendanceRows.length === 0 ? (
                <EmptyGlassState>
                  <AssignmentTurnedIn sx={{ fontSize: 44, color: "#00A3FF", mb: 1.5 }} />
                  <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                    No Attendance Records Registered
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5, mb: 2 }}>
                    Log daily presence for this scholar across their allocated subject disciplines.
                  </Typography>
                  <GreenButton
                    variant="contained"
                    onClick={() => navigate(`/Admin/students/student/attendance/${studentID}`)}
                  >
                    + Record First Attendance
                  </GreenButton>
                </EmptyGlassState>
              ) : (
                <TableTemplate
                  buttonHaver={() => null}
                  columns={attendanceColumns}
                  rows={attendanceRows}
                />
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 3 }}>
              {markRows.length === 0 ? (
                <EmptyGlassState>
                  <Grade sx={{ fontSize: 44, color: "#F59E0B", mb: 1.5 }} />
                  <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                    No Exam Evaluations Recorded
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5, mb: 2 }}>
                    Grade exam results and academic milestone evaluations for this student.
                  </Typography>
                  <BlueButton
                    variant="contained"
                    onClick={() => navigate(`/Admin/students/student/marks/${studentID}`)}
                  >
                    + Grade Exam Evaluation
                  </BlueButton>
                </EmptyGlassState>
              ) : (
                <TableTemplate
                  buttonHaver={() => null}
                  columns={markColumns}
                  rows={markRows}
                />
              )}
            </Box>
          )}
        </>
      )}

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default ViewStudent;

const HeaderCard = styled(Box)`
  background: rgba(13, 22, 41, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
`;

const MetricTile = styled(Box)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GlassTabsContainer = styled(Box)`
  background: rgba(13, 22, 41, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 4px 12px;
`;

const EmptyGlassState = styled(Box)`
  background: rgba(13, 22, 41, 0.6);
  backdrop-filter: blur(16px);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
`;

const BackBtn = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  &:hover {
    color: #f8fafc;
  }
`;

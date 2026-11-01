import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import {
  School,
  ArrowBack,
  Badge,
  CheckCircle,
  AccountBalance,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import { BlueButton, GreenButton } from "../../components/buttonStyles";
import { TableSkeleton } from "../../components/LuminaSkeleton";
import styled from "styled-components";

const TeacherViewStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const { currentUser, userDetails, loading } = useSelector((state) => state.user);

  const studentID = params.id;
  const address = "Student";
  const teachSubject = currentUser?.teachSubject?.subName;
  const teachSubjectID = currentUser?.teachSubject?._id;

  useEffect(() => {
    if (studentID) {
      dispatch(getUserDetails(studentID, address));
    }
  }, [dispatch, studentID]);

  const subjectAttendance = userDetails?.attendance || [];
  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const grouped = groupAttendanceBySubject(subjectAttendance);
  const teacherSubjectData = teachSubject ? grouped[teachSubject] : null;
  const teacherSubjectPercentage = teacherSubjectData
    ? calculateSubjectAttendancePercentage(teacherSubjectData.present, teacherSubjectData.sessions)
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 6 }}>
      {/* Top Navigation */}
      <Box sx={{ mb: 3 }}>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Back to Class Roster
        </BackBtn>
      </Box>

      {loading ? (
        <TableSkeleton rows={4} columns={3} />
      ) : (
        <GlassCard>
          {/* Header Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4, flexWrap: "wrap" }}>
            <Avatar
              sx={{
                width: 76,
                height: 76,
                bgcolor: "rgba(0, 196, 159, 0.2)",
                color: "#00C49F",
                fontWeight: 800,
                fontSize: "1.8rem",
                border: "2px solid rgba(0, 196, 159, 0.35)",
              }}
            >
              {userDetails?.name ? String(userDetails.name).charAt(0).toUpperCase() : "S"}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <span className="lumina-badge emerald">
                  <CheckCircle sx={{ fontSize: 13 }} /> Scholar Dossier
                </span>
                <span className="lumina-badge">Roll #{userDetails?.rollNum || "N/A"}</span>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
                {userDetails?.name || "Global Scholar"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                Cohort: {userDetails?.sclassName?.sclassName || "Academic Standard"} • {userDetails?.school?.schoolName || "Accredited Knowledge Hub"}
              </Typography>
            </Box>

            {/* Quick Actions */}
            {teachSubjectID && (
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <GreenButton
                  variant="contained"
                  onClick={() =>
                    navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)
                  }
                >
                  Log Attendance
                </GreenButton>
                <BlueButton
                  variant="contained"
                  onClick={() =>
                    navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)
                  }
                >
                  Grade Marks
                </BlueButton>
              </Box>
            )}
          </Box>

          {/* Details Grid */}
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <DetailTile>
                <Badge sx={{ fontSize: 22, color: "#00A3FF" }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                    Matriculation Identifier
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                    Roll Number: {userDetails?.rollNum || "Unassigned"}
                  </Typography>
                </Box>
              </DetailTile>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailTile>
                <School sx={{ fontSize: 22, color: "#00C49F" }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                    Academic Standard
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                    {userDetails?.sclassName?.sclassName || "Unassigned Cohort"}
                  </Typography>
                </Box>
              </DetailTile>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailTile>
                <AssignmentTurnedIn sx={{ fontSize: 22, color: "#A855F7" }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                    Attendance for {teachSubject || "Your Subject"}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#00C49F", fontWeight: 700 }}>
                    {teacherSubjectData
                      ? `${teacherSubjectData.present} Days (${teacherSubjectPercentage}%)`
                      : "No Attendance Logged"}
                  </Typography>
                </Box>
              </DetailTile>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailTile>
                <AccountBalance sx={{ fontSize: 22, color: "#F59E0B" }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                    Knowledge Hub
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                    {userDetails?.school?.schoolName || "Accredited Academy"}
                  </Typography>
                </Box>
              </DetailTile>
            </Grid>
          </Grid>

          {/* Attendance Chart */}
          {subjectAttendance.length > 0 && (
            <Box sx={{ mt: 4, p: 3, borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#F8FAFC", mb: 2 }}>
                Cumulative Attendance Gauge ({overallAttendancePercentage}% Presence)
              </Typography>
              <Box sx={{ height: 180, display: "flex", justifyContent: "center" }}>
                <CustomPieChart data={chartData} />
              </Box>
            </Box>
          )}
        </GlassCard>
      )}
    </Container>
  );
};

export default TeacherViewStudent;

const GlassCard = styled(Box)`
  background: rgba(13, 22, 41, 0.8);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 36px 32px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
`;

const DetailTile = styled(Box)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
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

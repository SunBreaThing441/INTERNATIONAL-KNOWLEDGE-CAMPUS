import React, { useEffect, useState } from "react";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  InsertChart,
  TableChart,
  CheckCircle,
  Cancel,
  School,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Container,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../components/attendanceCalculator";
import CustomPieChart from "../../components/CustomPieChart";
import CustomBarChart from "../../components/CustomBarChart";
import styled from "styled-components";
import { BlueButton } from "../../components/buttonStyles";

const ViewStdAttendance = () => {
  const dispatch = useDispatch();

  const [openStates, setOpenStates] = useState({});
  const [selectedTab, setSelectedTab] = useState("overview"); // 'overview' | 'table'

  const handleToggle = (subId) => {
    setOpenStates((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const { userDetails, currentUser, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
  }, [dispatch, currentUser]);

  const subjectAttendance = userDetails?.attendance || [];
  const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const pieData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  const subjectChartData = Object.entries(attendanceBySubject).map(
    ([subName, { present, sessions }]) => ({
      subject: subName,
      attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
      totalClasses: sessions,
      attendedClasses: present,
    })
  );

  const isEligible = overallAttendancePercentage >= 75;

  return (
    <Container maxWidth="xl" sx={{ py: 4, mb: 6 }}>
      {/* Header Banner */}
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <span className="lumina-badge">Verified Academic Audit</span>
            <span className={`lumina-badge ${isEligible ? "emerald" : "amber"}`}>
              {isEligible ? "Accreditation Compliant (≥75%)" : "Attendance Risk Alert (<75%)"}
            </span>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
            Scholar Attendance Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Real-time biometric & verified pedagogical attendance metrics for {userDetails?.name || "Scholar"}
          </Typography>
        </Box>

        {/* View Switcher Pill */}
        <ViewSwitchContainer>
          <ViewSwitchBtn
            active={selectedTab === "overview"}
            onClick={() => setSelectedTab("overview")}
          >
            <InsertChart sx={{ fontSize: 18 }} /> Visual Radar
          </ViewSwitchBtn>
          <ViewSwitchBtn
            active={selectedTab === "table"}
            onClick={() => setSelectedTab("table")}
          >
            <TableChart sx={{ fontSize: 18 }} /> Session Dossier
          </ViewSwitchBtn>
        </ViewSwitchContainer>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#00A3FF" }} />
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 2 }}>
            Synthesizing Scholar Attendance Telemetry...
          </Typography>
        </Box>
      ) : subjectAttendance.length === 0 ? (
        <EmptyCard>
          <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
            No Attendance Telemetry Recorded Yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1 }}>
            Once your academic mentors submit daily session rosters, your live progress gauges will render here.
          </Typography>
        </EmptyCard>
      ) : (
        <>
          {/* Top High-Density Metric Summary */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricBox color="#00C49F">
                <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Cumulative Attendance
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: isEligible ? "#00C49F" : "#EF4444", my: 0.5 }}>
                  {overallAttendancePercentage.toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: isEligible ? "#00C49F" : "#EF4444", fontWeight: 600 }}>
                  {isEligible ? "Complies with UNESCO standard" : "Requires attendance recovery"}
                </Typography>
              </MetricBox>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricBox color="#00A3FF">
                <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Active Subjects
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", my: 0.5 }}>
                  {Object.keys(attendanceBySubject).length}
                </Typography>
                <Typography variant="caption" sx={{ color: "#00A3FF", fontWeight: 600 }}>
                  Knowledge Domains Audited
                </Typography>
              </MetricBox>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricBox color="#A855F7">
                <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Logged Sessions
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#F8FAFC", my: 0.5 }}>
                  {subjectAttendance.length}
                </Typography>
                <Typography variant="caption" sx={{ color: "#A855F7", fontWeight: 600 }}>
                  Biometric Session Stamps
                </Typography>
              </MetricBox>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <MetricBox color="#F59E0B">
                <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Institutional Minimum
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#F59E0B", my: 0.5 }}>
                  75.0%
                </Typography>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                  Accreditation Benchmark
                </Typography>
              </MetricBox>
            </Grid>
          </Grid>

          {/* Visual Tab: Recharts Donut & Subject Bar Charts */}
          {selectedTab === "overview" && (
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={5}>
                <GlassChartCard>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 0.5 }}>
                    Session Attendance Donut Gauge
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mb: 2 }}>
                    Present (Emerald) vs Absent (Crimson) ratio
                  </Typography>
                  <CustomPieChart data={pieData} />
                </GlassChartCard>
              </Grid>

              <Grid item xs={12} md={7}>
                <GlassChartCard>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 0.5 }}>
                    Comparative Domain Performance
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mb: 2 }}>
                    Attendance percentage across enrolled knowledge areas
                  </Typography>
                  <CustomBarChart chartData={subjectChartData} dataKey="attendancePercentage" />
                </GlassChartCard>
              </Grid>
            </Grid>
          )}

          {/* Detailed Subject Breakdown Cards & Collapsible Log */}
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 2 }}>
            Domain-by-Domain Session Registers
          </Typography>

          <Grid container spacing={2.5}>
            {Object.entries(attendanceBySubject).map(
              ([subName, { present, allData, subId, sessions }], idx) => {
                const pct = calculateSubjectAttendancePercentage(present, sessions);
                const isSubGood = pct >= 75;
                const isOpen = Boolean(openStates[subId]);

                return (
                  <Grid item xs={12} key={idx}>
                    <SubjectCard isGood={isSubGood}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: "rgba(0, 119, 212, 0.15)", border: "1px solid rgba(0, 119, 212, 0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <School sx={{ fontSize: 24, color: "#00A3FF" }} />
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
                              {subName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                              Attended: <strong style={{ color: "#00C49F" }}>{present}</strong> of {sessions} Allocated Sessions
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: isSubGood ? "#00C49F" : "#EF4444" }}>
                              {pct}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: isSubGood ? "#00C49F" : "#EF4444" }}>
                              {isSubGood ? "Satisfactory" : "Under Threshold"}
                            </Typography>
                          </Box>

                          <BlueButton
                            size="small"
                            variant="contained"
                            onClick={() => handleToggle(subId)}
                            endIcon={isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          >
                            {isOpen ? "Close Logs" : "Session Logs"}
                          </BlueButton>
                        </Box>
                      </Box>

                      {/* Progress Bar */}
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(pct, 100)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: isSubGood ? "#00C49F" : "#EF4444",
                            borderRadius: 4,
                          },
                        }}
                      />

                      {/* Expandable Session Log */}
                      <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#00A3FF", mb: 1.5 }}>
                            Historical Session Audits:
                          </Typography>
                          <Grid container spacing={1.5}>
                            {allData.map((record, rIdx) => {
                              const d = new Date(record.date);
                              const dateStr = d.toString() !== "Invalid Date" ? d.toISOString().substring(0, 10) : "Recorded Date";
                              const isPres = record.status === "Present";

                              return (
                                <Grid item xs={12} sm={6} md={3} key={rIdx}>
                                  <SessionBadge isPres={isPres}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      {isPres ? <CheckCircle sx={{ fontSize: 16, color: "#00C49F" }} /> : <Cancel sx={{ fontSize: 16, color: "#EF4444" }} />}
                                      <Typography variant="body2" sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#F8FAFC" }}>
                                        {dateStr}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      label={record.status}
                                      size="small"
                                      sx={{
                                        height: 20,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        backgroundColor: isPres ? "rgba(0, 196, 159, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                        color: isPres ? "#00C49F" : "#EF4444",
                                      }}
                                    />
                                  </SessionBadge>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Box>
                      </Collapse>
                    </SubjectCard>
                  </Grid>
                );
              }
            )}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default ViewStdAttendance;

const ViewSwitchContainer = styled.div`
  display: flex;
  background: rgba(7, 13, 30, 0.7);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ViewSwitchBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.active ? "linear-gradient(135deg, #0077D4 0%, #00569E 100%)" : "transparent")};
  color: ${(props) => (props.active ? "#FFFFFF" : "#94A3B8")};
  &:hover {
    color: #F8FAFC;
  }
`;

const MetricBox = styled.div`
  background: rgba(11, 19, 43, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 3px solid ${(props) => props.color || "#0077D4"};
  border-radius: 16px;
  padding: 20px;
  height: 100%;
`;

const GlassChartCard = styled.div`
  background: rgba(15, 26, 58, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  height: 100%;
`;

const SubjectCard = styled.div`
  background: rgba(11, 19, 43, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 4px solid ${(props) => (props.isGood ? "#00C49F" : "#EF4444")};
  border-radius: 16px;
  padding: 20px 24px;
  transition: all 0.2s ease-in-out;
  &:hover {
    border-color: rgba(0, 119, 212, 0.4);
  }
`;

const SessionBadge = styled.div`
  background: rgba(7, 13, 30, 0.6);
  border: 1px solid ${(props) => (props.isPres ? "rgba(0, 196, 159, 0.3)" : "rgba(239, 68, 68, 0.3)")};
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmptyCard = styled.div`
  background: rgba(11, 19, 43, 0.6);
  backdrop-filter: blur(16px);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 60px 24px;
  text-align: center;
`;

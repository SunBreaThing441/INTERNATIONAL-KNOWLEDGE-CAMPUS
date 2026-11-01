import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import CustomBarChart from "../../components/CustomBarChart";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  InsertChart,
  TableChart,
} from "@mui/icons-material";
import styled from "styled-components";

const StudentSubjects = () => {
  const dispatch = useDispatch();

  const { userDetails, currentUser, loading } = useSelector((state) => state.user);

  const [subjectMarks, setSubjectMarks] = useState([]);
  const [selectedSection, setSelectedSection] = useState("table"); // 'table' | 'chart'

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (currentUser?.sclassName?._id && (!subjectMarks || subjectMarks.length === 0)) {
      dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
    }
  }, [subjectMarks, dispatch, currentUser]);

  const getScoreColor = (marks) => {
    const m = Number(marks);
    if (m >= 90) return { letter: "A+", color: "#00C49F" };
    if (m >= 80) return { letter: "A", color: "#00A3FF" };
    if (m >= 70) return { letter: "B", color: "#8B5CF6" };
    if (m >= 60) return { letter: "C", color: "#F59E0B" };
    return { letter: "D", color: "#EF4444" };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, mb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <span className="lumina-badge">Academic Curriculum</span>
            <span className="lumina-badge emerald">
              Cohort: {currentUser?.sclassName?.sclassName || "Standard"}
            </span>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
            Curriculum Disciplines & Evaluations
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
            Enrolled knowledge domains and verified marks for {userDetails?.name || "Scholar"}
          </Typography>
        </Box>

        <SwitchContainer>
          <SwitchBtn
            active={selectedSection === "table"}
            onClick={() => setSelectedSection("table")}
          >
            <TableChart sx={{ fontSize: 18 }} /> Evaluation Matrix
          </SwitchBtn>
          <SwitchBtn
            active={selectedSection === "chart"}
            onClick={() => setSelectedSection("chart")}
          >
            <InsertChart sx={{ fontSize: 18 }} /> Visual Graph
          </SwitchBtn>
        </SwitchContainer>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#00A3FF" }} />
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 2 }}>
            Retrieving Scholar Curriculum Dossier...
          </Typography>
        </Box>
      ) : (
        <>
          {selectedSection === "chart" ? (
            <GlassBox>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#F8FAFC", mb: 0.5 }}>
                Evaluations Performance Graph
              </Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mb: 2 }}>
                Comparative assessment scores across curriculum domains
              </Typography>
              <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
            </GlassBox>
          ) : (
            <Grid container spacing={3}>
              {subjectMarks && subjectMarks.length > 0 ? (
                subjectMarks.map((result, idx) => {
                  if (!result.subName || result.marksObtained === undefined) return null;
                  const grade = getScoreColor(result.marksObtained);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <DisciplineCard color={grade.color}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
                              {result.subName?.subName || "Discipline"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                              Course Code: {result.subName?.subCode || "CORE"}
                            </Typography>
                          </Box>
                          <GradePill color={grade.color}>{grade.letter}</GradePill>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mt: 2 }}>
                          <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                            Achieved Score
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: grade.color }}>
                              {result.marksObtained}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#94A3B8" }}>/ 100</Typography>
                          </Box>
                        </Box>
                      </DisciplineCard>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <GlassBox sx={{ textAlign: "center", py: 6 }}>
                    <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                      No Examination Marks Published Yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1 }}>
                      Your academic mentors have not yet recorded assessment evaluations for this cohort.
                    </Typography>
                  </GlassBox>
                </Grid>
              )}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default StudentSubjects;

const SwitchContainer = styled.div`
  display: flex;
  background: rgba(7, 13, 30, 0.7);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SwitchBtn = styled.button`
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

const GlassBox = styled.div`
  background: rgba(15, 26, 58, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px;
`;

const DisciplineCard = styled.div`
  background: rgba(11, 19, 43, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 3px solid ${(props) => props.color || "#0077D4"};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  &:hover {
    transform: translateY(-3px);
    border-color: ${(props) => props.color || "#0077D4"};
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
  }
`;

const GradePill = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${(props) => props.color || "#0077D4"}20;
  border: 1.5px solid ${(props) => props.color || "#0077D4"};
  color: ${(props) => props.color || "#FFFFFF"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
`;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getClassStudents,
  getSubjectDetails,
} from "../../../redux/sclassRelated/sclassHandle";
import {
  Box,
  Container,
  Typography,
  Grid,
} from "@mui/material";
import {
  MenuBook,
  ArrowBack,
  Person,
  School,
  EventNote,
  InsertChart,
  TableChart,
} from "@mui/icons-material";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import styled from "styled-components";

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const { subloading, subjectDetails, sclassStudents, getresponse } =
    useSelector((state) => state.sclass);

  const { classID, subjectID } = params;
  const [selectedSection, setSelectedSection] = useState("attendance"); // 'attendance' | 'marks'

  useEffect(() => {
    if (subjectID && classID) {
      dispatch(getSubjectDetails(subjectID, "Subject"));
      dispatch(getClassStudents(classID));
    }
  }, [dispatch, subjectID, classID]);

  const studentColumns = [
    { id: "rollNum", label: "Roll No.", minWidth: 100 },
    { id: "name", label: "Scholar Name", minWidth: 200 },
  ];

  const studentRows =
    Array.isArray(sclassStudents) && sclassStudents.length > 0
      ? sclassStudents.map((student) => ({
          rollNum: student.rollNum,
          name: student.name,
          id: student._id,
        }))
      : [];

  const AttendanceButtonHaver = ({ row }) => (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      <BlueButton
        size="small"
        variant="contained"
        onClick={() => navigate("/Admin/students/student/" + row.id)}
      >
        Dossier
      </BlueButton>
      <GreenButton
        size="small"
        variant="contained"
        onClick={() =>
          navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
        }
      >
        Record Attendance
      </GreenButton>
    </Box>
  );

  const MarksButtonHaver = ({ row }) => (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      <BlueButton
        size="small"
        variant="contained"
        onClick={() => navigate("/Admin/students/student/" + row.id)}
      >
        Dossier
      </BlueButton>
      <BlueButton
        size="small"
        variant="contained"
        onClick={() =>
          navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)
        }
      >
        Grade Evaluation
      </BlueButton>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, mb: 6 }}>
      {/* Top Navigation */}
      <Box sx={{ mb: 3 }}>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Back to Curriculum
        </BackBtn>
      </Box>

      {/* Header Dossier */}
      <HeaderCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap" }}>
          <IconWrapper>
            <MenuBook sx={{ fontSize: 32, color: "#00C49F" }} />
          </IconWrapper>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge emerald">Discipline Syllabus</span>
              <span className="lumina-badge">Code: {subjectDetails?.subCode || "N/A"}</span>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              {subjectDetails?.subName || "Curriculum Subject Details"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Allocated Cohort: {subjectDetails?.sclassName?.sclassName || "Unassigned"} • Scheduled Sessions: {subjectDetails?.sessions || 30}
            </Typography>
          </Box>

          {!subjectDetails?.teacher && (
            <GreenButton
              variant="contained"
              onClick={() =>
                navigate(`/Admin/teachers/addteacher/${subjectDetails?._id}`)
              }
            >
              + Appoint Faculty Mentor
            </GreenButton>
          )}
        </Box>

        {/* Details Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <DetailTile>
              <Person sx={{ fontSize: 20, color: "#00A3FF" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                  Appointed Instructor
                </Typography>
                <Typography variant="body2" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                  {subjectDetails?.teacher?.name || "Unassigned Instructor"}
                </Typography>
              </Box>
            </DetailTile>
          </Grid>

          <Grid item xs={6} sm={4}>
            <DetailTile>
              <School sx={{ fontSize: 20, color: "#00C49F" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                  Enrolled Scholars
                </Typography>
                <Typography variant="body2" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                  {studentRows.length} Enrollees
                </Typography>
              </Box>
            </DetailTile>
          </Grid>

          <Grid item xs={6} sm={4}>
            <DetailTile>
              <EventNote sx={{ fontSize: 20, color: "#A855F7" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                  Sessions Planned
                </Typography>
                <Typography variant="body2" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                  {subjectDetails?.sessions || 30} Semester Hours
                </Typography>
              </Box>
            </DetailTile>
          </Grid>
        </Grid>
      </HeaderCard>

      {/* Switcher & Data Table */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
          Cohort Scholar Roster & Operations
        </Typography>

        <SwitchContainer>
          <SwitchBtn
            active={selectedSection === "attendance"}
            onClick={() => setSelectedSection("attendance")}
          >
            <TableChart sx={{ fontSize: 18 }} /> Attendance Logging
          </SwitchBtn>
          <SwitchBtn
            active={selectedSection === "marks"}
            onClick={() => setSelectedSection("marks")}
          >
            <InsertChart sx={{ fontSize: 18 }} /> Evaluation Grading
          </SwitchBtn>
        </SwitchContainer>
      </Box>

      {subloading ? (
        <TableSkeleton rows={5} columns={3} />
      ) : getresponse || studentRows.length === 0 ? (
        <EmptyGlassCard>
          <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
            No Scholars Enrolled in This Subject Cohort
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5, mb: 2 }}>
            Admit students into this academic cohort to begin recording attendance and grading exam results.
          </Typography>
          <GreenButton
            variant="contained"
            onClick={() => navigate(`/Admin/class/addstudents/${classID}`)}
          >
            + Admit Scholar to Cohort
          </GreenButton>
        </EmptyGlassCard>
      ) : (
        <TableTemplate
          buttonHaver={selectedSection === "attendance" ? AttendanceButtonHaver : MarksButtonHaver}
          columns={studentColumns}
          rows={studentRows}
        />
      )}
    </Container>
  );
};

export default ViewSubject;

const HeaderCard = styled(Box)`
  background: rgba(13, 22, 41, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
`;

const IconWrapper = styled(Box)`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: rgba(0, 196, 159, 0.12);
  border: 1px solid rgba(0, 196, 159, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DetailTile = styled(Box)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SwitchContainer = styled(Box)`
  display: flex;
  background: rgba(13, 22, 41, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
`;

const SwitchBtn = styled.button`
  background: ${(props) => (props.active ? "rgba(0, 163, 255, 0.18)" : "transparent")};
  border: ${(props) => (props.active ? "1px solid rgba(0, 163, 255, 0.35)" : "1px solid transparent")};
  color: ${(props) => (props.active ? "#00A3FF" : "#94A3B8")};
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #f8fafc;
  }
`;

const EmptyGlassCard = styled(Box)`
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

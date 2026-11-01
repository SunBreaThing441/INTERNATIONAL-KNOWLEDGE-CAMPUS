import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import {
  Box,
  Typography,
  Container,
} from "@mui/material";
import { School, People } from "@mui/icons-material";
import { BlueButton, GreenButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { TableSkeleton } from "../../components/LuminaSkeleton";
import styled from "styled-components";

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassStudents, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );

  const { currentUser } = useSelector((state) => state.user);
  const classID = currentUser?.teachSclass?._id;
  const subjectID = currentUser?.teachSubject?._id;
  const sclassName = currentUser?.teachSclass?.sclassName || "Assigned Cohort";
  const subjectName = currentUser?.teachSubject?.subName || "General Discipline";

  useEffect(() => {
    if (classID) {
      dispatch(getClassStudents(classID));
    }
  }, [dispatch, classID]);

  if (error) {
    console.error(error);
  }

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

  const StudentsButtonHaver = ({ row }) => (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      <BlueButton
        size="small"
        variant="contained"
        onClick={() => navigate(`/Teacher/class/student/${row.id}`)}
      >
        Dossier
      </BlueButton>

      {subjectID && (
        <>
          <GreenButton
            size="small"
            variant="contained"
            onClick={() =>
              navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`)
            }
          >
            Attendance
          </GreenButton>
          <BlueButton
            size="small"
            variant="contained"
            onClick={() =>
              navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`)
            }
          >
            Grade
          </BlueButton>
        </>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, mb: 6 }}>
      {/* Header Banner */}
      <HeaderCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap" }}>
          <IconWrapper>
            <School sx={{ fontSize: 32, color: "#00C49F" }} />
          </IconWrapper>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge emerald">Classroom Roster</span>
              <span className="lumina-badge">Cohort: {sclassName}</span>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              Academic Cohort Roster: {sclassName}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Facilitator Discipline: {subjectName} • Active Enrollees: {studentRows.length}
            </Typography>
          </Box>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={5} columns={3} />
      ) : getresponse || studentRows.length === 0 ? (
        <EmptyGlassCard>
          <People sx={{ fontSize: 44, color: "#00C49F", mb: 1.5 }} />
          <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
            No Scholars Enrolled in This Cohort
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
            Students will automatically appear here once allocated by the Chancellor.
          </Typography>
        </EmptyGlassCard>
      ) : (
        <TableTemplate
          buttonHaver={StudentsButtonHaver}
          columns={studentColumns}
          rows={studentRows}
        />
      )}
    </Container>
  );
};

export default TeacherClassDetails;

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

const EmptyGlassCard = styled(Box)`
  background: rgba(13, 22, 41, 0.6);
  backdrop-filter: blur(16px);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
`;

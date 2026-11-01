import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getClassDetails,
  getClassStudents,
  getSubjectList,
} from "../../../redux/sclassRelated/sclassHandle";
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import {
  Box,
  Container,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Grid,
} from "@mui/material";
import {
  School,
  MenuBook,
  People,
  Delete as DeleteIcon,
  PersonRemove,
  ArrowBack,
  AutoStories,
  PersonAdd,
} from "@mui/icons-material";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import Popup from "../../../components/Popup";
import styled from "styled-components";

const ClassDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    subjectsList,
    sclassStudents,
    sclassDetails,
    loading,
    getresponse,
  } = useSelector((state) => state.sclass);

  const classID = params.id;
  const [tabValue, setTabValue] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (classID) {
      dispatch(getClassDetails(classID, "Sclass"));
      dispatch(getSubjectList(classID, "ClassSubjects"));
      dispatch(getClassStudents(classID));
    }
  }, [dispatch, classID]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Cascading deletion with dynamic state re-fetch
  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      setMessage(`Record removed from cohort registry.`);
      setShowPopup(true);
      dispatch(getClassStudents(classID));
      dispatch(resetSubjects());
      dispatch(getSubjectList(classID, "ClassSubjects"));
      dispatch(getClassDetails(classID, "Sclass"));
    });
  };

  // Subjects Section Data
  const subjectColumns = [
    { id: "name", label: "Discipline / Subject", minWidth: 200 },
    { id: "code", label: "Curriculum Code", minWidth: 140 },
    { id: "sessions", label: "Sessions", minWidth: 100 },
  ];

  const subjectRows =
    Array.isArray(subjectsList) && subjectsList.length > 0
      ? subjectsList.map((subject) => ({
          name: subject.subName,
          code: subject.subCode,
          sessions: subject.sessions || 30,
          id: subject._id,
        }))
      : [];

  const SubjectsButtonHaver = ({ row }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
      <BlueButton
        size="small"
        variant="contained"
        onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}
      >
        Inspect
      </BlueButton>
      <IconButton
        size="small"
        onClick={() => deleteHandler(row.id, "Subject")}
        sx={{
          color: "#EF4444",
          background: "rgba(239, 68, 68, 0.1)",
          "&:hover": { background: "rgba(239, 68, 68, 0.2)" },
        }}
      >
        <DeleteIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );

  // Students Section Data
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
      <BlueButton
        size="small"
        variant="contained"
        onClick={() => navigate(`/Admin/students/student/${row.id}`)}
      >
        Profile
      </BlueButton>
      <BlueButton
        size="small"
        variant="contained"
        onClick={() => navigate(`/Admin/students/student/attendance/${row.id}`)}
        sx={{ background: "rgba(168, 85, 247, 0.8) !important" }}
      >
        Attendance
      </BlueButton>
      <IconButton
        size="small"
        onClick={() => deleteHandler(row.id, "Student")}
        sx={{
          color: "#EF4444",
          background: "rgba(239, 68, 68, 0.1)",
          "&:hover": { background: "rgba(239, 68, 68, 0.2)" },
        }}
      >
        <PersonRemove sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, mb: 6 }}>
      {/* Top Breadcrumb & Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Back to Cohorts
        </BackBtn>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <GreenButton
            variant="contained"
            onClick={() => navigate(`/Admin/addsubject/${classID}`)}
          >
            + Allocate Subject
          </GreenButton>
          <BlueButton
            variant="contained"
            onClick={() => navigate(`/Admin/class/addstudents/${classID}`)}
          >
            + Admit Scholar
          </BlueButton>
        </Box>
      </Box>

      {/* Cohort Header Dossier */}
      <HeaderCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexWrap: "wrap" }}>
          <IconWrapper>
            <School sx={{ fontSize: 32, color: "#00A3FF" }} />
          </IconWrapper>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge cyan">UNESCO Standard 4.1</span>
              <span className="lumina-badge">Academic Cohort</span>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              {sclassDetails?.sclassName || "Academic Cohort Dossier"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Standardized curriculum track • ID: {classID}
            </Typography>
          </Box>
        </Box>

        {/* Live Metrics Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={3}>
            <MetricTile>
              <People sx={{ fontSize: 20, color: "#00A3FF" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                  Enrolled Scholars
                </Typography>
                <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 800 }}>
                  {studentRows.length}
                </Typography>
              </Box>
            </MetricTile>
          </Grid>
          <Grid item xs={6} sm={3}>
            <MetricTile>
              <MenuBook sx={{ fontSize: 20, color: "#00C49F" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                  Active Subjects
                </Typography>
                <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 800 }}>
                  {subjectRows.length}
                </Typography>
              </Box>
            </MetricTile>
          </Grid>
        </Grid>
      </HeaderCard>

      {/* Tabs */}
      <GlassTabsContainer>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
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
          <Tab icon={<AutoStories sx={{ fontSize: 18 }} />} iconPosition="start" label={`Curriculum Disciplines (${subjectRows.length})`} />
          <Tab icon={<People sx={{ fontSize: 18 }} />} iconPosition="start" label={`Scholar Roster (${studentRows.length})`} />
        </Tabs>
      </GlassTabsContainer>

      {/* Tab Panels */}
      {loading ? (
        <TableSkeleton rows={4} columns={3} />
      ) : (
        <>
          {tabValue === 0 && (
            <Box sx={{ mt: 3 }}>
              {subjectRows.length === 0 ? (
                <EmptyGlassState>
                  <AutoStories sx={{ fontSize: 44, color: "#00C49F", mb: 1.5 }} />
                  <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                    No Academic Disciplines Allocated
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5, mb: 2 }}>
                    Add core curriculum subjects, assign course codes, and scheduled teaching sessions.
                  </Typography>
                  <GreenButton variant="contained" onClick={() => navigate(`/Admin/addsubject/${classID}`)}>
                    + Allocate First Subject
                  </GreenButton>
                </EmptyGlassState>
              ) : (
                <TableTemplate
                  buttonHaver={SubjectsButtonHaver}
                  columns={subjectColumns}
                  rows={subjectRows}
                />
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 3 }}>
              {getresponse || studentRows.length === 0 ? (
                <EmptyGlassState>
                  <PersonAdd sx={{ fontSize: 44, color: "#00A3FF", mb: 1.5 }} />
                  <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                    No Scholars Enrolled in Cohort
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5, mb: 2 }}>
                    Admit students directly into this cohort to begin tracking attendance and academic records.
                  </Typography>
                  <BlueButton variant="contained" onClick={() => navigate(`/Admin/class/addstudents/${classID}`)}>
                    + Admit First Scholar
                  </BlueButton>
                </EmptyGlassState>
              ) : (
                <TableTemplate
                  buttonHaver={StudentsButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
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

export default ClassDetails;

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
  background: rgba(0, 163, 255, 0.12);
  border: 1px solid rgba(0, 163, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
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

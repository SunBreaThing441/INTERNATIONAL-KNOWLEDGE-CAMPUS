import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherFreeClassSubjects } from "../../../redux/sclassRelated/sclassHandle";
import { updateTeachSubject } from "../../../redux/teacherRelated/teacherHandle";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { MenuBook, ArrowBack } from "@mui/icons-material";
import { GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import Popup from "../../../components/Popup";
import styled from "styled-components";

const ChooseSubject = ({ situation }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [classID, setClassID] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const { subjectsList, loading, response } = useSelector(
    (state) => state.sclass
  );

  useEffect(() => {
    if (situation === "Norm") {
      setClassID(params.id);
      dispatch(getTeacherFreeClassSubjects(params.id));
    } else if (situation === "Teacher") {
      const { classID: cId, teacherID: tId } = params;
      setClassID(cId);
      setTeacherID(tId);
      dispatch(getTeacherFreeClassSubjects(cId));
    }
  }, [situation, params, dispatch]);

  const updateSubjectHandler = (teachId, teachSubject) => {
    setLoader(true);
    dispatch(updateTeachSubject(teachId, teachSubject)).then(() => {
      setMessage("Discipline assigned to faculty mentor successfully.");
      setShowPopup(true);
      setTimeout(() => {
        navigate("/Admin/teachers");
      }, 700);
    });
  };

  const subjectColumns = [
    { id: "subName", label: "Discipline Name", minWidth: 200 },
    { id: "subCode", label: "Curriculum Code", minWidth: 140 },
  ];

  const subjectRows =
    Array.isArray(subjectsList) && subjectsList.length > 0
      ? subjectsList.map((subject) => ({
          subName: subject.subName,
          subCode: subject.subCode,
          id: subject._id,
        }))
      : [];

  const SubjectButtonHaver = ({ row }) => (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {situation === "Norm" ? (
        <GreenButton
          size="small"
          variant="contained"
          onClick={() => navigate(`/Admin/teachers/addteacher/${row.id}`)}
        >
          Assign to New Mentor
        </GreenButton>
      ) : (
        <GreenButton
          size="small"
          variant="contained"
          disabled={loader}
          onClick={() => updateSubjectHandler(teacherID, row.id)}
        >
          {loader ? <CircularProgress size={18} color="inherit" /> : "Assign to Mentor"}
        </GreenButton>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Go Back
        </BackBtn>
      </Box>

      <HeaderCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconWrapper>
            <MenuBook sx={{ fontSize: 28, color: "#00C49F" }} />
          </IconWrapper>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge emerald">Faculty Allocation</span>
              <span className="lumina-badge">Step 2: Unallocated Disciplines</span>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              Select Unassigned Curriculum Discipline
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Choose from available subjects in this cohort requiring instructor assignment.
            </Typography>
          </Box>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={4} columns={3} />
      ) : response || subjectRows.length === 0 ? (
        <EmptyGlassCard>
          <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
            All Subjects in This Cohort Have Mentors Assigned
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5, mb: 2 }}>
            No unassigned subjects remain. You can allocate a new subject discipline to this cohort first.
          </Typography>
          <GreenButton
            variant="contained"
            onClick={() => navigate(`/Admin/addsubject/${classID}`)}
          >
            + Allocate New Subject
          </GreenButton>
        </EmptyGlassCard>
      ) : (
        <TableTemplate
          buttonHaver={SubjectButtonHaver}
          columns={subjectColumns}
          rows={subjectRows}
        />
      )}

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default ChooseSubject;

const HeaderCard = styled(Box)`
  background: rgba(13, 22, 41, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const IconWrapper = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 14px;
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

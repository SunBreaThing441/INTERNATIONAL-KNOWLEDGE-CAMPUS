import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails } from "../../../redux/userRelated/userHandle";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { updateStudentFields } from "../../../redux/studentRelated/studentHandle";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Slider,
} from "@mui/material";
import {
  ArrowBack,
  Save,
} from "@mui/icons-material";
import styled from "styled-components";
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";

const StudentExamMarks = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { currentUser, userDetails, loading } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);
  const { response, error, statestatus } = useSelector((state) => state.student);

  const [studentID, setStudentID] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [chosenSubName, setChosenSubName] = useState("");
  const [marksObtained, setMarksObtained] = useState(75);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (situation === "Student") {
      setStudentID(params.id);
      dispatch(getUserDetails(params.id, "Student"));
    } else if (situation === "Subject") {
      const { studentID: sId, subjectID: subId } = params;
      setStudentID(sId);
      dispatch(getUserDetails(sId, "Student"));
      setChosenSubName(subId);
    }
  }, [situation, params, dispatch]);

  useEffect(() => {
    if (userDetails && userDetails.sclassName && situation === "Student") {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails, situation]);

  const changeSubjectHandler = (event) => {
    const selected = subjectsList?.find((sub) => sub.subName === event.target.value);
    if (selected) {
      setSubjectName(selected.subName);
      setChosenSubName(selected._id);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!chosenSubName) {
      setMessage("Please select an academic subject.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    const fields = { subName: chosenSubName, marksObtained: Number(marksObtained) };
    dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"));
  };

  useEffect(() => {
    if (response) {
      setLoader(false);
      setShowPopup(true);
      setMessage(response);
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage("Network Communication Error");
    } else if (statestatus === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Evaluation Score Recorded Successfully");
    }
  }, [response, statestatus, error]);

  // Compute grade rubric dynamically
  const getGradeTier = (score) => {
    const num = Number(score);
    if (num >= 90) return { letter: "A+", desc: "High Distinction", color: "#00C49F" };
    if (num >= 80) return { letter: "A", desc: "Distinction", color: "#00A3FF" };
    if (num >= 70) return { letter: "B", desc: "Commendable", color: "#8B5CF6" };
    if (num >= 60) return { letter: "C", desc: "Satisfactory", color: "#F59E0B" };
    if (num >= 50) return { letter: "D", desc: "Pass Threshold", color: "#EAB308" };
    return { letter: "F", desc: "Remedial Required", color: "#EF4444" };
  };

  const gradeInfo = getGradeTier(marksObtained);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "none",
            color: "#94A3B8",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
          }}
        >
          <ArrowBack sx={{ fontSize: 16 }} /> Back to Roster
        </button>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#00A3FF" }} />
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 2 }}>
            Loading Academic Assessment Dossier...
          </Typography>
        </Box>
      ) : (
        <TerminalCard>
          {/* Header */}
          <Box sx={{ pb: 3, mb: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <span className="lumina-badge">Academic Assessment Terminal</span>
                <span className="lumina-badge emerald">Roll #{userDetails?.rollNum || "—"}</span>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
                {userDetails?.name || "Scholar Name"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
                Cohort: <strong style={{ color: "#00A3FF" }}>{userDetails?.sclassName?.sclassName || "Standard"}</strong> • School: {userDetails?.school?.schoolName || "Accredited Center"}
              </Typography>
            </Box>

            {currentUser?.teachSubject && (
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", display: "block" }}>
                  Discipline Evaluated
                </Typography>
                <Chip
                  label={currentUser.teachSubject?.subName}
                  sx={{
                    backgroundColor: "rgba(0, 196, 159, 0.18)",
                    color: "#00C49F",
                    border: "1px solid rgba(0, 196, 159, 0.4)",
                    fontWeight: 700,
                  }}
                />
              </Box>
            )}
          </Box>

          <form onSubmit={submitHandler}>
            {situation === "Student" && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1, fontWeight: 700 }}>
                  Select Knowledge Domain / Subject:
                </Typography>
                <GlassSelect fullWidth>
                  <InputLabel id="sub-marks-label" sx={{ color: "#94A3B8" }}>
                    Select Subject
                  </InputLabel>
                  <Select
                    labelId="sub-marks-label"
                    value={subjectName}
                    onChange={changeSubjectHandler}
                    label="Select Subject"
                    required
                  >
                    {subjectsList?.map((sub, idx) => (
                      <MenuItem key={idx} value={sub.subName}>
                        {sub.subName} ({sub.subCode || "Core"})
                      </MenuItem>
                    ))}
                  </Select>
                </GlassSelect>
              </Box>
            )}

            {/* Interactive Score Matrix Card */}
            <ScoreMatrixCard color={gradeInfo.color}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                    Calculated Proficiency Rating
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
                    {gradeInfo.desc}
                  </Typography>
                </Box>
                <GradeBadge color={gradeInfo.color}>
                  {gradeInfo.letter}
                </GradeBadge>
              </Box>

              <Box sx={{ px: 2, py: 1 }}>
                <Slider
                  value={Number(marksObtained)}
                  onChange={(e, val) => setMarksObtained(val)}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  sx={{
                    color: gradeInfo.color,
                    "& .MuiSlider-thumb": {
                      boxShadow: `0 0 16px ${gradeInfo.color}`,
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                <Typography variant="caption" sx={{ color: "#94A3B8" }}>0 (Minimum)</Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: gradeInfo.color }}>
                    {marksObtained}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94A3B8" }}>/ 100</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#94A3B8" }}>100 (Maximum)</Typography>
              </Box>
            </ScoreMatrixCard>

            <Box sx={{ mb: 4 }}>
              <GlassInput
                fullWidth
                label="Direct Numerical Marks (0 - 100)"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                value={marksObtained}
                onChange={(e) => setMarksObtained(e.target.value)}
                required
              />
            </Box>

            <BlueButton
              fullWidth
              size="large"
              type="submit"
              disabled={loader}
              startIcon={loader ? null : <Save />}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              {loader ? <CircularProgress size={24} sx={{ color: "#FFFFFF" }} /> : "Record Evaluation Score"}
            </BlueButton>
          </form>
        </TerminalCard>
      )}

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default StudentExamMarks;

const TerminalCard = styled.div`
  background: rgba(15, 26, 58, 0.75);
  backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.55), 0 0 24px rgba(0, 119, 212, 0.12);
`;

const ScoreMatrixCard = styled.div`
  background: rgba(7, 13, 30, 0.65);
  border: 1px solid ${(props) => props.color || "#0077D4"}40;
  border-left: 4px solid ${(props) => props.color || "#0077D4"};
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
`;

const GradeBadge = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${(props) => props.color || "#0077D4"}20;
  border: 2px solid ${(props) => props.color || "#0077D4"};
  color: ${(props) => props.color || "#FFFFFF"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 800;
  box-shadow: 0 0 18px ${(props) => props.color || "#0077D4"}30;
`;

const GlassInput = styled(TextField)`
  && {
    .MuiInputLabel-root {
      color: #94A3B8;
    }
    .MuiOutlinedInput-root {
      background: rgba(7, 13, 30, 0.55);
      border-radius: 12px;
      color: #F8FAFC;
      fieldset {
        border-color: rgba(255, 255, 255, 0.12);
      }
      &:hover fieldset {
        border-color: rgba(0, 119, 212, 0.45);
      }
      &.Mui-focused fieldset {
        border-color: #00A3FF;
      }
    }
  }
`;

const GlassSelect = styled(FormControl)`
  && {
    .MuiOutlinedInput-root {
      background: rgba(7, 13, 30, 0.55);
      border-radius: 12px;
      color: #F8FAFC;
      fieldset {
        border-color: rgba(255, 255, 255, 0.12);
      }
      &:hover fieldset {
        border-color: rgba(0, 119, 212, 0.45);
      }
      &.Mui-focused fieldset {
        border-color: #00A3FF;
      }
    }
    .MuiSvgIcon-root {
      color: #00A3FF;
    }
  }
`;

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
  Grid,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  ArrowBack,
  Save,
} from "@mui/icons-material";
import styled from "styled-components";
import { GreenButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";

const StudentAttendance = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { currentUser, userDetails, loading } = useSelector((state) => state.user);
  const { subjectsList } = useSelector((state) => state.sclass);
  const { response, error, statestatus } = useSelector((state) => state.student);

  const [studentID, setStudentID] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [chosenSubName, setChosenSubName] = useState("");
  const [status, setStatus] = useState("Present");
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));

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
    const fields = { subName: chosenSubName, status, date };
    dispatch(updateStudentFields(studentID, fields, "StudentAttendance"));
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
      setMessage("Attendance Logged Successfully");
    }
  }, [response, statestatus, error]);

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
            Retrieving Scholar Dossier...
          </Typography>
        </Box>
      ) : (
        <TerminalCard>
          {/* Header Banner */}
          <Box sx={{ pb: 3, mb: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <span className="lumina-badge emerald">Verified Attendance Terminal</span>
                <span className="lumina-badge">Roll #{userDetails?.rollNum || "—"}</span>
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
                  Active Discipline
                </Typography>
                <Chip
                  label={currentUser.teachSubject?.subName}
                  sx={{
                    backgroundColor: "rgba(0, 119, 212, 0.2)",
                    color: "#00A3FF",
                    border: "1px solid rgba(0, 119, 212, 0.4)",
                    fontWeight: 700,
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Attendance Form */}
          <form onSubmit={submitHandler}>
            {/* Subject Selector if in Student mode */}
            {situation === "Student" && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1, fontWeight: 700 }}>
                  Select Knowledge Domain / Subject:
                </Typography>
                <GlassSelect fullWidth>
                  <InputLabel id="sub-select-label" sx={{ color: "#94A3B8" }}>
                    Select Subject
                  </InputLabel>
                  <Select
                    labelId="sub-select-label"
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

            {/* Date Input */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1, fontWeight: 700 }}>
                Session Date:
              </Typography>
              <GlassInput
                fullWidth
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Attendance Status Selector Toggle Cards */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1.5, fontWeight: 700 }}>
                Record Attendance State:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <StatusCard
                    selected={status === "Present"}
                    type="Present"
                    onClick={() => setStatus("Present")}
                  >
                    <CheckCircle sx={{ fontSize: 32, color: status === "Present" ? "#00C49F" : "#64748B" }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, mt: 1, color: status === "Present" ? "#FFFFFF" : "#94A3B8" }}>
                      PRESENT
                    </Typography>
                    <Typography variant="caption" sx={{ color: status === "Present" ? "#00C49F" : "#64748B" }}>
                      Active Engagement Logged
                    </Typography>
                  </StatusCard>
                </Grid>

                <Grid item xs={6}>
                  <StatusCard
                    selected={status === "Absent"}
                    type="Absent"
                    onClick={() => setStatus("Absent")}
                  >
                    <Cancel sx={{ fontSize: 32, color: status === "Absent" ? "#EF4444" : "#64748B" }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, mt: 1, color: status === "Absent" ? "#FFFFFF" : "#94A3B8" }}>
                      ABSENT
                    </Typography>
                    <Typography variant="caption" sx={{ color: status === "Absent" ? "#EF4444" : "#64748B" }}>
                      Unexcused Absence Recorded
                    </Typography>
                  </StatusCard>
                </Grid>
              </Grid>
            </Box>

            {/* Submit Action */}
            <GreenButton
              fullWidth
              size="large"
              type="submit"
              disabled={loader}
              startIcon={loader ? null : <Save />}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              {loader ? <CircularProgress size={24} sx={{ color: "#FFFFFF" }} /> : "Commit Attendance Log"}
            </GreenButton>
          </form>
        </TerminalCard>
      )}

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default StudentAttendance;

const TerminalCard = styled.div`
  background: rgba(15, 26, 58, 0.75);
  backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.55), 0 0 24px rgba(0, 119, 212, 0.12);
`;

const StatusCard = styled.div`
  background: ${(props) =>
    props.selected
      ? props.type === "Present"
        ? "linear-gradient(135deg, rgba(0, 196, 159, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)"
        : "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.15) 100%)"
      : "rgba(7, 13, 30, 0.55)"};
  border: 2px solid
    ${(props) =>
      props.selected
        ? props.type === "Present"
          ? "#00C49F"
          : "#EF4444"
        : "rgba(255, 255, 255, 0.08)"};
  border-radius: 16px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${(props) =>
    props.selected
      ? props.type === "Present"
        ? "0 8px 24px rgba(0, 196, 159, 0.35)"
        : "0 8px 24px rgba(239, 68, 68, 0.35)"
      : "none"};

  &:hover {
    transform: translateY(-2px);
    border-color: ${(props) => (props.type === "Present" ? "#00C49F" : "#EF4444")};
  }
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

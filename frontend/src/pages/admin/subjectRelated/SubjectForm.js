import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import Popup from "../../../components/Popup";
import styled from "styled-components";
import { MenuBook, AddCircleOutline, DeleteOutline, ArrowBack } from "@mui/icons-material";
import { BlueButton } from "../../../components/buttonStyles";

const SubjectForm = () => {
  const [subjects, setSubjects] = useState([
    { subName: "", subCode: "", sessions: 30 },
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;

  const sclassName = params.id;
  const adminID = currentUser?._id;
  const address = "Subject";

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubjectNameChange = (index) => (event) => {
    const next = [...subjects];
    next[index].subName = event.target.value;
    setSubjects(next);
  };

  const handleSubjectCodeChange = (index) => (event) => {
    const next = [...subjects];
    next[index].subCode = event.target.value;
    setSubjects(next);
  };

  const handleSessionsChange = (index) => (event) => {
    const next = [...subjects];
    next[index].sessions = Math.max(1, parseInt(event.target.value, 10) || 1);
    setSubjects(next);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subName: "", subCode: "", sessions: 30 }]);
  };

  const handleRemoveSubject = (index) => () => {
    if (subjects.length <= 1) return;
    const next = [...subjects];
    next.splice(index, 1);
    setSubjects(next);
  };

  const fields = {
    sclassName,
    subjects: subjects.map((subject) => ({
      subName: subject.subName.trim(),
      subCode: subject.subCode.trim().toUpperCase(),
      sessions: Number(subject.sessions),
    })),
    adminID,
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const hasEmpty = subjects.some((s) => !s.subName.trim() || !s.subCode.trim());
    if (hasEmpty) {
      setMessage("Please complete all subject names and codes before submitting.");
      setShowPopup(true);
      return;
    }

    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setMessage("Academic Subjects Allocated Successfully");
      setShowPopup(true);
      setTimeout(() => {
        dispatch(underControl());
        navigate("/Admin/subjects");
      }, 700);
    } else if (status === "failed") {
      setMessage(response || "Subject creation failed");
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage(error?.message || "Network Error: Failed to contact root server");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <GlassContainer>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconWrapper>
              <MenuBook sx={{ fontSize: 28, color: "#00C49F" }} />
            </IconWrapper>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <span className="lumina-badge emerald">UNESCO Curriculum</span>
                <span className="lumina-badge">Batch Allocation</span>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
                Add Academic Subjects
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                Define course titles, curriculum codes, and scheduled semester sessions.
              </Typography>
            </Box>
          </Box>

          <Button
            startIcon={<AddCircleOutline />}
            onClick={handleAddSubject}
            sx={{
              color: "#00C49F",
              borderColor: "rgba(0, 196, 159, 0.3)",
              border: "1px solid",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                borderColor: "#00C49F",
                background: "rgba(0, 196, 159, 0.08)",
              },
            }}
          >
            + Add Another Subject
          </Button>
        </Box>

        <form onSubmit={submitHandler}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {subjects.map((subject, index) => (
              <SubjectRowCard key={index}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <GlassTextField
                      fullWidth
                      label="Subject Title"
                      placeholder="e.g. Quantum Physics 101"
                      variant="outlined"
                      value={subject.subName}
                      onChange={handleSubjectNameChange(index)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <GlassTextField
                      fullWidth
                      label="Subject Code"
                      placeholder="e.g. PHY-204"
                      variant="outlined"
                      value={subject.subCode}
                      onChange={handleSubjectCodeChange(index)}
                      required
                    />
                  </Grid>

                  <Grid item xs={9} sm={3}>
                    <GlassTextField
                      fullWidth
                      label="Total Sessions"
                      type="number"
                      variant="outlined"
                      inputProps={{ min: 1 }}
                      value={subject.sessions}
                      onChange={handleSessionsChange(index)}
                      required
                    />
                  </Grid>

                  <Grid item xs={3} sm={1} sx={{ textAlign: "center" }}>
                    {subjects.length > 1 && (
                      <Tooltip title="Remove Subject">
                        <IconButton
                          onClick={handleRemoveSubject(index)}
                          sx={{
                            color: "#EF4444",
                            background: "rgba(239, 68, 68, 0.1)",
                            "&:hover": { background: "rgba(239, 68, 68, 0.2)" },
                          }}
                        >
                          <DeleteOutline sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Grid>
                </Grid>
              </SubjectRowCard>
            ))}

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <BlueButton
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loader}
                sx={{ py: 1.5 }}
              >
                {loader ? <CircularProgress size={22} color="inherit" /> : `Save & Allocate (${subjects.length}) Subjects`}
              </BlueButton>

              <CancelButton
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loader}
              >
                <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Back
              </CancelButton>
            </Box>
          </Box>
        </form>
      </GlassContainer>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default SubjectForm;

const GlassContainer = styled(Box)`
  background: rgba(13, 22, 41, 0.8);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 36px 32px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
`;

const IconWrapper = styled(Box)`
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: rgba(0, 196, 159, 0.12);
  border: 1px solid rgba(0, 196, 159, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SubjectRowCard = styled(Box)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 18px;
  transition: all 0.2s;
  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.045);
  }
`;

const GlassTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    color: #f8fafc;
    & fieldset {
      border-color: rgba(255, 255, 255, 0.12);
    }
    &:hover fieldset {
      border-color: rgba(0, 196, 159, 0.5);
    }
    &.Mui-focused fieldset {
      border-color: #00c49f;
      box-shadow: 0 0 10px rgba(0, 196, 159, 0.3);
    }
  }
  & .MuiInputLabel-root {
    color: #94a3b8;
    &.Mui-focused {
      color: #00c49f;
    }
  }
`;

const CancelButton = styled(Button)`
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: #94a3b8 !important;
  text-transform: none !important;
  font-weight: 600 !important;
  border-radius: 12px !important;
  padding: 10px 20px !important;
  &:hover {
    border-color: rgba(255, 255, 255, 0.3) !important;
    color: #f8fafc !important;
    background: rgba(255, 255, 255, 0.05) !important;
  }
`;

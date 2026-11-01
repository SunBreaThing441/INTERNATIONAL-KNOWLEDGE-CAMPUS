import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSubjectDetails } from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";
import { registerUser } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { PersonAdd, ArrowBack, School, MenuBook } from "@mui/icons-material";
import { BlueButton } from "../../../components/buttonStyles";

const AddTeacher = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjectID = params.id;

  const { status, response, error } = useSelector((state) => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

  useEffect(() => {
    if (subjectID) {
      dispatch(getSubjectDetails(subjectID, "Subject"));
    }
  }, [dispatch, subjectID]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const role = "Teacher";
  const school = subjectDetails?.school;
  const teachSubject = subjectDetails?._id;
  const teachSclass = subjectDetails?.sclassName?._id;

  const fields = { name, email, password, role, school, teachSubject, teachSclass };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill in all required credentials.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setMessage("Academic Mentor Onboarded Successfully");
      setShowPopup(true);
      setTimeout(() => {
        dispatch(underControl());
        navigate("/Admin/teachers");
      }, 700);
    } else if (status === "failed") {
      setMessage(response || "Faculty onboarding encountered an error");
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage(error?.message || "Network Error: Failed to contact root server");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <GlassFormCard>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconWrapper>
            <PersonAdd sx={{ fontSize: 28, color: "#00A3FF" }} />
          </IconWrapper>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge cyan">Faculty Onboarding</span>
              <span className="lumina-badge">POST /TeacherReg</span>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              Onboard Academic Mentor
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Appoint a qualified instructor to lead this subject curriculum.
            </Typography>
          </Box>
        </Box>

        {/* Allocation Context Badges */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3, p: 2, borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MenuBook sx={{ fontSize: 18, color: "#00C49F" }} />
            <Typography variant="body2" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
              Subject: {subjectDetails?.subName || "Loading subject..."}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <School sx={{ fontSize: 18, color: "#00A3FF" }} />
            <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 600 }}>
              Cohort: {subjectDetails?.sclassName?.sclassName || "Loading cohort..."}
            </Typography>
          </Box>
        </Box>

        <form onSubmit={submitHandler}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <GlassTextField
              label="Mentor Full Name"
              placeholder="e.g. Dr. Jane Smith"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />

            <GlassTextField
              label="Institutional Email"
              type="email"
              placeholder="e.g. jane.smith@lumina.edu"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <GlassTextField
              label="Initial Access Password"
              type="password"
              placeholder="••••••••••••"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{ minLength: 6 }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <BlueButton
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loader}
                sx={{ py: 1.5 }}
              >
                {loader ? <CircularProgress size={22} color="inherit" /> : "+ Onboard Mentor"}
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
      </GlassFormCard>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default AddTeacher;

const GlassFormCard = styled(Box)`
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
  background: rgba(0, 163, 255, 0.12);
  border: 1px solid rgba(0, 163, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const GlassTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    color: #f8fafc;
    & fieldset {
      border-color: rgba(255, 255, 255, 0.12);
    }
    &:hover fieldset {
      border-color: rgba(0, 163, 255, 0.5);
    }
    &.Mui-focused fieldset {
      border-color: #00a3ff;
      box-shadow: 0 0 12px rgba(0, 163, 255, 0.3);
    }
  }
  & .MuiInputLabel-root {
    color: #94a3b8;
    &.Mui-focused {
      color: #00a3ff;
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

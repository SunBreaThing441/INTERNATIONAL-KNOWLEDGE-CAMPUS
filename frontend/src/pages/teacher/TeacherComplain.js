import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  CircularProgress,
  Container,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import styled from "styled-components";
import { GreenButton } from "../../components/buttonStyles";
import Popup from "../../components/Popup";
import { addStuff } from "../../redux/userRelated/userHandle";
import { underControl } from "../../redux/userRelated/userSlice";

const TeacherComplain = () => {
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("Curriculum Resources");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const { status, currentUser, error } = useSelector((state) => state.user);

  const user = currentUser?._id;
  const school = currentUser?.school?._id || currentUser?.school;
  const date = new Date().toISOString().substring(0, 10);
  const address = "Complain";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setMessage("Please input your faculty feedback memo.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    const formattedComplaint = `[Faculty Memo: ${category}] ${feedback.trim()}`;
    const fields = { user, date, complaint: formattedComplaint, school };
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setMessage("Faculty Memo Transmitted to Chancellor Oversight");
      setShowPopup(true);
      setFeedback("");
      dispatch(underControl());
    } else if (error) {
      setLoader(false);
      setMessage(error?.message || "Network Error: Failed to transmit faculty memo");
      setShowPopup(true);
    }
  }, [status, error, dispatch]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <GlassTerminalCard>
        <Box sx={{ pb: 3, mb: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <span className="lumina-badge emerald">Faculty Oversight Conduit</span>
            <span className="lumina-badge">POST /ComplainCreate</span>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
            Faculty Feedback & Memo Terminal
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
            Submit curriculum adjustment proposals, pedagogical resource requests, or institutional feedback to the Chancellor.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1, fontWeight: 700 }}>
              Memo Category:
            </Typography>
            <GlassSelect fullWidth>
              <InputLabel id="memo-cat-label" sx={{ color: "#94A3B8" }}>
                Select Category
              </InputLabel>
              <Select
                labelId="memo-cat-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Select Category"
              >
                <MenuItem value="Curriculum Resources">Curriculum Resources & Equipment</MenuItem>
                <MenuItem value="Scheduling & Timetable">Cohort Scheduling & Session Milestones</MenuItem>
                <MenuItem value="Student Academic Welfare">Scholar Learning Accommodation</MenuItem>
                <MenuItem value="Institutional Governance">Institutional Operations & Policy</MenuItem>
              </Select>
            </GlassSelect>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1, fontWeight: 700 }}>
              Faculty Observation Memo:
            </Typography>
            <GlassInput
              fullWidth
              multiline
              rows={5}
              placeholder="State your pedagogical observations, syllabus requirements, or requested resource allocations..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </Box>

          <GreenButton
            type="submit"
            fullWidth
            size="large"
            disabled={loader}
            startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{ py: 1.5, fontSize: "1rem" }}
          >
            {loader ? "Transmitting Memo..." : "Submit Faculty Memo"}
          </GreenButton>
        </form>
      </GlassTerminalCard>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default TeacherComplain;

const GlassTerminalCard = styled.div`
  background: rgba(15, 26, 58, 0.75);
  backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.55), 0 0 24px rgba(0, 196, 159, 0.12);
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
        border-color: rgba(0, 196, 159, 0.45);
      }
      &.Mui-focused fieldset {
        border-color: #00C49F;
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
        border-color: rgba(0, 196, 159, 0.45);
      }
      &.Mui-focused fieldset {
        border-color: #00C49F;
      }
    }
    .MuiSvgIcon-root {
      color: #00C49F;
    }
  }
`;

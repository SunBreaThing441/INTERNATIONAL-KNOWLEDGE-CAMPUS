import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../redux/userRelated/userHandle";
import { underControl } from "../../redux/userRelated/userSlice";
import Popup from "../../components/Popup";
import { BlueButton } from "../../components/buttonStyles";

const StudentComplain = () => {
  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [category, setCategory] = useState("Academic Curriculum");

  const dispatch = useDispatch();
  const { status, currentUser, error } = useSelector((state) => state.user);

  const user = currentUser?._id;
  const school = currentUser?.school?._id || currentUser?.school;
  const address = "Complain";

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!complaint.trim()) {
      setMessage("Please describe your grievance or feedback in detail.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    const formattedComplaint = `[Category: ${category}] ${complaint.trim()}`;
    const fields = { user, date, complaint: formattedComplaint, school };
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setShowPopup(true);
      setMessage("Grievance Transmitted to Institutional Oversight");
      setComplaint("");
      dispatch(underControl());
    } else if (error) {
      setLoader(false);
      setShowPopup(true);
      setMessage(error?.message || "Network Communication Error");
    }
  }, [status, error, dispatch]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <GlassTerminalCard>
        {/* Header */}
        <Box sx={{ pb: 3, mb: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <span className="lumina-badge amber">Confidential Oversight Conduit</span>
            <span className="lumina-badge">UNESCO Scholar Welfare</span>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
            Ethical Oversight & Grievance Terminal
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
            Direct, confidential channel routed to Chancellor Administration for student welfare and academic resolution.
          </Typography>
        </Box>

        <form onSubmit={submitHandler}>
          {/* Category Dropdown */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1, fontWeight: 700 }}>
              Grievance Domain Category:
            </Typography>
            <GlassSelect fullWidth>
              <InputLabel id="category-label" sx={{ color: "#94A3B8" }}>
                Select Domain
              </InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Select Domain"
              >
                <MenuItem value="Academic Curriculum">Academic Curriculum & Syllabus</MenuItem>
                <MenuItem value="Assessment & Grading">Assessment & Grading Audit</MenuItem>
                <MenuItem value="Faculty Mentorship">Faculty Mentorship & Communication</MenuItem>
                <MenuItem value="Campus Welfare & Integrity">Campus Welfare & Institutional Integrity</MenuItem>
                <MenuItem value="Technical Anomaly">Technical Ecosystem Anomaly</MenuItem>
              </Select>
            </GlassSelect>
          </Box>

          {/* Date Selector */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1, fontWeight: 700 }}>
              Incident / Observation Date:
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

          {/* Description */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ color: "#E2E8F0", mb: 1, fontWeight: 700 }}>
              Detailed Grievance Brief:
            </Typography>
            <GlassInput
              fullWidth
              multiline
              rows={5}
              placeholder="Provide a clear, objective account of your observation, concerns, or requested remedial action..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              required
            />
          </Box>

          {/* Submit */}
          <BlueButton
            type="submit"
            fullWidth
            size="large"
            disabled={loader}
            startIcon={loader ? null : <Send />}
            sx={{ py: 1.5, fontSize: "1rem" }}
          >
            {loader ? <CircularProgress size={24} sx={{ color: "#FFFFFF" }} /> : "Transmit Grievance to Oversight Council"}
          </BlueButton>
        </form>
      </GlassTerminalCard>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default StudentComplain;

const GlassTerminalCard = styled.div`
  background: rgba(15, 26, 58, 0.75);
  backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.55), 0 0 24px rgba(0, 119, 212, 0.12);
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

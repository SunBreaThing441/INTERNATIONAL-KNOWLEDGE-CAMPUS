import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import Popup from "../../../components/Popup";
import styled from "styled-components";
import { Campaign, ArrowBack } from "@mui/icons-material";
import { GreenButton } from "../../../components/buttonStyles";

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().substring(0, 10));
  const adminID = currentUser?._id;

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID };
  const address = "Notice";

  const submitHandler = (event) => {
    event.preventDefault();
    if (!title.trim() || !details.trim()) {
      setMessage("Please provide both a notice title and detailed briefing.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setMessage("Official Notice Broadcast Dispatched Successfully");
      setShowPopup(true);
      setTimeout(() => {
        dispatch(underControl());
        navigate("/Admin/notices");
      }, 700);
    } else if (status === "failed") {
      setMessage(response || "Notice broadcast failed");
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
            <Campaign sx={{ fontSize: 28, color: "#00C49F" }} />
          </IconWrapper>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge emerald">Official Gazette</span>
              <span className="lumina-badge">POST /NoticeCreate</span>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              Publish Institutional Notice
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Broadcast academic updates, policy bulletins, or alerts to the community.
            </Typography>
          </Box>
        </Box>

        <form onSubmit={submitHandler}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <GlassTextField
              label="Gazette Notice Headline"
              placeholder="e.g. UNESCO Standardized Assessment Schedule"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />

            <GlassTextField
              label="Effective Broadcast Date"
              type="date"
              variant="outlined"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />

            <GlassTextField
              label="Notice Executive Brief / Details"
              placeholder="Provide complete institutional briefing or protocol instructions..."
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <GreenButton
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loader}
                sx={{ py: 1.5 }}
              >
                {loader ? <CircularProgress size={22} color="inherit" /> : "+ Broadcast Notice"}
              </GreenButton>

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

export default AddNotice;

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
  background: rgba(0, 196, 159, 0.12);
  border: 1px solid rgba(0, 196, 159, 0.25);
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
      border-color: rgba(0, 196, 159, 0.5);
    }
    &.Mui-focused fieldset {
      border-color: #00c49f;
      box-shadow: 0 0 12px rgba(0, 196, 159, 0.3);
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

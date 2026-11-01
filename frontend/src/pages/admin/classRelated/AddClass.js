import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";
import styled from "styled-components";
import { School, ArrowBack } from "@mui/icons-material";

const AddClass = () => {
  const [sclassName, setSclassName] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error, tempDetails } = userState;

  const adminID = currentUser?._id;
  const address = "Sclass";

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fields = {
    sclassName: sclassName.trim(),
    adminID,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!sclassName.trim()) {
      setMessage("Please enter a valid academic standard/cohort name.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added" && tempDetails) {
      setLoader(false);
      setMessage("Academic Cohort Established Successfully");
      setShowPopup(true);
      setTimeout(() => {
        dispatch(underControl());
        navigate("/Admin/classes/class/" + tempDetails._id);
      }, 700);
    } else if (status === "failed") {
      setMessage(response || "Cohort creation failed");
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage(error?.message || "Network Error: Failed to contact root server");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch, tempDetails]);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <GlassFormCard>
        {/* Header Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconWrapper>
            <School sx={{ fontSize: 28, color: "#00A3FF" }} />
          </IconWrapper>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge cyan">UNESCO Standard 4.1</span>
              <span className="lumina-badge">Cohort Setup</span>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              Establish Academic Cohort
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Define a new structured class, grade tier, or learning standard.
            </Typography>
          </Box>
        </Box>

        <form onSubmit={submitHandler}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <GlassTextField
              label="Cohort / Class Identifier (e.g. Grade 10-A, Year 12 Physics)"
              variant="outlined"
              fullWidth
              value={sclassName}
              onChange={(e) => setSclassName(e.target.value)}
              required
              autoFocus
              placeholder="e.g. Standard 8 Alpha"
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
                {loader ? <CircularProgress size={22} color="inherit" /> : "+ Establish Cohort"}
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

export default AddClass;

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

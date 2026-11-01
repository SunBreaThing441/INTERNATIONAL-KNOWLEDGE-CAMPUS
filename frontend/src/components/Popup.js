import React from "react";
import { useDispatch } from "react-redux";
import { underControl } from "../redux/userRelated/userSlice";
import { underStudentControl } from "../redux/studentRelated/studentSlice";
import { Snackbar, Alert as MuiAlert, Slide, Typography, Box } from "@mui/material";
import { CheckCircle, ErrorOutline, InfoOutlined, WarningAmber } from "@mui/icons-material";
import styled from "styled-components";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

/**
 * INTERNATIONAL KNOWLEDGE CAMPUS Modern Toast Alert (Popup.js)
 * Intelligent severity detection, glassmorphism UI, and smooth slide animation.
 */
const Popup = ({ message, setShowPopup, showPopup, severity: explicitSeverity }) => {
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowPopup(false);
    dispatch(underControl());
    dispatch(underStudentControl());
  };

  // Determine severity: explicit prop > intelligent text analysis
  const determineSeverity = () => {
    if (explicitSeverity) return explicitSeverity;
    if (!message) return "info";

    const lower = String(message).toLowerCase();
    const successKeywords = [
      "success",
      "successfully",
      "added",
      "created",
      "recorded",
      "transmitted",
      "done",
      "updated",
      "saved",
      "registered",
    ];
    const isSuccess = successKeywords.some((word) => lower.includes(word));
    if (isSuccess) return "success";

    const errorKeywords = [
      "error",
      "failed",
      "fail",
      "invalid",
      "not found",
      "limit reached",
      "already exists",
      "wrong",
      "denied",
      "expired",
    ];
    const isError = errorKeywords.some((word) => lower.includes(word));
    if (isError) return "error";

    return "info";
  };

  const severity = determineSeverity();

  const getIcon = () => {
    switch (severity) {
      case "success":
        return <CheckCircle sx={{ color: "#00C49F", fontSize: 22 }} />;
      case "error":
        return <ErrorOutline sx={{ color: "#EF4444", fontSize: 22 }} />;
      case "warning":
        return <WarningAmber sx={{ color: "#F59E0B", fontSize: 22 }} />;
      default:
        return <InfoOutlined sx={{ color: "#00A3FF", fontSize: 22 }} />;
    }
  };

  const getBorderColor = () => {
    switch (severity) {
      case "success":
        return "rgba(0, 196, 159, 0.4)";
      case "error":
        return "rgba(239, 68, 68, 0.4)";
      case "warning":
        return "rgba(245, 158, 11, 0.4)";
      default:
        return "rgba(0, 163, 255, 0.4)";
    }
  };

  return (
    <Snackbar
      open={Boolean(showPopup && message)}
      autoHideDuration={3500}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ top: { xs: 20, sm: 28 }, right: { xs: 16, sm: 28 }, zIndex: 9999 }}
    >
      <GlassToastAlert
        icon={false}
        onClose={handleClose}
        severity={severity}
        style={{ borderColor: getBorderColor() }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {getIcon()}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                display: "block",
                lineHeight: 1,
                mb: 0.2,
              }}
            >
              Lumina System Notice
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#F8FAFC",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              {message}
            </Typography>
          </Box>
        </Box>
      </GlassToastAlert>
    </Snackbar>
  );
};

export default Popup;

const GlassToastAlert = styled(MuiAlert)`
  background: rgba(13, 22, 41, 0.92) !important;
  backdrop-filter: blur(20px) !important;
  border-width: 1px !important;
  border-style: solid !important;
  border-radius: 14px !important;
  padding: 12px 18px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55), 0 0 20px rgba(0, 119, 212, 0.15) !important;
  min-width: 300px;
  max-width: 460px;

  & .MuiAlert-message {
    padding: 0 !important;
    overflow: hidden;
  }

  & .MuiAlert-action {
    padding-left: 12px;
    color: #94a3b8;
    & button:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #f8fafc;
    }
  }
`;

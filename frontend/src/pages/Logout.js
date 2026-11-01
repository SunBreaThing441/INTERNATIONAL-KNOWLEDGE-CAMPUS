import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/userRelated/userHandle";
import { Box, Typography, Button, Avatar } from "@mui/material";
import { Logout as LogoutIcon, ArrowBack, Security } from "@mui/icons-material";
import styled from "styled-components";

const Logout = () => {
  const { currentUser, currentRole } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/", { replace: true });
  };

  const handleCancel = () => {
    if (currentRole) {
      navigate(`/${currentRole}/dashboard`, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const roleLabel =
    currentRole === "Admin"
      ? "Chancellor / Administrator"
      : currentRole === "Teacher"
      ? "Faculty Mentor • Academic Facilitator"
      : "Global Scholar";

  return (
    <LogoutBackdrop>
      <LogoutGlassCard>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <SecurityIconWrapper>
            <Security sx={{ fontSize: 32, color: "#EF4444" }} />
          </SecurityIconWrapper>
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#F8FAFC",
            textAlign: "center",
            letterSpacing: "-0.01em",
            mb: 0.5,
          }}
        >
          Terminate Authenticated Session
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#94A3B8", textAlign: "center", mb: 3 }}
        >
          Confirm secure session detachment from INTERNATIONAL KNOWLEDGE CAMPUS ecosystem.
        </Typography>

        {/* Identity Badge */}
        <IdentityCard>
          <Avatar
            sx={{
              width: 46,
              height: 46,
              bgcolor: "rgba(0, 119, 212, 0.2)",
              color: "#00A3FF",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {currentUser?.name ? String(currentUser.name).charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1, overflow: "hidden" }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: "#F8FAFC", lineHeight: 1.2 }}>
              {currentUser?.name || "Active Session Holder"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#00C49F", fontWeight: 600, display: "block", wordBreak: "break-word" }}>
              {roleLabel} {currentUser?.email ? `• ${currentUser.email}` : ""}
            </Typography>
          </Box>
        </IdentityCard>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 3 }}>
          <LogoutActionButton onClick={handleLogout} fullWidth>
            <LogoutIcon sx={{ fontSize: 18, mr: 1 }} />
            Revoke Credentials & Sign Out
          </LogoutActionButton>

          <CancelActionButton onClick={handleCancel} fullWidth>
            <ArrowBack sx={{ fontSize: 18, mr: 1 }} />
            Return to Dashboard
          </CancelActionButton>
        </Box>
      </LogoutGlassCard>
    </LogoutBackdrop>
  );
};

export default Logout;

const LogoutBackdrop = styled(Box)`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
  overflow-y: auto;
  box-sizing: border-box;
  background: radial-gradient(circle at 50% 30%, rgba(239, 68, 68, 0.08) 0%, transparent 60%),
    radial-gradient(circle at 80% 80%, rgba(0, 119, 212, 0.12) 0%, transparent 50%),
    #080e1a;
`;

const LogoutGlassCard = styled(Box)`
  background: rgba(13, 22, 41, 0.85);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 36px 32px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
`;

const SecurityIconWrapper = styled(Box)`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IdentityCard = styled(Box)`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoutActionButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  text-transform: none !important;
  font-size: 0.92rem !important;
  padding: 12px 20px !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.35) !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;

  &:hover {
    box-shadow: 0 6px 24px rgba(239, 68, 68, 0.5) !important;
    transform: translateY(-1px) !important;
  }
`;

const CancelActionButton = styled(Button)`
  background: rgba(255, 255, 255, 0.06) !important;
  color: #94a3b8 !important;
  font-weight: 600 !important;
  text-transform: none !important;
  font-size: 0.92rem !important;
  padding: 12px 20px !important;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.2s !important;

  &:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    color: #f8fafc !important;
  }
`;

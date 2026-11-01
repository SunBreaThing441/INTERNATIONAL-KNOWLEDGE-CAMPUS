import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Public,
  ArrowForward,
} from "@mui/icons-material";
import styled from "styled-components";
import { registerUser } from "../../redux/userRelated/userHandle";
import Popup from "../../components/Popup";
import { DarkBlueButton } from "../../components/buttonStyles";

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [adminName, setAdminName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminName || !schoolName || !email || !password) {
      setMessage("Please complete all registration fields.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    const fields = { name: adminName, email, password, schoolName };
    dispatch(registerUser(fields, "Admin"));
  };

  useEffect(() => {
    if (status === "success" || (currentUser !== null && currentRole === "Admin")) {
      navigate("/Admin/dashboard");
    } else if (status === "failed") {
      setLoader(false);
      setMessage(response || "Registration failed");
      setShowPopup(true);
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Communication Failure. Ensure Backend is active on Port 5000.");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser, response, error]);

  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <GlassCard>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Public sx={{ color: "#00A3FF", fontSize: 22 }} />
              <Typography variant="overline" sx={{ color: "#00A3FF", fontWeight: 700, letterSpacing: "0.1em" }}>
                UNESCO Open Education Network
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              Register Knowledge Hub
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
              Onboard your institution as an accredited Lumina Chancellor node
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <GlassInput
              fullWidth
              label="Chancellor Full Name"
              variant="outlined"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. Dr. Eleanor Vance"
              required
              sx={{ mb: 2 }}
            />
            <GlassInput
              fullWidth
              label="Institution / School Name"
              variant="outlined"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Oxford Open Academy"
              required
              sx={{ mb: 2 }}
            />
            <GlassInput
              fullWidth
              label="Official Institutional Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. chancellor@oxford-open.edu"
              required
              sx={{ mb: 2 }}
            />
            <GlassInput
              fullWidth
              label="Master Security Passcode"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              sx={{ mb: 3.5 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#94A3B8" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <DarkBlueButton
              type="submit"
              fullWidth
              disabled={loader}
              sx={{ py: 1.5, fontSize: "0.95rem" }}
            >
              {loader ? (
                <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <span>Provision Institutional Node</span>
                  <ArrowForward sx={{ fontSize: 18 }} />
                </Box>
              )}
            </DarkBlueButton>
          </form>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Link to="/" style={{ color: "#94A3B8", fontSize: "0.82rem" }}>
              ← Return Home
            </Link>
            <Link to="/Adminlogin" style={{ color: "#00A3FF", fontSize: "0.82rem", fontWeight: 700 }}>
              Existing Chancellor? Sign In
            </Link>
          </Box>
        </GlassCard>
      </Container>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loader}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </PageWrapper>
  );
};

export default AdminRegisterPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
`;

const GlassCard = styled.div`
  background: rgba(15, 26, 58, 0.75);
  backdrop-filter: blur(24px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.65), 0 0 32px rgba(0, 119, 212, 0.15);
`;

const GlassInput = styled(TextField)`
  && {
    .MuiInputLabel-root {
      color: #94A3B8;
      font-size: 0.88rem;
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
        box-shadow: 0 0 12px rgba(0, 163, 255, 0.25);
      }
    }
  }
`;

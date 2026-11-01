import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  AccountBalance,
  Psychology,
  School,
  ArrowForward,
  Public,
} from "@mui/icons-material";
import styled from "styled-components";
import { loginUser } from "../redux/userRelated/userHandle";
import Popup from "../components/Popup";
import { DarkBlueButton } from "../components/buttonStyles";

const LoginPage = ({ role: initialRole }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [activeRole, setActiveRole] = useState(initialRole || "Admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    if (initialRole) {
      setActiveRole(initialRole);
    }
  }, [initialRole]);

  const loadDemo = (role) => {
    setActiveRole(role);
    if (role === "Admin") {
      setEmail("sampleadmin@gmail.com");
      setPassword("123");
    } else if (role === "Teacher") {
      setEmail("teacher4@gmail.com");
      setPassword("12345");
    } else if (role === "Student") {
      setStudentName("DANIEL MUSYOKI");
      setRollNumber("1");
      setPassword("12345");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    if (activeRole === "Student") {
      if (!rollNumber || !studentName || !password) {
        setMessage("Please provide Roll Number, Scholar Name, and Password");
        setShowPopup(true);
        setLoader(false);
        return;
      }
      dispatch(loginUser({ rollNum: rollNumber, studentName, password }, "Student"));
    } else {
      if (!email || !password) {
        setMessage("Please provide Email Address and Password");
        setShowPopup(true);
        setLoader(false);
        return;
      }
      dispatch(loginUser({ email, password }, activeRole));
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      const fromPath = location.state?.from?.pathname;
      if (fromPath && fromPath.startsWith(`/${currentRole}`)) {
        navigate(fromPath, { replace: true });
      } else {
        if (currentRole === "Admin") navigate("/Admin/dashboard", { replace: true });
        else if (currentRole === "Student") navigate("/Student/dashboard", { replace: true });
        else if (currentRole === "Teacher") navigate("/Teacher/dashboard", { replace: true });
      }
    } else if (status === "failed") {
      setLoader(false);
      setMessage(response || "Invalid credentials provided");
      setShowPopup(true);
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Communication Failure. Ensure Backend is active on Port 5000.");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser, response, error, location]);

  const roleMeta = {
    Admin: {
      label: "Chancellor",
      color: "#0077D4",
      icon: <AccountBalance sx={{ fontSize: 28, color: "#00A3FF" }} />,
    },
    Teacher: {
      label: "Academic Mentor",
      color: "#00C49F",
      icon: <Psychology sx={{ fontSize: 28, color: "#00C49F" }} />,
    },
    Student: {
      label: "Global Scholar",
      color: "#A855F7",
      icon: <School sx={{ fontSize: 28, color: "#A855F7" }} />,
    },
  };

  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <GlassCard>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Public sx={{ color: "#00A3FF", fontSize: 22 }} />
              <Typography variant="overline" sx={{ color: "#00A3FF", fontWeight: 700, letterSpacing: "0.1em" }}>
                INTERNATIONAL KNOWLEDGE CAMPUS Access
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.02em" }}>
              Authentication Terminal
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
              Secured under UNESCO Open Knowledge protocol
            </Typography>
          </Box>

          {/* Role Switcher Tabs */}
          <RoleTabs>
            {["Admin", "Teacher", "Student"].map((r) => (
              <RoleTabItem
                key={r}
                active={activeRole === r}
                onClick={() => {
                  setActiveRole(r);
                  navigate(`/${r}login`);
                }}
              >
                {r === "Admin" ? "Chancellor" : r === "Teacher" ? "Mentor" : "Scholar"}
              </RoleTabItem>
            ))}
          </RoleTabs>

          {/* Quick Demo Preload */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, p: 1.5, background: "rgba(0, 119, 212, 0.1)", borderRadius: "10px", border: "1px dashed rgba(0, 119, 212, 0.35)" }}>
            <Typography variant="caption" sx={{ color: "#E2E8F0", fontWeight: 600 }}>
              Testing without credentials?
            </Typography>
            <DemoButton onClick={() => loadDemo(activeRole)}>
              Load Demo {roleMeta[activeRole].label}
            </DemoButton>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {activeRole === "Student" ? (
              <>
                <GlassInput
                  fullWidth
                  label="Roll Number"
                  variant="outlined"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 1"
                  required
                  sx={{ mb: 2.5 }}
                />
                <GlassInput
                  fullWidth
                  label="Scholar Name"
                  variant="outlined"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. DANIEL MUSYOKI"
                  required
                  sx={{ mb: 2.5 }}
                />
              </>
            ) : (
              <GlassInput
                fullWidth
                label={`${roleMeta[activeRole].label} Email Address`}
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeRole === "Admin" ? "sampleadmin@gmail.com" : "teacher4@gmail.com"}
                required
                sx={{ mb: 2.5 }}
              />
            )}

            <GlassInput
              fullWidth
              label="Security Passcode"
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
                  <span>Authenticate into {roleMeta[activeRole].label} Portal</span>
                  <ArrowForward sx={{ fontSize: 18 }} />
                </Box>
              )}
            </DarkBlueButton>
          </form>

          {/* Footer Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Link to="/" style={{ color: "#94A3B8", fontSize: "0.82rem" }}>
              ← Return Home
            </Link>
            <Link to="/Adminregister" style={{ color: "#00C49F", fontSize: "0.82rem", fontWeight: 700 }}>
              Register Institutional Hub
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

export default LoginPage;

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

const RoleTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: rgba(7, 13, 30, 0.6);
  padding: 5px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const RoleTabItem = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.active ? "linear-gradient(135deg, #0077D4 0%, #00569E 100%)" : "transparent")};
  color: ${(props) => (props.active ? "#FFFFFF" : "#94A3B8")};
  box-shadow: ${(props) => (props.active ? "0 4px 14px rgba(0, 119, 212, 0.35)" : "none")};
  &:hover {
    color: #F8FAFC;
  }
`;

const DemoButton = styled.button`
  background: rgba(0, 119, 212, 0.25);
  border: 1px solid rgba(0, 119, 212, 0.5);
  color: #00A3FF;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(0, 119, 212, 0.45);
    color: #FFFFFF;
  }
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

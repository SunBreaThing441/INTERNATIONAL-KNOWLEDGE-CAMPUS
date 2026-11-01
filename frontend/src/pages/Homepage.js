import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  AccountBalance,
  School,
  Psychology,
  Visibility,
  VisibilityOff,
  ArrowForward,
  CheckCircleOutline,
  AutoAwesome,
  Public,
} from "@mui/icons-material";
import styled from "styled-components";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userRelated/userHandle";
import { DarkBlueButton, GreenButton } from "../components/buttonStyles";
import Popup from "../components/Popup";

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, currentRole, response, error } = useSelector(
    (state) => state.user
  );

  const [activeRole, setActiveRole] = useState("Admin"); // 'Admin' | 'Teacher' | 'Student'
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [rollNum, setRollNum] = useState("");

  // Auto-redirect if logged in
  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") navigate("/Admin/dashboard");
      else if (currentRole === "Student") navigate("/Student/dashboard");
      else if (currentRole === "Teacher") navigate("/Teacher/dashboard");
    } else if (status === "failed") {
      setLoader(false);
      setPopupMessage(response || "Invalid credentials provided");
      setShowPopup(true);
    } else if (status === "error") {
      setLoader(false);
      setPopupMessage("Network Communication Failure. Ensure Backend on Port 5000 is active.");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser, response, error]);

  // Pre-fill quick demo credentials
  const loadGuestCredentials = (role) => {
    setActiveRole(role);
    if (role === "Admin") {
      setEmail("sampleadmin@gmail.com");
      setPassword("123");
    } else if (role === "Teacher") {
      setEmail("teacher4@gmail.com");
      setPassword("12345");
    } else if (role === "Student") {
      setStudentName("DANIEL MUSYOKI");
      setRollNum("1");
      setPassword("12345");
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    if (activeRole === "Student") {
      if (!rollNum || !studentName || !password) {
        setPopupMessage("Please specify Roll Number, Scholar Name, and Password");
        setShowPopup(true);
        setLoader(false);
        return;
      }
      dispatch(loginUser({ rollNum, studentName, password }, "Student"));
    } else {
      if (!email || !password) {
        setPopupMessage("Please specify Email Address and Password");
        setShowPopup(true);
        setLoader(false);
        return;
      }
      dispatch(loginUser({ email, password }, activeRole));
    }
  };

  const roleMeta = {
    Admin: {
      title: "Chancellor Console",
      sub: "Institutional Governance & Accreditation",
      icon: <AccountBalance sx={{ fontSize: 32, color: "#00A3FF" }} />,
      desc: "Architect classes, onboard faculty, oversee academic records, and coordinate institutional policy.",
      badge: "Institutional Authority",
      accent: "#0077D4",
    },
    Teacher: {
      title: "Academic Mentor",
      sub: "Curricula & Faculty Leadership",
      icon: <Psychology sx={{ fontSize: 32, color: "#00C49F" }} />,
      desc: "Manage live cohorts, log real-time attendance, grade exam assessments, and monitor scholar progress.",
      badge: "Pedagogical Specialist",
      accent: "#00C49F",
    },
    Student: {
      title: "Global Scholar",
      sub: "Knowledge Acquisition & Mastery",
      icon: <School sx={{ fontSize: 32, color: "#A855F7" }} />,
      desc: "Access syllabus schedules, review performance metrics, monitor attendance percentage, and file feedback.",
      badge: "Continuous Learner",
      accent: "#8B5CF6",
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* Top Futuristic Navigation Bar */}
      <HeaderBar>
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <LogoBox to="/">
            <EmblemHalo>
              <Public sx={{ fontSize: 28, color: "#00A3FF" }} />
            </EmblemHalo>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.02em", color: "#F8FAFC", display: "flex", alignItems: "center", gap: 1 }}>
                INTERNATIONAL KNOWLEDGE <span style={{ color: "#00C49F", fontWeight: 700 }}>CAMPUS</span>
              </Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem", display: "block" }}>
                UNESCO Open Education Ecosystem
              </Typography>
            </Box>
          </LogoBox>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3 }}>
            <NavPill href="#telemetry">Global Telemetry</NavPill>
            <NavPill href="#ecosystem">Ecosystem Vision</NavPill>
            <NavPill href="#access">Access Terminals</NavPill>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link to="/Adminregister">
              <GreenButton variant="contained" size="small">
                Register Institution
              </GreenButton>
            </Link>
          </Box>
        </Container>
      </HeaderBar>

      {/* Main Hero & Unified Portal Grid */}
      <Container maxWidth="xl" sx={{ pt: { xs: 12, md: 16 }, pb: 8 }}>
        <Grid container spacing={5} alignItems="center">
          {/* Left Column: Vision & Live Metrics */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ mb: 2 }}>
              <span className="lumina-badge emerald">
                <AutoAwesome sx={{ fontSize: 14 }} /> UNESCO SDG 4 — Quality Open Education
              </span>
            </Box>

            <HeroHeadline>
              Illuminating Global Potential Through <GradientSpan>Open Academic</GradientSpan> Infrastructure.
            </HeroHeadline>

            <HeroSubtitle>
              A unified, decentralized institutional ecosystem connecting Chancellors, Academic Mentors, and Global Scholars. Experience high-density curriculum tracking, verifiable attendance, and data-driven learning outcomes.
            </HeroSubtitle>

            {/* Quick Demo Launchpad Bar */}
            <QuickDemoBox>
              <Typography variant="caption" sx={{ color: "#00A3FF", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleOutline sx={{ fontSize: 16 }} /> Fast Preview / Instant Test Sandbox:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
                <DemoChip onClick={() => loadGuestCredentials("Admin")}>
                  Demo Chancellor
                </DemoChip>
                <DemoChip onClick={() => loadGuestCredentials("Teacher")}>
                  Demo Mentor
                </DemoChip>
                <DemoChip onClick={() => loadGuestCredentials("Student")}>
                  Demo Scholar
                </DemoChip>
              </Box>
            </QuickDemoBox>

            {/* Live Telemetry Ticker Cards */}
            <Grid container spacing={2} sx={{ mt: 2 }} id="telemetry">
              <Grid item xs={6} sm={3}>
                <TelemetryCard>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#00A3FF" }}>
                    <CountUp end={142} duration={2.5} suffix="k+" />
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                    Global Scholars
                  </Typography>
                </TelemetryCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TelemetryCard>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#00C49F" }}>
                    <CountUp end={3850} duration={3} suffix="+" />
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                    Academic Mentors
                  </Typography>
                </TelemetryCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TelemetryCard>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#A855F7" }}>
                    <CountUp end={1280} duration={2} suffix="+" />
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                    Curricula Modules
                  </Typography>
                </TelemetryCard>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TelemetryCard>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#F59E0B" }}>
                    <CountUp end={98} duration={2} suffix=".4%" decimals={1} />
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600 }}>
                    Active Engagement
                  </Typography>
                </TelemetryCard>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column: Unified Interactive Access Terminal */}
          <Grid item xs={12} lg={6} id="access">
            <AccessTerminalCard>
              {/* Role Selector Tabs */}
              <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, mb: 1.5, display: "block" }}>
                Select Role Access Terminal:
              </Typography>
              <RoleTabsContainer>
                {["Admin", "Teacher", "Student"].map((role) => (
                  <RoleTab
                    key={role}
                    active={activeRole === role}
                    onClick={() => setActiveRole(role)}
                  >
                    {role === "Admin" && <AccountBalance sx={{ fontSize: 18 }} />}
                    {role === "Teacher" && <Psychology sx={{ fontSize: 18 }} />}
                    {role === "Student" && <School sx={{ fontSize: 18 }} />}
                    <span>{role === "Admin" ? "Chancellor" : role === "Teacher" ? "Mentor" : "Scholar"}</span>
                  </RoleTab>
                ))}
              </RoleTabsContainer>

              {/* Active Role Meta Card */}
              <ActiveRoleBanner accent={roleMeta[activeRole].accent}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: "10px", background: "rgba(255,255,255,0.06)" }}>
                    {roleMeta[activeRole].icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#F8FAFC", lineHeight: 1.2 }}>
                      {roleMeta[activeRole].title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: roleMeta[activeRole].accent, fontWeight: 600 }}>
                      {roleMeta[activeRole].badge}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1, fontSize: "0.82rem" }}>
                  {roleMeta[activeRole].desc}
                </Typography>
              </ActiveRoleBanner>

              {/* Dynamic Interactive Login Form */}
              <form onSubmit={handleLoginSubmit}>
                {activeRole === "Student" ? (
                  <>
                    <GlassInput
                      fullWidth
                      label="Student Roll Number"
                      variant="outlined"
                      value={rollNum}
                      onChange={(e) => setRollNum(e.target.value)}
                      placeholder="e.g. 1"
                      required
                      sx={{ mb: 2 }}
                    />
                    <GlassInput
                      fullWidth
                      label="Scholar Full Name"
                      variant="outlined"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. DANIEL MUSYOKI"
                      required
                      sx={{ mb: 2 }}
                    />
                  </>
                ) : (
                  <GlassInput
                    fullWidth
                    label={activeRole === "Admin" ? "Chancellor Institutional Email" : "Mentor Faculty Email"}
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeRole === "Admin" ? "sampleadmin@gmail.com" : "teacher4@gmail.com"}
                    required
                    sx={{ mb: 2 }}
                  />
                )}

                <GlassInput
                  fullWidth
                  label="Access Passcode / Security Token"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  sx={{ mb: 3 }}
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
                  sx={{ py: 1.5, fontSize: "1rem" }}
                >
                  {loader ? (
                    <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <span>Authenticate Into {roleMeta[activeRole].title}</span>
                      <ArrowForward sx={{ fontSize: 18 }} />
                    </Box>
                  )}
                </DarkBlueButton>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2.5 }}>
                  <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                    Need new institutional license?{" "}
                    <Link to="/Adminregister" style={{ color: "#00C49F", fontWeight: 700 }}>
                      Register Hub
                    </Link>
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94A3B8", cursor: "pointer" }} onClick={() => loadGuestCredentials(activeRole)}>
                    Auto-Fill Demo
                  </Typography>
                </Box>
              </form>
            </AccessTerminalCard>
          </Grid>
        </Grid>
      </Container>

      {/* Global Footer */}
      <FooterBox>
        <Container maxWidth="xl" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>
            © 2026 INTERNATIONAL KNOWLEDGE CAMPUS Open Education Ecosystem. Endorsed for UNESCO SDG 4 Open Standards.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>Direct Backend: Port 5000 Active</Typography>
            <Typography variant="caption" sx={{ color: "#00C49F" }}>Encrypted Local Node</Typography>
          </Box>
        </Container>
      </FooterBox>

      {/* Notification Popup */}
      <Popup message={popupMessage} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default Homepage;

// Styled Components
const HeaderBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(7, 13, 30, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 0;
`;

const LogoBox = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EmblemHalo = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 119, 212, 0.15);
  border: 1px solid rgba(0, 119, 212, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(0, 119, 212, 0.3);
`;

const NavPill = styled.a`
  color: #94A3B8;
  font-size: 0.88rem;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 8px;
  transition: all 0.2s;
  &:hover {
    color: #F8FAFC;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const HeroHeadline = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  color: #F8FAFC;
  letter-spacing: -0.03em;
  margin-bottom: 20px;
`;

const GradientSpan = styled.span`
  background: linear-gradient(135deg, #00A3FF 0%, #00C49F 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSubtitle = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  color: #94A3B8;
  margin-bottom: 24px;
  max-width: 580px;
`;

const QuickDemoBox = styled.div`
  background: rgba(15, 26, 58, 0.55);
  border: 1px dashed rgba(0, 119, 212, 0.4);
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 24px;
  max-width: 580px;
`;

const DemoChip = styled.button`
  background: rgba(0, 119, 212, 0.18);
  border: 1px solid rgba(0, 119, 212, 0.45);
  color: #E2E8F0;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(0, 119, 212, 0.35);
    border-color: #00A3FF;
    transform: translateY(-1px);
  }
`;

const TelemetryCard = styled.div`
  background: rgba(11, 19, 43, 0.65);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px 14px;
  text-align: center;
  transition: all 0.25s;
  &:hover {
    border-color: rgba(0, 119, 212, 0.4);
    transform: translateY(-2px);
  }
`;

const AccessTerminalCard = styled.div`
  background: rgba(15, 26, 58, 0.72);
  backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.65), 0 0 32px rgba(0, 119, 212, 0.15);
  position: relative;
`;

const RoleTabsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: rgba(7, 13, 30, 0.6);
  padding: 6px;
  border-radius: 14px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

const RoleTab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 8px;
  border-radius: 10px;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  background: ${(props) => (props.active ? "linear-gradient(135deg, #0077D4 0%, #00569E 100%)" : "transparent")};
  color: ${(props) => (props.active ? "#FFFFFF" : "#94A3B8")};
  box-shadow: ${(props) => (props.active ? "0 4px 16px rgba(0, 119, 212, 0.4)" : "none")};
  &:hover {
    color: #F8FAFC;
  }
`;

const ActiveRoleBanner = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${(props) => props.accent || "rgba(255, 255, 255, 0.1)"}40;
  border-left: 4px solid ${(props) => props.accent || "#0077D4"};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 24px;
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
      transition: all 0.2s;
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

const FooterBox = styled.footer`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(7, 13, 30, 0.85);
  backdrop-filter: blur(14px);
  padding: 24px 0;
  margin-top: 40px;
`;

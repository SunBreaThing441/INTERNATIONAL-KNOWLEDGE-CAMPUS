import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { PersonAdd, ArrowBack } from "@mui/icons-material";
import { BlueButton } from "../../../components/buttonStyles";

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector((state) => state.sclass);

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [sclassName, setSclassName] = useState("");

  const adminID = currentUser?._id;
  const role = "Student";
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (adminID) {
      dispatch(getAllSclasses(adminID, "Sclass"));
    }
  }, [adminID, dispatch]);

  const fields = { name, rollNum, password, sclassName, adminID, role, attendance };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!sclassName) {
      setMessage("Please select an academic cohort standard.");
      setShowPopup(true);
      return;
    }
    if (!name.trim() || !rollNum || !password.trim()) {
      setMessage("Please fill in all scholar registration fields.");
      setShowPopup(true);
      return;
    }
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      setMessage("Global Scholar Enrolled Successfully");
      setShowPopup(true);
      setTimeout(() => {
        dispatch(underControl());
        navigate(-1);
      }, 700);
    } else if (status === "failed") {
      setMessage(response || "Enrollment encountered an error");
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
              <span className="lumina-badge cyan">Scholar Enrollment</span>
              <span className="lumina-badge">POST /StudentReg</span>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              Enroll Global Scholar
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Register student credentials and assign to an academic cohort.
            </Typography>
          </Box>
        </Box>

        <form onSubmit={submitHandler}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {situation !== "Class" && (
              <FormControl fullWidth>
                <InputLabel id="class-select-label" sx={{ color: "#94A3B8" }}>
                  Select Academic Cohort
                </InputLabel>
                <GlassSelect
                  labelId="class-select-label"
                  value={sclassName}
                  label="Select Academic Cohort"
                  onChange={(e) => setSclassName(e.target.value)}
                  required
                >
                  <MenuItem value="" disabled>
                    Choose Cohort
                  </MenuItem>
                  {Array.isArray(sclassesList) &&
                    sclassesList.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.sclassName}
                      </MenuItem>
                    ))}
                </GlassSelect>
              </FormControl>
            )}

            <GlassTextField
              label="Scholar Full Name"
              placeholder="e.g. Alex Rivera"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />

            <GlassTextField
              label="Roll / Matriculation Number"
              placeholder="e.g. 101"
              type="number"
              variant="outlined"
              fullWidth
              value={rollNum}
              onChange={(e) => setRollNum(e.target.value)}
              required
            />

            <GlassTextField
              label="Access Password"
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
                {loader ? <CircularProgress size={22} color="inherit" /> : "+ Enroll Scholar"}
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

export default AddStudent;

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

const GlassSelect = styled(Select)`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  color: #f8fafc !important;
  & fieldset {
    border-color: rgba(255, 255, 255, 0.12);
  }
  &:hover fieldset {
    border-color: rgba(0, 163, 255, 0.5);
  }
  &.Mui-focused fieldset {
    border-color: #00a3ff !important;
  }
  & .MuiSvgIcon-root {
    color: #94a3b8;
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

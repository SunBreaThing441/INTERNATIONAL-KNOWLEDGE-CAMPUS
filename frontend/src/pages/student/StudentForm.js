import React, { useState } from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BlueButton } from "../../components/buttonStyles";
import Popup from "../../components/Popup";
import { Person, ArrowBack, Save } from "@mui/icons-material";
import { useSelector } from "react-redux";

const StudentForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    dateOfBirth: "",
    gender: "Unspecified",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    emergencyContact: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.phone && formData.phone.length < 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      setShowPopup(true);
      return;
    }

    setMessage("Scholar Personal Dossier Updated Successfully");
    setShowPopup(true);
    setTimeout(() => {
      navigate("/Student/profile");
    }, 700);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 3 }}>
        <BackBtn onClick={() => navigate("/Student/profile")}>
          <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Back to Profile
        </BackBtn>
      </Box>

      <GlassFormCard>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconWrapper>
            <Person sx={{ fontSize: 28, color: "#00A3FF" }} />
          </IconWrapper>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge cyan">UNESCO Scholar Record</span>
              <span className="lumina-badge">Dossier Customization</span>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              Personal Scholar Dossier
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Maintain verified scholar contact information and emergency coordination data.
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <GlassTextField
                fullWidth
                label="Full Legal Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <GlassTextField
                fullWidth
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label" sx={{ color: "#94A3B8" }}>
                  Gender Identification
                </InputLabel>
                <GlassSelect
                  labelId="gender-label"
                  label="Gender Identification"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Non-Binary">Non-Binary</MenuItem>
                  <MenuItem value="Prefer Not To Say">Prefer Not To Say</MenuItem>
                  <MenuItem value="Unspecified">Unspecified</MenuItem>
                </GlassSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <GlassTextField
                fullWidth
                label="Primary Contact Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <GlassTextField
                fullWidth
                label="Direct Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. 5550192831"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <GlassTextField
                fullWidth
                label="Emergency Contact Phone"
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="e.g. 5550199999"
              />
            </Grid>

            <Grid item xs={12}>
              <GlassTextField
                fullWidth
                label="Residential / Campus Address"
                multiline
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter residential address..."
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 1 }}>
              <BlueButton
                type="submit"
                fullWidth
                size="large"
                startIcon={<Save />}
                sx={{ py: 1.5 }}
              >
                Save Scholar Dossier
              </BlueButton>
            </Grid>
          </Grid>
        </form>
      </GlassFormCard>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default StudentForm;

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

const BackBtn = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  &:hover {
    color: #f8fafc;
  }
`;

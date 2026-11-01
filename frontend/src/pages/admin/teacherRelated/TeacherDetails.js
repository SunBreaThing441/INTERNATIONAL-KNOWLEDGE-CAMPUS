import React, { useEffect } from "react";
import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import {
  School,
  MenuBook,
  ArrowBack,
  VerifiedUser,
  EventNote,
  Email,
} from "@mui/icons-material";
import { GreenButton, BlueButton } from "../../../components/buttonStyles";
import styled from "styled-components";

const TeacherDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, teacherDetails } = useSelector((state) => state.teacher);

  const teacherID = params.id;

  useEffect(() => {
    if (teacherID) {
      dispatch(getTeacherDetails(teacherID));
    }
  }, [dispatch, teacherID]);

  const hasSubject = Boolean(teacherDetails?.teachSubject?.subName);

  const handleAddSubject = () => {
    navigate(
      `/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 3 }}>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Back to Faculty Registry
        </BackBtn>
      </Box>

      {loading ? (
        <GlassCard sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" sx={{ color: "#94A3B8" }}>
            Retrieving Mentor Dossier...
          </Typography>
        </GlassCard>
      ) : (
        <GlassCard>
          {/* Header Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4, flexWrap: "wrap" }}>
            <Avatar
              sx={{
                width: 76,
                height: 76,
                bgcolor: "rgba(0, 196, 159, 0.2)",
                color: "#00C49F",
                fontWeight: 800,
                fontSize: "1.8rem",
                border: "2px solid rgba(0, 196, 159, 0.35)",
              }}
            >
              {teacherDetails?.name ? String(teacherDetails.name).charAt(0).toUpperCase() : "M"}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <span className="lumina-badge emerald">
                  <VerifiedUser sx={{ fontSize: 13 }} /> Verified Faculty Mentor
                </span>
                <span className="lumina-badge">UNESCO Standard 4.c</span>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
                {teacherDetails?.name || "Academic Mentor"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                Curriculum Facilitator • {teacherDetails?.teachSclass?.sclassName || "Unassigned Standard"}
              </Typography>
            </Box>

            {!hasSubject && (
              <GreenButton variant="contained" onClick={handleAddSubject}>
                + Assign Subject Discipline
              </GreenButton>
            )}
          </Box>

          {/* Details Grid */}
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <DetailTile>
                <Email sx={{ fontSize: 22, color: "#00A3FF" }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                    Faculty Communications
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                    {teacherDetails?.email || "Unspecified Contact"}
                  </Typography>
                </Box>
              </DetailTile>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailTile>
                <School sx={{ fontSize: 22, color: "#00C49F" }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                    Supervised Academic Cohort
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                    {teacherDetails?.teachSclass?.sclassName || "Unassigned Cohort"}
                  </Typography>
                </Box>
              </DetailTile>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailTile>
                <MenuBook sx={{ fontSize: 22, color: "#A855F7" }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                    Allocated Subject
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                    {teacherDetails?.teachSubject?.subName || "None Assigned"}
                  </Typography>
                </Box>
              </DetailTile>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DetailTile>
                <EventNote sx={{ fontSize: 22, color: "#F59E0B" }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                    Curriculum Sessions
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                    {teacherDetails?.teachSubject?.sessions || 0} Hours
                  </Typography>
                </Box>
              </DetailTile>
            </Grid>
          </Grid>

          {hasSubject && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <BlueButton variant="outlined" onClick={handleAddSubject}>
                Reassign Subject Discipline
              </BlueButton>
            </Box>
          )}
        </GlassCard>
      )}
    </Container>
  );
};

export default TeacherDetails;

const GlassCard = styled(Box)`
  background: rgba(13, 22, 41, 0.8);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 36px 32px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
`;

const DetailTile = styled(Box)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
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

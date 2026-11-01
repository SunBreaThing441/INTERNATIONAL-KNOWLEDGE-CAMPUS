import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Container, Grid, Avatar } from "@mui/material";
import { School, ClassOutlined, Badge, VerifiedUser, Person, Fingerprint } from "@mui/icons-material";
import styled from "styled-components";

const StudentProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <ProfileGlassCard>
          <Typography variant="h6" sx={{ color: "#EF4444", fontWeight: 700 }}>
            Scholar Session Dossier Unavailable
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1 }}>
            No authenticated Scholar profile detected. Please re-authenticate your session.
          </Typography>
        </ProfileGlassCard>
      </Container>
    );
  }

  const sclassName = currentUser?.sclassName?.sclassName || "Unassigned Standard";
  const schoolName = currentUser?.school?.schoolName || "Accredited Knowledge Hub";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Profile Card */}
      <ProfileGlassCard sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "rgba(168, 85, 247, 0.25)",
              color: "#A855F7",
              fontWeight: 800,
              fontSize: "2rem",
              border: "2px solid #A855F750",
            }}
          >
            {currentUser?.name ? String(currentUser.name).charAt(0).toUpperCase() : "S"}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <span className="lumina-badge purple">
                <VerifiedUser sx={{ fontSize: 13 }} /> Enrolled Scholar
              </span>
              <span className="lumina-badge emerald">Roll #{currentUser?.rollNum || "1"}</span>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              {currentUser?.name || "Global Scholar"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Primary Learner • UNESCO Decentralized Scholar Identity
            </Typography>
          </Box>
        </Box>
      </ProfileGlassCard>

      {/* Details Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DetailTile>
            <TileIconWrapper color="#A855F7">
              <Badge sx={{ fontSize: 22, color: "#A855F7" }} />
            </TileIconWrapper>
            <Box>
              <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                Scholar Roll Number
              </Typography>
              <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
                #{currentUser?.rollNum || "N/A"}
              </Typography>
            </Box>
          </DetailTile>
        </Grid>

        <Grid item xs={12} sm={6}>
          <DetailTile>
            <TileIconWrapper color="#00A3FF">
              <ClassOutlined sx={{ fontSize: 22, color: "#00A3FF" }} />
            </TileIconWrapper>
            <Box>
              <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                Enrolled Academic Cohort
              </Typography>
              <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                {sclassName}
              </Typography>
            </Box>
          </DetailTile>
        </Grid>

        <Grid item xs={12} sm={6}>
          <DetailTile>
            <TileIconWrapper color="#00C49F">
              <School sx={{ fontSize: 22, color: "#00C49F" }} />
            </TileIconWrapper>
            <Box>
              <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                Accredited Knowledge Hub
              </Typography>
              <Typography variant="body1" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
                {schoolName}
              </Typography>
            </Box>
          </DetailTile>
        </Grid>

        <Grid item xs={12} sm={6}>
          <DetailTile>
            <TileIconWrapper color="#F59E0B">
              <Fingerprint sx={{ fontSize: 22, color: "#F59E0B" }} />
            </TileIconWrapper>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                Decentralized Scholar ID
              </Typography>
              <Typography variant="body2" sx={{ color: "#F8FAFC", fontFamily: "monospace", fontWeight: 600, wordBreak: "break-all" }}>
                {currentUser?._id ? `${currentUser._id}` : "SCHOLAR-VERIFIED"}
              </Typography>
            </Box>
          </DetailTile>
        </Grid>

        <Grid item xs={12}>
          <DetailTile>
            <TileIconWrapper color="#0077D4">
              <Person sx={{ fontSize: 22, color: "#0077D4" }} />
            </TileIconWrapper>
            <Box>
              <Typography variant="caption" sx={{ color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                Institutional Standing
              </Typography>
              <Typography variant="body2" sx={{ color: "#00C49F", fontWeight: 600, mt: 0.2 }}>
                Active in Good Standing • Curriculum Evaluations Synchronized
              </Typography>
            </Box>
          </DetailTile>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentProfile;

const ProfileGlassCard = styled(Box)`
  background: rgba(13, 22, 41, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
`;

const DetailTile = styled(Box)`
  background: rgba(13, 22, 41, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.16);
    background: rgba(13, 22, 41, 0.8);
  }
`;

const TileIconWrapper = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${(props) => `${props.color}18`};
  border: 1px solid ${(props) => `${props.color}35`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

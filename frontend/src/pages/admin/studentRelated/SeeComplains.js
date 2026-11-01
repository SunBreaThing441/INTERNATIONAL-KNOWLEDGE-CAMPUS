import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Checkbox } from "@mui/material";
import { ReportProblemOutlined, VerifiedUser } from "@mui/icons-material";
import { getAllComplains } from "../../../redux/complainRelated/complainHandle";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import styled from "styled-components";

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector(
    (state) => state.complain
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllComplains(currentUser._id, "Complain"));
    }
  }, [currentUser, dispatch]);

  if (error) {
    console.error(error);
  }

  const complainColumns = [
    { id: "user", label: "Originator / Scholar", minWidth: 180 },
    { id: "complaint", label: "Ethical Dossier / Grievance Brief", minWidth: 320 },
    { id: "date", label: "Logged Date", minWidth: 140 },
  ];

  const validComplainsList = complainsList?.filter((complain) => {
    if (!complain || !complain.user || !complain.user.name) {
      return false;
    }
    return true;
  });

  const complainRows =
    validComplainsList?.map((complain) => ({
      user: complain.user.name,
      complaint: complain.complaint || "No grievance details specified",
      date: complain.date
        ? new Date(complain.date).toISOString().substring(0, 10)
        : "Recent",
      id: complain._id || "No ID",
    })) || [];

  const ComplainButtonHaver = () => (
    <Checkbox
      sx={{
        color: "rgba(255, 255, 255, 0.4)",
        "&.Mui-checked": {
          color: "#00C49F",
        },
      }}
    />
  );

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 3 } }}>
      {/* Header Banner */}
      <HeaderCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconWrapper>
            <ReportProblemOutlined sx={{ fontSize: 26, color: "#F59E0B" }} />
          </IconWrapper>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              Ethical Oversight & Grievance Console
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              UNESCO Global Standard 14: Transparent Review & Scholar Welfare Accountability
            </Typography>
          </Box>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={4} columns={3} />
      ) : response || complainRows.length === 0 ? (
        <EmptyStateCard>
          <VerifiedUser sx={{ fontSize: 48, color: "#00C49F", mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#F8FAFC" }}>
            Institutional Integrity Metrics Clear
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", maxWidth: 480, mt: 0.5 }}>
            No unresolved scholar grievances or ethical complaints are registered in this academic cycle.
          </Typography>
        </EmptyStateCard>
      ) : (
        <TableTemplate
          buttonHaver={ComplainButtonHaver}
          columns={complainColumns}
          rows={complainRows}
        />
      )}
    </Box>
  );
};

export default SeeComplains;

const HeaderCard = styled(Box)`
  background: rgba(13, 22, 41, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const IconWrapper = styled(Box)`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyStateCard = styled(Box)`
  background: rgba(13, 22, 41, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

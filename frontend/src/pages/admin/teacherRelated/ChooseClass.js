import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { Box, Container, Typography } from "@mui/material";
import { School, ArrowBack } from "@mui/icons-material";
import { BlueButton, GreenButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import styled from "styled-components";

const ChooseClass = ({ situation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }
  }, [currentUser, dispatch]);

  const navigateHandler = (classID) => {
    if (situation === "Teacher") {
      navigate(`/Admin/teachers/choosesubject/${classID}`);
    } else if (situation === "Subject") {
      navigate(`/Admin/addsubject/${classID}`);
    }
  };

  const sclassColumns = [
    { id: "name", label: "Academic Cohort / Standard", minWidth: 220 },
  ];

  const sclassRows =
    Array.isArray(sclassesList) && sclassesList.length > 0
      ? sclassesList.map((sclass) => ({
          name: sclass.sclassName,
          id: sclass._id,
        }))
      : [];

  const SclassButtonHaver = ({ row }) => (
    <BlueButton
      size="small"
      variant="contained"
      onClick={() => navigateHandler(row.id)}
    >
      Select Cohort
    </BlueButton>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, mb: 6 }}>
      <Box sx={{ mb: 3 }}>
        <BackBtn onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} /> Go Back
        </BackBtn>
      </Box>

      <HeaderCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconWrapper>
            <School sx={{ fontSize: 28, color: "#00A3FF" }} />
          </IconWrapper>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <span className="lumina-badge cyan">Allocation Conduit</span>
              <span className="lumina-badge">Step 1: Cohort Selection</span>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
              Choose Academic Cohort Standard
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Select target class standard to proceed with {situation === "Teacher" ? "faculty appointment" : "subject allocation"}.
            </Typography>
          </Box>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={4} columns={2} />
      ) : getresponse || sclassRows.length === 0 ? (
        <EmptyGlassCard>
          <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 700 }}>
            No Academic Cohorts Found
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5, mb: 2 }}>
            You need to configure at least one academic cohort before allocating disciplines.
          </Typography>
          <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")}>
            + Create Cohort First
          </GreenButton>
        </EmptyGlassCard>
      ) : (
        <TableTemplate
          buttonHaver={SclassButtonHaver}
          columns={sclassColumns}
          rows={sclassRows}
        />
      )}
    </Container>
  );
};

export default ChooseClass;

const HeaderCard = styled(Box)`
  background: rgba(13, 22, 41, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const IconWrapper = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: rgba(0, 163, 255, 0.12);
  border: 1px solid rgba(0, 163, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyGlassCard = styled(Box)`
  background: rgba(13, 22, 41, 0.6);
  backdrop-filter: blur(16px);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
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

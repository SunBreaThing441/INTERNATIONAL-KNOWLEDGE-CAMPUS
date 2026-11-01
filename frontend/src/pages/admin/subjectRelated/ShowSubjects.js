
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import {
  BlueButton,
  GreenButton,
  ButtonContainer,
} from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import styled from "styled-components";

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList, loading, error, response } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }
  }, [currentUser, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message] = useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    });
  };

  const subjectColumns = [
    { id: "subName", label: "Discipline / Subject", minWidth: 180 },
    { id: "sessions", label: "Required Sessions", minWidth: 140 },
    { id: "sclassName", label: "Cohort Standard", minWidth: 160 },
  ];

  const subjectRows =
    Array.isArray(subjectsList) && subjectsList.length > 0
      ? subjectsList.map((subject) => ({
          subName: subject.subName,
          sessions: subject.sessions,
          sclassName: subject.sclassName?.sclassName || "Unassigned",
          sclassID: subject.sclassName?._id || "",
          id: subject._id,
        }))
      : [];

  const SubjectsButtonHaver = ({ row }) => {
    return (
      <ButtonContainer>
        <IconButton
          onClick={() => deleteHandler(row.id, "Subject")}
          sx={{
            color: "#EF4444",
            "&:hover": { background: "rgba(239, 68, 68, 0.15)" },
          }}
        >
          <DeleteIcon />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() =>
            navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`)
          }
        >
          Inspect
        </BlueButton>
      </ButtonContainer>
    );
  };

  const actions = [
    {
      icon: <PostAddIcon color="primary" />,
      name: "Introduce New Discipline",
      action: () => navigate("/Admin/subjects/chooseclass"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Purge All Disciplines",
      action: () => deleteHandler(currentUser._id, "Subjects"),
    },
  ];

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 3 } }}>
      {/* Header Banner */}
      <HeaderCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconWrapper>
              <AutoStoriesIcon sx={{ fontSize: 26, color: "#A855F7" }} />
            </IconWrapper>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#F8FAFC",
                  letterSpacing: "-0.01em",
                }}
              >
                Curriculum Disciplines & Syllabus Catalogue
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                UNESCO Open Education Syllabus • Active Modules: {subjectRows.length}
              </Typography>
            </Box>
          </Box>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/subjects/chooseclass")}
          >
            + Allocate Discipline
          </GreenButton>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={4} columns={3} />
      ) : response || subjectRows.length === 0 ? (
        <EmptyStateCard>
          <AutoStoriesIcon sx={{ fontSize: 48, color: "#A855F7", mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#F8FAFC" }}>
            No Disciplines Allocated to Cohorts
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#94A3B8", maxWidth: 460, mt: 0.5, mb: 2 }}
          >
            Create foundational modules (e.g., Mathematics, Computer Science, Global Ethics) and assign credit sessions.
          </Typography>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/subjects/chooseclass")}
          >
            Allocate First Discipline
          </GreenButton>
        </EmptyStateCard>
      ) : (
        <>
          <TableTemplate
            buttonHaver={SubjectsButtonHaver}
            columns={subjectColumns}
            rows={subjectRows}
          />
          <SpeedDialTemplate actions={actions} />
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default ShowSubjects;

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
  background: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.25);
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

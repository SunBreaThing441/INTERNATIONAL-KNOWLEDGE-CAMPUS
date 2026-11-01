import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import CampaignIcon from "@mui/icons-material/Campaign";
import { getAllNotices } from "../../../redux/noticeRelated/noticeHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import { GreenButton } from "../../../components/buttonStyles";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import styled from "styled-components";

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { noticesList, loading, error } = useSelector(
    (state) => state.notice
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllNotices(currentUser._id, "Notice"));
    }
  }, [currentUser, dispatch]);

  if (error) {
    console.log(error);
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllNotices(currentUser._id, "Notice"));
    });
  };

  const noticeColumns = [
    { id: "title", label: "Gazette Title", minWidth: 200 },
    { id: "details", label: "Executive Brief / Summary", minWidth: 320 },
    { id: "date", label: "Broadcast Date", minWidth: 140 },
  ];

  const noticeRows =
    Array.isArray(noticesList) && noticesList.length > 0
      ? noticesList.map((notice) => {
          const date = new Date(notice.date);
          const dateString =
            date.toString() !== "Invalid Date"
              ? date.toISOString().substring(0, 10)
              : "Recent";
          return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
          };
        })
      : [];

  const NoticeButtonHaver = ({ row }) => {
    return (
      <IconButton
        onClick={() => deleteHandler(row.id, "Notice")}
        sx={{
          color: "#EF4444",
          "&:hover": { background: "rgba(239, 68, 68, 0.15)" },
        }}
      >
        <DeleteIcon />
      </IconButton>
    );
  };

  const actions = [
    {
      icon: <NoteAddIcon color="primary" />,
      name: "Broadcast New Notice",
      action: () => navigate("/Admin/addnotice"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Purge All Gazettes",
      action: () => deleteHandler(currentUser._id, "Notices"),
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
              <CampaignIcon sx={{ fontSize: 26, color: "#00C49F" }} />
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
                Institutional Gazettes & Circular Bulletins
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                UNESCO Open Education Broadcast Network • Active Circulars: {noticeRows.length}
              </Typography>
            </Box>
          </Box>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/addnotice")}
          >
            + Broadcast Circular
          </GreenButton>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={4} columns={3} />
      ) : noticeRows.length === 0 ? (
        <EmptyStateCard>
          <CampaignIcon sx={{ fontSize: 48, color: "#00C49F", mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#F8FAFC" }}>
            No Public Bulletins Broadcasted
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#94A3B8", maxWidth: 460, mt: 0.5, mb: 2 }}
          >
            Publish executive directives, semester schedules, or institutional guidelines across the campus portal.
          </Typography>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/addnotice")}
          >
            Publish First Bulletin
          </GreenButton>
        </EmptyStateCard>
      ) : (
        <>
          <TableTemplate
            buttonHaver={NoticeButtonHaver}
            columns={noticeColumns}
            rows={noticeRows}
          />
          <SpeedDialTemplate actions={actions} />
        </>
      )}
    </Box>
  );
};

export default ShowNotices;

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
  background: rgba(0, 196, 159, 0.12);
  border: 1px solid rgba(0, 196, 159, 0.25);
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

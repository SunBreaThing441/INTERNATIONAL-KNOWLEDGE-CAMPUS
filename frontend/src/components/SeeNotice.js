import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../redux/noticeRelated/noticeHandle";
import { Box, Typography, CircularProgress } from "@mui/material";
import TableViewTemplate from "./TableViewTemplate";

const SeeNotice = () => {
  const dispatch = useDispatch();

  const { currentUser, currentRole } = useSelector((state) => state.user);
  const { noticesList, loading, response } = useSelector((state) => state.notice);

  useEffect(() => {
    const schoolId =
      currentRole === "Admin"
        ? currentUser?._id
        : currentUser?.school?._id || currentUser?.school;

    if (schoolId) {
      dispatch(getAllNotices(schoolId, "Notice"));
    }
  }, [dispatch, currentRole, currentUser]);

  const noticeColumns = [
    { id: "title", label: "Gazette Title", minWidth: 200 },
    { id: "details", label: "Brief / Directive", minWidth: 300 },
    { id: "date", label: "Broadcast Date", minWidth: 140 },
  ];

  const noticeRows = Array.isArray(noticesList)
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

  return (
    <Box sx={{ width: "100%" }}>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={28} sx={{ color: "#00A3FF" }} />
          <Typography variant="body2" sx={{ color: "#94A3B8", mt: 1 }}>
            Retrieving Global Gazettes...
          </Typography>
        </Box>
      ) : response || noticeRows.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "#94A3B8" }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            No Active Gazettes or Circulars Broadcasted
          </Typography>
          <Typography variant="caption">
            Official announcements published by administration will appear here.
          </Typography>
        </Box>
      ) : (
        <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
      )}
    </Box>
  );
};

export default SeeNotice;

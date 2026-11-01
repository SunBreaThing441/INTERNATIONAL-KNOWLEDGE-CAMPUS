import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { StyledTableCell, StyledTableRow } from "../../../components/styles";
import { BlueButton, GreenButton, ButtonContainer } from "../../../components/buttonStyles";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import styled from "styled-components";

const ShowTeachers = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teachersList, loading, error, response } = useSelector(
    (state) => state.teacher
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllTeachers(currentUser._id));
    }
  }, [currentUser, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message] = useState("");

  if (error) {
    console.log(error);
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllTeachers(currentUser._id));
    });
  };

  const columns = [
    { id: "name", label: "Faculty / Mentor Name", minWidth: 180 },
    { id: "teachSubject", label: "Discipline Assigned", minWidth: 160 },
    { id: "teachSclass", label: "Supervised Cohort", minWidth: 160 },
  ];

  const rows =
    Array.isArray(teachersList) && teachersList.length > 0
      ? teachersList.map((teacher) => ({
          name: teacher.name,
          teachSubject: teacher.teachSubject?.subName || null,
          teachSclass: teacher.teachSclass?.sclassName || "Unassigned",
          teachSclassID: teacher.teachSclass?._id || "",
          id: teacher._id,
        }))
      : [];

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Onboard Faculty Mentor",
      action: () => navigate("/Admin/teachers/chooseclass"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Purge All Mentors",
      action: () => deleteHandler(currentUser._id, "Teachers"),
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
              <SupervisorAccountIcon sx={{ fontSize: 26, color: "#0077D4" }} />
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
                Global Faculty Directory & Mentor Roster
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                UNESCO Pedagogical Facilitators • Active Faculty: {rows.length}
              </Typography>
            </Box>
          </Box>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/teachers/chooseclass")}
          >
            + Onboard Mentor
          </GreenButton>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : response || rows.length === 0 ? (
        <EmptyStateCard>
          <SupervisorAccountIcon sx={{ fontSize: 48, color: "#0077D4", mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#F8FAFC" }}>
            No Faculty Mentors Registered
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#94A3B8", maxWidth: 460, mt: 0.5, mb: 2 }}
          >
            Onboard expert instructors to allocate teaching disciplines, record student evaluations, and manage academic cohorts.
          </Typography>
          <GreenButton
            variant="contained"
            onClick={() => navigate("/Admin/teachers/chooseclass")}
          >
            Onboard First Mentor
          </GreenButton>
        </EmptyStateCard>
      ) : (
        <GlassTableContainer>
          <TableContainer>
            <Table stickyHeader aria-label="faculty directory">
              <TableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StyledTableRow hover tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === "teachSubject") {
                          return (
                            <StyledTableCell key={column.id} align={column.align}>
                              {value ? (
                                <span className="lumina-badge cyan">{value}</span>
                              ) : (
                                <BlueButton
                                  variant="contained"
                                  size="small"
                                  onClick={() => {
                                    navigate(
                                      `/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`
                                    );
                                  }}
                                >
                                  Assign Subject
                                </BlueButton>
                              )}
                            </StyledTableCell>
                          );
                        }
                        return (
                          <StyledTableCell key={column.id} align={column.align}>
                            {value}
                          </StyledTableCell>
                        );
                      })}
                      <StyledTableCell align="center">
                        <ButtonContainer>
                          <IconButton
                            onClick={() => deleteHandler(row.id, "Teacher")}
                            sx={{
                              color: "#EF4444",
                              "&:hover": { background: "rgba(239, 68, 68, 0.15)" },
                            }}
                          >
                            <PersonRemoveIcon />
                          </IconButton>
                          <BlueButton
                            variant="contained"
                            onClick={() =>
                              navigate("/Admin/teachers/teacher/" + row.id)
                            }
                          >
                            Inspect
                          </BlueButton>
                        </ButtonContainer>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            sx={{
              color: "#94A3B8",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              "& .MuiTablePagination-selectIcon": { color: "#94A3B8" },
            }}
          />
          <SpeedDialTemplate actions={actions} />
        </GlassTableContainer>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default ShowTeachers;

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
  background: rgba(0, 119, 212, 0.12);
  border: 1px solid rgba(0, 119, 212, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlassTableContainer = styled(Box)`
  background: rgba(13, 22, 41, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
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

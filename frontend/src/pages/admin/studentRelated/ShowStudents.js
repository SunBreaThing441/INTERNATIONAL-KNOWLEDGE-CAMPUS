import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import {
  Box,
  IconButton,
  Typography,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SchoolIcon from "@mui/icons-material/School";
import {
  BlackButton,
  BlueButton,
  GreenButton,
  ButtonContainer,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Popup from "../../../components/Popup";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import styled from "styled-components";

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList, loading, error, response } = useSelector(
    (state) => state.student
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllStudents(currentUser._id));
    }
  }, [currentUser, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message] = useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllStudents(currentUser._id));
    });
  };

  const studentColumns = [
    { id: "name", label: "Scholar Name", minWidth: 180 },
    { id: "rollNum", label: "Roll ID", minWidth: 100 },
    { id: "sclassName", label: "Enrolled Cohort", minWidth: 160 },
  ];

  const studentRows =
    Array.isArray(studentsList) && studentsList.length > 0
      ? studentsList.map((student) => ({
          name: student.name,
          rollNum: student.rollNum,
          sclassName: student.sclassName?.sclassName || "Unassigned",
          id: student._id,
        }))
      : [];

  const StudentButtonHaver = ({ row }) => {
    const options = ["Mark Attendance", "Record Grades"];
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClick = () => {
      if (selectedIndex === 0) {
        navigate("/Admin/students/student/attendance/" + row.id);
      } else if (selectedIndex === 1) {
        navigate("/Admin/students/student/marks/" + row.id);
      }
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
      if (index === 0) {
        navigate("/Admin/students/student/attendance/" + row.id);
      } else {
        navigate("/Admin/students/student/marks/" + row.id);
      }
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    return (
      <ButtonContainer>
        <IconButton
          onClick={() => deleteHandler(row.id, "Student")}
          sx={{
            color: "#EF4444",
            "&:hover": { background: "rgba(239, 68, 68, 0.15)" },
          }}
        >
          <PersonRemoveIcon />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/students/student/" + row.id)}
        >
          Inspect
        </BlueButton>

        <Box sx={{ display: "inline-flex" }}>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            sx={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <Button
              onClick={handleClick}
              sx={{
                background: "transparent",
                color: "#F8FAFC",
                textTransform: "none",
                fontSize: "0.8rem",
                fontWeight: 600,
                px: 1.5,
                "&:hover": { background: "rgba(0, 163, 255, 0.2)" },
              }}
            >
              {options[selectedIndex]}
            </Button>
            <BlackButton
              size="small"
              onClick={handleToggle}
              sx={{
                px: 0.5,
                minWidth: "auto",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#94A3B8",
              }}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </BlackButton>
          </ButtonGroup>
          <Popper
            sx={{ zIndex: 1300 }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper
                  sx={{
                    background: "rgba(13, 22, 41, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    mt: 1,
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoItemFocus>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                          sx={{
                            color: "#F8FAFC",
                            fontSize: "0.85rem",
                            "&.Mui-selected": {
                              background: "rgba(0, 163, 255, 0.2)",
                            },
                            "&:hover": { background: "rgba(0, 163, 255, 0.15)" },
                          }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Box>
      </ButtonContainer>
    );
  };

  const actions = [
    {
      icon: <PersonAddAlt1Icon color="primary" />,
      name: "Enroll New Scholar",
      action: () => navigate("/Admin/addstudents"),
    },
    {
      icon: <PersonRemoveIcon color="error" />,
      name: "Purge All Scholars",
      action: () => deleteHandler(currentUser._id, "Students"),
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
              <SchoolIcon sx={{ fontSize: 26, color: "#00C49F" }} />
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
                Global Scholar Roster & Enrollee Registry
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                UNESCO Open Education Network • Active Scholars: {studentRows.length}
              </Typography>
            </Box>
          </Box>
          <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
            + Enroll Scholar
          </GreenButton>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : response || studentRows.length === 0 ? (
        <EmptyStateCard>
          <SchoolIcon sx={{ fontSize: 48, color: "#00C49F", mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#F8FAFC" }}>
            No Scholars Enrolled in Current Registry
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#94A3B8", maxWidth: 460, mt: 0.5, mb: 2 }}
          >
            Admit new students into academic cohorts to track attendance credentials and curriculum grading.
          </Typography>
          <GreenButton variant="contained" onClick={() => navigate("/Admin/addstudents")}>
            Enroll First Scholar
          </GreenButton>
        </EmptyStateCard>
      ) : (
        <>
          <TableTemplate
            buttonHaver={StudentButtonHaver}
            columns={studentColumns}
            rows={studentRows}
          />
          <SpeedDialTemplate actions={actions} />
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default ShowStudents;

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

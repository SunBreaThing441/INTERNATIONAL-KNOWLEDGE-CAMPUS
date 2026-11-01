import { useEffect, useState } from "react";
import {
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { BlueButton, GreenButton, ButtonContainer } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import { TableSkeleton } from "../../../components/LuminaSkeleton";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AddCardIcon from "@mui/icons-material/AddCard";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import styled from "styled-components";
import SpeedDialTemplate from "../../../components/SpeedDialTemplate";
import Popup from "../../../components/Popup";

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllSclasses(adminID, "Sclass"));
    }
  }, [adminID, dispatch]);

  if (error) {
    console.log(error);
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message] = useState("");

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteUser(deleteID, address)).then(() => {
      dispatch(getAllSclasses(adminID, "Sclass"));
    });
  };

  const sclassColumns = [
    { id: "name", label: "Academic Cohort / Standard", minWidth: 200 },
  ];

  const sclassRows =
    Array.isArray(sclassesList) && sclassesList.length > 0
      ? sclassesList.map((sclass) => ({
          name: sclass.sclassName,
          id: sclass._id,
        }))
      : [];

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      {
        icon: <PostAddIcon sx={{ color: "#00A3FF" }} />,
        name: "Allocate Subject",
        action: () => navigate("/Admin/addsubject/" + row.id),
      },
      {
        icon: <PersonAddAlt1Icon sx={{ color: "#00C49F" }} />,
        name: "Enroll Scholar",
        action: () => navigate("/Admin/class/addstudents/" + row.id),
      },
    ];

    return (
      <ButtonContainer>
        <IconButton
          onClick={() => deleteHandler(row.id, "Sclass")}
          sx={{
            color: "#EF4444",
            "&:hover": { background: "rgba(239, 68, 68, 0.15)" },
          }}
        >
          <DeleteIcon />
        </IconButton>
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Admin/classes/class/" + row.id)}
        >
          Inspect Cohort
        </BlueButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Allocate Scholars & Subjects">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{
                ml: 1,
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#F8FAFC",
                "&:hover": { background: "rgba(255, 255, 255, 0.12)" },
              }}
              aria-controls={open ? "cohort-action-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <SpeedDialIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="cohort-action-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {actions.map((action, idx) => (
            <MenuItem
              key={idx}
              onClick={action.action}
              sx={{
                color: "#F8FAFC",
                fontSize: "0.85rem",
                "&:hover": { background: "rgba(0, 163, 255, 0.15)" },
              }}
            >
              <ListItemIcon fontSize="small">{action.icon}</ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const actions = [
    {
      icon: <AddCardIcon color="primary" />,
      name: "Establish New Cohort",
      action: () => navigate("/Admin/addclass"),
    },
    {
      icon: <DeleteIcon color="error" />,
      name: "Purge All Cohorts",
      action: () => deleteHandler(adminID, "Sclasses"),
    },
  ];

  return (
    <Box sx={{ width: "100%", p: { xs: 1, md: 3 } }}>
      {/* Header Banner */}
      <HeaderCard>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconWrapper>
              <ClassOutlinedIcon sx={{ fontSize: 26, color: "#00A3FF" }} />
            </IconWrapper>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#F8FAFC", letterSpacing: "-0.01em" }}>
                Academic Cohorts & Standards (Sclasses)
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                UNESCO Structured Learning Tiers • Active Cohorts: {sclassRows.length}
              </Typography>
            </Box>
          </Box>
          <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")}>
            + Create Cohort
          </GreenButton>
        </Box>
      </HeaderCard>

      {loading ? (
        <TableSkeleton rows={4} columns={2} />
      ) : getresponse || sclassRows.length === 0 ? (
        <EmptyStateCard>
          <ClassOutlinedIcon sx={{ fontSize: 48, color: "#00A3FF", mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#F8FAFC" }}>
            No Academic Cohorts Configured
          </Typography>
          <Typography variant="body2" sx={{ color: "#94A3B8", maxWidth: 460, mt: 0.5, mb: 2 }}>
            Initialize your institution's grade levels or student cohorts to begin allocating subjects and mentoring faculty.
          </Typography>
          <GreenButton variant="contained" onClick={() => navigate("/Admin/addclass")}>
            Establish First Cohort
          </GreenButton>
        </EmptyStateCard>
      ) : (
        <>
          <TableTemplate
            buttonHaver={SclassButtonHaver}
            columns={sclassColumns}
            rows={sclassRows}
          />
          <SpeedDialTemplate actions={actions} />
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default ShowClasses;

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
  background: rgba(0, 163, 255, 0.12);
  border: 1px solid rgba(0, 163, 255, 0.25);
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

const styles = {
  styledPaper: {
    background: "rgba(13, 22, 41, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    mt: 1.5,
  },
};

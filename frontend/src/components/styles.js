import {
  TableCell,
  TableRow,
  styled,
  tableCellClasses,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
} from "@mui/material";

const drawerWidth = 260;

// Sleek Lumina Table Cell
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(11, 19, 43, 0.95)",
    color: "#00A3FF",
    fontSize: "0.82rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid rgba(0, 119, 212, 0.35)",
    padding: "16px 20px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.9rem",
    color: "#E2E8F0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    padding: "14px 20px",
  },
}));

// Sleek Lumina Table Row with interactive glow
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "transparent",
  transition: "all 0.2s ease-in-out",
  "&:nth-of-type(even)": {
    backgroundColor: "rgba(255, 255, 255, 0.015)",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 119, 212, 0.08) !important",
  },
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

// Lumina Futuristic Glassmorphic AppBar
export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "rgba(7, 13, 30, 0.78)",
  backdropFilter: "blur(20px) saturate(190%)",
  WebkitBackdropFilter: "blur(20px) saturate(190%)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
  color: "#F8FAFC",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Lumina Frosted Glass Drawer
export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(0, 163, 255, 0.3) rgba(7, 13, 30, 0.4)",
    "&::-webkit-scrollbar": {
      width: "5px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(7, 13, 30, 0.4)",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(0, 163, 255, 0.3)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "rgba(0, 163, 255, 0.6)",
    },
    backgroundColor: "rgba(11, 19, 43, 0.85)",
    backdropFilter: "blur(24px) saturate(200%)",
    WebkitBackdropFilter: "blur(24px) saturate(200%)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "8px 0 32px 0 rgba(0, 0, 0, 0.5)",
    color: "#E2E8F0",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(8),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

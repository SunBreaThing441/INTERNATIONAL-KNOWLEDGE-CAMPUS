import { createSlice } from "@reduxjs/toolkit";

/**
 * Defensive session loader:
 * Safely parses and validates localStorage('user') to protect against JSON injection or session corruption.
 */
const loadUserSession = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { currentUser: null, currentRole: null };

    const parsed = JSON.parse(raw);
    const validRoles = ["Admin", "Teacher", "Student"];

    // Validate minimum required schema: object with an ID and recognized role
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed._id &&
      validRoles.includes(parsed.role)
    ) {
      return { currentUser: parsed, currentRole: parsed.role };
    }

    // Corrupt or tampered session schema detected — purge storage
    localStorage.removeItem("user");
    return { currentUser: null, currentRole: null };
  } catch (err) {
    console.error("Lumina Auth Guard: Session hydration corrupted, resetting storage.", err);
    try {
      localStorage.removeItem("user");
    } catch (_) {}
    return { currentUser: null, currentRole: null };
  }
};

const initialSession = loadUserSession();

const initialState = {
  status: "idle", // 'idle' | 'loading' | 'success' | 'failed' | 'error' | 'added'
  userDetails: null,
  tempDetails: [],
  loading: false,
  currentUser: initialSession.currentUser,
  currentRole: initialSession.currentRole,
  error: null,
  response: null,
  darkMode: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    authRequest: (state) => {
      state.status = "loading";
      state.loading = true;
      state.error = null;
      state.response = null;
    },

    authSuccess: (state, action) => {
      const payload = action.payload;
      state.status = "success";
      state.loading = false;
      state.currentUser = payload;
      state.currentRole = payload?.role || null;
      state.response = null;
      state.error = null;

      // Persist authenticated identity safely to localStorage
      try {
        if (payload && payload._id) {
          localStorage.setItem("user", JSON.stringify(payload));
        }
      } catch (err) {
        console.error("Failed to persist user session to localStorage:", err);
      }
    },

    authFailed: (state, action) => {
      state.status = "failed";
      state.loading = false;
      state.response = action.payload;
      state.error = null;
    },

    authError: (state, action) => {
      state.status = "error";
      state.loading = false;
      state.error = action.payload;
    },

    authLogout: (state) => {
      // Securely flush cached tokens and user credentials
      try {
        localStorage.removeItem("user");
        sessionStorage.clear();
      } catch (err) {
        console.error("Error during storage flush on logout:", err);
      }

      state.currentUser = null;
      state.currentRole = null;
      state.status = "idle";
      state.userDetails = null;
      state.tempDetails = [];
      state.loading = false;
      state.error = null;
      state.response = null;
    },

    sessionExpired: (state, action) => {
      try {
        localStorage.removeItem("user");
        sessionStorage.clear();
      } catch (_) {}

      state.currentUser = null;
      state.currentRole = null;
      state.status = "idle";
      state.userDetails = null;
      state.tempDetails = [];
      state.loading = false;
      state.error = action.payload || "Session expired or access revoked. Please re-authenticate.";
      state.response = null;
    },

    underControl: (state) => {
      state.status = "idle";
      state.response = null;
    },

    clearError: (state) => {
      state.error = null;
      state.response = null;
    },

    stuffAdded: (state, action) => {
      state.status = "added";
      state.loading = false;
      state.response = null;
      state.error = null;
      state.tempDetails = action.payload;
    },

    doneSuccess: (state, action) => {
      state.userDetails = action.payload;
      state.loading = false;
      state.error = null;
      state.response = null;
    },

    getDeleteSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },

    getRequest: (state) => {
      state.loading = true;
    },

    getFailed: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },

    getError: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || "An unexpected error occurred";
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  authRequest,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  sessionExpired,
  underControl,
  clearError,
  stuffAdded,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
  toggleDarkMode,
} = userSlice.actions;

export const userReducer = userSlice.reducer;

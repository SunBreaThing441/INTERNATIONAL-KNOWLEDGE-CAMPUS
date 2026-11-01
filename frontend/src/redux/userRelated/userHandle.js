import { apiClient, authApi } from "../../api/apiClient";
import {
  authRequest,
  stuffAdded,
  authSuccess,
  authFailed,
  authError,
  authLogout,
  sessionExpired,
  doneSuccess,
  getDeleteSuccess,
  getRequest,
  getFailed,
  getError,
} from "./userSlice";

/**
 * Defensive profile record sanitizer:
 * Strips password hashes, normalizes identifiers, and ensures role consistency.
 */
const sanitizeProfile = (rawUser, defaultRole) => {
  if (!rawUser || typeof rawUser !== "object") return null;
  const user = { ...rawUser };
  delete user.password;
  user.role = user.role || defaultRole;
  if (!user.name && user.studentName) {
    user.name = user.studentName;
  }
  return user;
};

/**
 * loginUser: Securely dispatch role authentication request to root router.
 * Populates Redux with sanitized profile records.
 */
export const loginUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    let result;
    if (role === "Admin") {
      result = await authApi.adminLogin(fields);
    } else if (role === "Teacher") {
      result = await authApi.teacherLogin(fields);
    } else if (role === "Student") {
      result = await authApi.studentLogin(fields);
    } else {
      result = await apiClient.post(`/${role}Login`, fields);
    }

    if (result.data && (result.data.role || result.data._id)) {
      const sanitized = sanitizeProfile(result.data, role);
      dispatch(authSuccess(sanitized));
    } else {
      dispatch(authFailed(result.data?.message || "Invalid credentials or user not found"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Network connection error to authentication server";
    dispatch(authError(message));
  }
};

/**
 * registerUser: Registers a new knowledge hub / admin / teacher / student user.
 */
export const registerUser = (fields, role) => async (dispatch) => {
  dispatch(authRequest());

  try {
    let result;
    if (role === "Admin") {
      result = await authApi.adminRegister(fields);
    } else if (role === "Teacher") {
      result = await authApi.teacherRegister(fields);
    } else if (role === "Student") {
      result = await authApi.studentRegister(fields);
    } else {
      result = await apiClient.post(`/${role}Reg`, fields);
    }

    if (result.data?.schoolName) {
      const sanitized = sanitizeProfile(result.data, "Admin");
      dispatch(authSuccess(sanitized));
    } else if (result.data?.school || result.data?._id) {
      dispatch(stuffAdded(result.data));
    } else {
      dispatch(authFailed(result.data?.message || "Registration encountered an error"));
    }
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Network error during registration";
    dispatch(authError(message));
  }
};

/**
 * logoutUser: Secure unified logout handler.
 * - Flushes localStorage('user')
 * - Flushes sessionStorage
 * - Resets Redux user slice to 'idle'
 */
export const logoutUser = () => (dispatch) => {
  try {
    localStorage.removeItem("user");
    sessionStorage.clear();
  } catch (err) {
    console.error("Storage flush error on logout:", err);
  }
  dispatch(authLogout());
};

/**
 * getUserDetails: Retrieve user dossier.
 * Dispatches sessionExpired if unauthorized/forbidden response occurs.
 */
export const getUserDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await apiClient.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      dispatch(sessionExpired("Session credentials expired or unauthorized"));
    } else {
      dispatch(getError(error));
    }
  }
};

/**
 * deleteUser: Delete a record by ID and model address.
 */
export const deleteUser = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await apiClient.delete(`/${address}/${id}`);
    if (result.data?.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getDeleteSuccess());
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

/**
 * updateUser: Update fields of a user document.
 */
export const updateUser = (fields, id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await apiClient.put(`/${address}/${id}`, fields);
    if (result.data?.schoolName) {
      const sanitized = sanitizeProfile(result.data, "Admin");
      dispatch(authSuccess(sanitized));
    } else {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    dispatch(getError(error));
  }
};

/**
 * addStuff: General entity creation dispatcher (SclassCreate, SubjectCreate, NoticeCreate, ComplainCreate).
 */
export const addStuff = (fields, address) => async (dispatch) => {
  dispatch(authRequest());

  try {
    const result = await apiClient.post(`/${address}Create`, fields);
    if (result.data?.message) {
      dispatch(authFailed(result.data.message));
    } else {
      dispatch(stuffAdded(result.data));
    }
  } catch (error) {
    dispatch(authError(error));
  }
};

import { apiClient, classroomApi } from "../../api/apiClient";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  stuffDone,
} from "./studentSlice";

/**
 * getAllStudents: Fetches all students enrolled under a school/academy.
 * Endpoint: GET /Students/:id
 */
export const getAllStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await classroomApi.getStudents(id);

    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to retrieve student roster";
    dispatch(getError(message));
  }
};

/**
 * updateStudentFields: Daily classroom operations
 * - StudentAttendance: PUT /StudentAttendance/:id (with { subName, status, date })
 * - UpdateExamResult: PUT /UpdateExamResult/:id (with { subName, marksObtained })
 * - Other student field modifications
 */
export const updateStudentFields = (id, fields, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    let result;
    if (address === "StudentAttendance") {
      result = await classroomApi.updateAttendance(id, fields);
    } else if (address === "UpdateExamResult") {
      result = await classroomApi.updateExamResult(id, fields);
    } else {
      result = await apiClient.put(`/${address}/${id}`, fields);
    }

    if (result.data?.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Classroom operation failed";
    dispatch(getError(message));
  }
};

/**
 * removeStuff: Removes or clears attendance/scores
 */
export const removeStuff = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await apiClient.put(`/${address}/${id}`);
    if (result.data?.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(stuffDone());
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Removal operation failed";
    dispatch(getError(message));
  }
};

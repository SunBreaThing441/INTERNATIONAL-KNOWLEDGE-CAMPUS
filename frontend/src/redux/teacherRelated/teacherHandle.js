import { classroomApi, academicApi } from "../../api/apiClient";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  postDone,
  doneSuccess,
} from "./teacherSlice";

/**
 * getAllTeachers: Fetches all faculty mentors for a school.
 * Endpoint: GET /Teachers/:id
 */
export const getAllTeachers = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await classroomApi.getTeachers(id);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to retrieve faculty list";
    dispatch(getError(message));
  }
};

/**
 * getTeacherDetails: Fetches individual teacher profile.
 * Endpoint: GET /Teacher/:id
 */
export const getTeacherDetails = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await classroomApi.getTeacherDetail(id);
    if (result.data) {
      dispatch(doneSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to retrieve teacher details";
    dispatch(getError(message));
  }
};

/**
 * updateTeachSubject: Assigns a subject to a teacher.
 * Endpoint: PUT /TeacherSubject
 */
export const updateTeachSubject =
  (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
      await academicApi.updateTeacherSubject({ teacherId, teachSubject });
      dispatch(postDone());
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to assign subject to teacher";
      dispatch(getError(message));
    }
  };

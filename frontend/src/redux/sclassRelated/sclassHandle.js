import { apiClient, academicApi } from "../../api/apiClient";
import {
  getRequest,
  getSuccess,
  getFailed,
  getError,
  getStudentsSuccess,
  detailsSuccess,
  getFailedTwo,
  getSubjectsSuccess,
  getSubDetailsSuccess,
  getSubDetailsRequest,
} from "./sclassSlice";

export const getAllSclasses = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await apiClient.get(`/${address}List/${id}`);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch classes";
    dispatch(getError(message));
  }
};

export const getClassStudents = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await academicApi.getClassStudents(id);
    if (result.data.message) {
      dispatch(getFailedTwo(result.data.message));
    } else {
      dispatch(getStudentsSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch class students";
    dispatch(getError(message));
  }
};

export const getClassDetails = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await apiClient.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(detailsSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch class details";
    dispatch(getError(message));
  }
};

export const getSubjectList = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await apiClient.get(`/${address}/${id}`);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSubjectsSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch subject list";
    dispatch(getError(message));
  }
};

export const getTeacherFreeClassSubjects = (id) => async (dispatch) => {
  dispatch(getRequest());

  try {
    const result = await academicApi.getFreeSubjects(id);
    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSubjectsSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch free subjects";
    dispatch(getError(message));
  }
};

export const getSubjectDetails = (id, address) => async (dispatch) => {
  dispatch(getSubDetailsRequest());

  try {
    const result = await apiClient.get(`/${address}/${id}`);
    if (result.data) {
      dispatch(getSubDetailsSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch subject details";
    dispatch(getError(message));
  }
};

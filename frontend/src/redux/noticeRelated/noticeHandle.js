import { bulletinApi, apiClient } from "../../api/apiClient";
import { getRequest, getSuccess, getFailed, getError } from "./noticeSlice";

/**
 * getAllNotices: Fetches school notices bulletin.
 * Endpoint: GET /NoticeList/:id
 */
export const getAllNotices = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    let result;
    if (address === "Notice") {
      result = await bulletinApi.getNotices(id);
    } else {
      result = await apiClient.get(`/${address}List/${id}`);
    }

    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch notices bulletin";
    dispatch(getError(message));
  }
};

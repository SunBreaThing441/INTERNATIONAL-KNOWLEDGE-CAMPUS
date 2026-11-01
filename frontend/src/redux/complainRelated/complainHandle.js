import { grievanceApi, apiClient } from "../../api/apiClient";
import { getRequest, getSuccess, getFailed, getError } from "./complainSlice";

/**
 * getAllComplains: Fetches school grievances and feedback memos.
 * Endpoint: GET /ComplainList/:id
 */
export const getAllComplains = (id, address) => async (dispatch) => {
  dispatch(getRequest());

  try {
    let result;
    if (address === "Complain") {
      result = await grievanceApi.getComplains(id);
    } else {
      result = await apiClient.get(`/${address}List/${id}`);
    }

    if (result.data.message) {
      dispatch(getFailed(result.data.message));
    } else {
      dispatch(getSuccess(result.data));
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Failed to fetch grievances";
    dispatch(getError(message));
  }
};

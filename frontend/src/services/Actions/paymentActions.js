// actions/paymentActions.js
import axios from "axios";
import { CREATE_PAYMENT_REQUEST, CREATE_PAYMENT_SUCCESS, CREATE_PAYMENT_FAILURE } from "../Constants/paymentConstants";

export const createPayment = (sourceId, amount) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_PAYMENT_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/payments/create-payment", { sourceId, amount }, config);

    // console.log(data);

    dispatch({
      type: CREATE_PAYMENT_SUCCESS,
      payload: data,
    });

    return { success: true, data };
  } catch (error) {
    const apiErrors = error.response.data.error || "Unknown error occurred";
    console.log("Aniket is trying: ", apiErrors);

    // Dispatch errors to the reducer
    dispatch({
      type: CREATE_PAYMENT_FAILURE,
      payload: apiErrors,
    });
    return { success: false, error: apiErrors };
  }
};

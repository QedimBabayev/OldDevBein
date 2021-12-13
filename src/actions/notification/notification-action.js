import { API_BASE } from "../../config/env";
import axios from "axios";
import { getToken } from "../../config/token";
import { fetchData } from "../getData-action";

export function getNotification(filter) {
  return (dispatch) => {
    dispatch({
      type: "GET_NOTIFICATION",
      payload: axios
        .post(`${API_BASE}/notifications/get.php`, filter)
        .then((result) => result.data)
        .then((data) => data.Body),
    });
  };
}


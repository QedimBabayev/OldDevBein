import { API_BASE } from "../config/env";
import axios from "axios";
import { getToken } from "../config/token";
import { updateSessionError } from "./getData-action";
import { docFilter } from "../config/filter";

export function getGroups(controllerName) {
  return (dispatch) => {
    dispatch({
      type: "FETCH_GROUPS",
      payload: axios
        .post(`${API_BASE}/` + controllerName + `/get.php`, {
          token: JSON.parse(localStorage.getItem("user"))
            ? JSON.parse(localStorage.getItem("user")).Token
            : "",
        })
        .then((result) => result.data)
        .then((data) => {
          if (data.Headers.ResponseStatus === "0") {
            return data.Body;
          } else if (data.Headers.ResponseStatus === "104") {
            dispatch(updateSessionError(true));
          }
        }),
    });
  };
}

export function getGroupsFast(controllerName) {
  docFilter.token = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "";

  return (dispatch) => {
    dispatch({
      type: "FETCH_FAST_GROUPS",
      payload: axios
        .post(`${API_BASE}/` + controllerName + `/getfast.php`, docFilter)
        .then((result) => result.data)
        .then((data) => data.Body),
    });
  };
}

export function getOwners(controllerName) {
  docFilter.token = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "";
  return (dispatch) => {
    dispatch({
      type: "FETCH_OWNERS",
      payload: axios
        .post(`${API_BASE}/` + controllerName + `/get.php`, {
          token: JSON.parse(localStorage.getItem("user"))
            ? JSON.parse(localStorage.getItem("user")).Token
            : "",
        })
        .then((result) => result.data)
        .then((data) => data.Body),
    });
  };
}

export function getDepartments(controllerName) {
  docFilter.token = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "";

  return (dispatch) => {
    dispatch({
      type: "FETCH_DEPARTMENTS",
      payload: axios
        .post(`${API_BASE}/` + controllerName + `/get.php`, {
          token: JSON.parse(localStorage.getItem("user"))
            ? JSON.parse(localStorage.getItem("user")).Token
            : "",
        })
        .then((result) => result.data)
        .then((data) => data.Body),
    });
  };
}

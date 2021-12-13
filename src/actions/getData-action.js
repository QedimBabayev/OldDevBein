import { API_BASE } from "../config/env";
import axios from "axios";
import { getToken } from "../config/token";
import { getCustomersData } from "./getCustomerGroups-action";
import { fetchProfile } from "./getProfile-action";
import { getCustomers } from "./getCustomerGroups-action";
import getMarks from "./getMarks-action";
import store from "../index";
import { docFilter } from "../config/filter";
import { fetchAttributes } from "./getAttributes-action";

export const UPDATE_CHANGEPAGE = "UPDATE_CHANGEPAGE";

export const loadingData = (bool) => ({
  type: "FETCH_FINAL_DATA",
  payload: bool,
});

export const fetchData = (controllerName, object) => {
  return (dispatch) => {
    const response = dispatch({
      type: "FETCH_MARK",
      payload: axios
        .post(`${API_BASE}/marks/get.php`, {
          token: JSON.parse(localStorage.getItem("user"))
            ? JSON.parse(localStorage.getItem("user")).Token
            : "",
        })
        .then((result) => result.data)
        .then((data) => {
          if (data.Headers.ResponseStatus === "0") {
            return data;
          }
        }),
    });
    response.then((data) => {
      dispatch({
        type: "FETCH_DATA",
        payload: axios
          .post(`${API_BASE}/` + controllerName + `/get.php`, object)
          .then((result) => result.data)
          .then((data) => {
            if (data.Headers.ResponseStatus === "0") {
              if (docFilter.nm) {
                docFilter.nm = "";
              }
              if (controllerName === "attributes") {
                dispatch(fetchAttributes(controllerName, "product"));
              }
              return data;
            } else if (data.Headers.ResponseStatus === "104") {
              return data.Headers.ResponseStatus;
            }
          }),
      });
    });
  };
};

export function getTaxes() {
  docFilter.token = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "";
  return (dispatch) => {
    dispatch({
      type: "FETCH_TAXES",
      payload: axios
        .post(`${API_BASE}/taxes/get.php`, docFilter)
        .then((result) => result.data)
        .then((data) => data),
    });
  };
}

export function getBcTemplate() {
  return (dispatch) => {
    dispatch({
      type: "FETCH_TEMPLATES",
      payload: axios
        .get(
          `${API_BASE}/products/print.php?bc=2000000011462&pr=10.2&nm=Şablon`
        )
        .then((result) => result.data)
        .then((data) => {
          return data;
        }),
    });
  };
}

export function updateSessionError(bool) {
  return {
    type: "UPDATE_SESSION",
    payload: {
      session: bool,
    },
  };
}
export function updateCheck(newcheckdata) {
  return {
    type: "UPDATE_CHECK",
    payload: {
      checkdata: newcheckdata,
    },
  };
}

export function removeProfit() {
  return {
    type: "REMOVE_PROFIT",
    payload: {
      profit: [],
    },
  };
}

export function updateSearchInput(value) {
  return {
    type: "UPDATE_SEARCH",
    payload: {
      searchValue: value,
    },
  };
}

export function fetchCheck(controllerName, object) {
  docFilter.token = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "";
  return (dispatch) => {
    dispatch({
      type: "FETCH_CHECK",
      payload: axios
        .post(`${API_BASE}/` + controllerName + `/get.php`, object)
        .then((result) => result.data)
        .then((data) => dispatch(updateCheck(data.Body.List)))
        .then((s) => {
          dispatch(getCustomersData(s.payload.checkdata[0].CustomerId));
          dispatch(getCustomers(s.payload.checkdata[0].CustomerId));
        }),
    });
  };
}
export function fetchProfit(controllername, object) {
  docFilter.token = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "";
  return (dispatch) => {
    dispatch({
      type: "FETCH_PROFIT",
      payload: axios
        .post(
          `${API_BASE}/` + controllername + `/get.php`,
          object ? object : docFilter
        )
        .then((result) => result.data)
        .then((data) => data),
    });
  };
}

export function fetchDocuments(object) {
  docFilter.token = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "";
  return (dispatch) => {
    dispatch({
      type: "FETCH_DOCUMENT",
      payload: axios
        .post(`${API_BASE}/documents/get.php`, object)
        .then((result) => result.data)
        .then((data) => data),
    });
  };
}
export function fetchSecondaryData(controllerName) {
  docFilter.token = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "";
  return (dispatch) => {
    dispatch({
      type: "FETCH_SECONDARYDATA",
      payload: axios
        .post(`${API_BASE}/` + controllerName + `/get.php`, docFilter)
        .then((result) => result.data)
        .then((data) => data),
    });
  };
}

export function fetchDataFast(controllerName) {
  docFilter.lm = 100;

  return (dispatch) => {
    dispatch({
      type: "FETCH_DATAFAST",
      payload: axios
        .post(`${API_BASE}/` + controllerName + `/getfast.php`, docFilter)
        .then((result) => result.data)
        .then((data) => data),
    });
  };
}

export function fetchPage(controllerName, id) {
  if (id) {
    delete docFilter["id"];
    docFilter.id = id;
  }

  var getPageFilter = {};
  getPageFilter.id = docFilter.id;
  getPageFilter.token = docFilter.token;
  return (dispatch) => {
    dispatch({
      type: "FETCH_PAGE",
      payload: axios
        .post(`${API_BASE}/` + controllerName + `/get.php`, getPageFilter)
        .then((result) => result.data)
        .then((data) => data),
    });
  };
}

export function updateChangePage(bool) {
  return {
    type: UPDATE_CHANGEPAGE,
    payload: {
      changePage: bool,
    },
  };
}

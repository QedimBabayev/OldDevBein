"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTaxes = getTaxes;
exports.getBcTemplate = getBcTemplate;
exports.updateSessionError = updateSessionError;
exports.updateCheck = updateCheck;
exports.removeProfit = removeProfit;
exports.updateSearchInput = updateSearchInput;
exports.fetchCheck = fetchCheck;
exports.fetchProfit = fetchProfit;
exports.fetchDocuments = fetchDocuments;
exports.fetchSecondaryData = fetchSecondaryData;
exports.fetchDataFast = fetchDataFast;
exports.fetchPage = fetchPage;
exports.updateChangePage = updateChangePage;
exports.fetchData = exports.loadingData = exports.UPDATE_CHANGEPAGE = void 0;

var _env = require("../config/env");

var _axios = _interopRequireDefault(require("axios"));

var _token = require("../config/token");

var _getCustomerGroupsAction = require("./getCustomerGroups-action");

var _getProfileAction = require("./getProfile-action");

var _getMarksAction = _interopRequireDefault(require("./getMarks-action"));

var _index = _interopRequireDefault(require("../index"));

var _filter = require("../config/filter");

var _getAttributesAction = require("./getAttributes-action");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UPDATE_CHANGEPAGE = "UPDATE_CHANGEPAGE";
exports.UPDATE_CHANGEPAGE = UPDATE_CHANGEPAGE;

var loadingData = function loadingData(bool) {
  return {
    type: "FETCH_FINAL_DATA",
    payload: bool
  };
};

exports.loadingData = loadingData;

var fetchData = function fetchData(controllerName, object) {
  return function (dispatch) {
    var response = dispatch({
      type: "FETCH_MARK",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/marks/get.php"), {
        token: JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : ""
      }).then(function (result) {
        return result.data;
      }).then(function (data) {
        if (data.Headers.ResponseStatus === "0") {
          return data;
        }
      })
    });
    response.then(function (data) {
      dispatch({
        type: "FETCH_DATA",
        payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", object).then(function (result) {
          return result.data;
        }).then(function (data) {
          if (data.Headers.ResponseStatus === "0") {
            if (_filter.docFilter.nm) {
              _filter.docFilter.nm = "";
            }

            if (controllerName === "attributes") {
              dispatch((0, _getAttributesAction.fetchAttributes)(controllerName, "product"));
            }

            return data;
          } else if (data.Headers.ResponseStatus === "104") {
            return data.Headers.ResponseStatus;
          }
        })
      });
    });
  };
};

exports.fetchData = fetchData;

function getTaxes() {
  _filter.docFilter.token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_TAXES",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/taxes/get.php"), _filter.docFilter).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data;
      })
    });
  };
}

function getBcTemplate() {
  return function (dispatch) {
    dispatch({
      type: "FETCH_TEMPLATES",
      payload: _axios["default"].get("".concat(_env.API_BASE, "/products/print.php?bc=2000000011462&pr=10.2&nm=\u015Eablon")).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data;
      })
    });
  };
}

function updateSessionError(bool) {
  return {
    type: "UPDATE_SESSION",
    payload: {
      session: bool
    }
  };
}

function updateCheck(newcheckdata) {
  return {
    type: "UPDATE_CHECK",
    payload: {
      checkdata: newcheckdata
    }
  };
}

function removeProfit() {
  return {
    type: "REMOVE_PROFIT",
    payload: {
      profit: []
    }
  };
}

function updateSearchInput(value) {
  return {
    type: "UPDATE_SEARCH",
    payload: {
      searchValue: value
    }
  };
}

function fetchCheck(controllerName, object) {
  _filter.docFilter.token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_CHECK",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", object).then(function (result) {
        return result.data;
      }).then(function (data) {
        return dispatch(updateCheck(data.Body.List));
      }).then(function (s) {
        dispatch((0, _getCustomerGroupsAction.getCustomersData)(s.payload.checkdata[0].CustomerId));
        dispatch((0, _getCustomerGroupsAction.getCustomers)(s.payload.checkdata[0].CustomerId));
      })
    });
  };
}

function fetchProfit(controllername, object) {
  _filter.docFilter.token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_PROFIT",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllername + "/get.php", object ? object : _filter.docFilter).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data;
      })
    });
  };
}

function fetchDocuments(object) {
  _filter.docFilter.token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_DOCUMENT",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/documents/get.php"), object).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data;
      })
    });
  };
}

function fetchSecondaryData(controllerName) {
  _filter.docFilter.token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_SECONDARYDATA",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", _filter.docFilter).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data;
      })
    });
  };
}

function fetchDataFast(controllerName) {
  _filter.docFilter.lm = 100;
  return function (dispatch) {
    dispatch({
      type: "FETCH_DATAFAST",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/getfast.php", _filter.docFilter).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data;
      })
    });
  };
}

function fetchPage(controllerName, id) {
  if (id) {
    delete _filter.docFilter["id"];
    _filter.docFilter.id = id;
  }

  var getPageFilter = {};
  getPageFilter.id = _filter.docFilter.id;
  getPageFilter.token = _filter.docFilter.token;
  return function (dispatch) {
    dispatch({
      type: "FETCH_PAGE",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", getPageFilter).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data;
      })
    });
  };
}

function updateChangePage(bool) {
  return {
    type: UPDATE_CHANGEPAGE,
    payload: {
      changePage: bool
    }
  };
}
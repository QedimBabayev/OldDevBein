"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroups = getGroups;
exports.getGroupsFast = getGroupsFast;
exports.getOwners = getOwners;
exports.getDepartments = getDepartments;

var _env = require("../config/env");

var _axios = _interopRequireDefault(require("axios"));

var _token = require("../config/token");

var _getDataAction = require("./getData-action");

var _filter = require("../config/filter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getGroups(controllerName) {
  return function (dispatch) {
    dispatch({
      type: "FETCH_GROUPS",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", {
        token: JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : ""
      }).then(function (result) {
        return result.data;
      }).then(function (data) {
        if (data.Headers.ResponseStatus === "0") {
          return data.Body;
        } else if (data.Headers.ResponseStatus === "104") {
          dispatch((0, _getDataAction.updateSessionError)(true));
        }
      })
    });
  };
}

function getGroupsFast(controllerName) {
  _filter.docFilter.token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_FAST_GROUPS",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/getfast.php", _filter.docFilter).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data.Body;
      })
    });
  };
}

function getOwners(controllerName) {
  _filter.docFilter.token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_OWNERS",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", {
        token: JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : ""
      }).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data.Body;
      })
    });
  };
}

function getDepartments(controllerName) {
  _filter.docFilter.token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_DEPARTMENTS",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", {
        token: JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : ""
      }).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data.Body;
      })
    });
  };
}
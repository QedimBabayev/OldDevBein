"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRefList = fetchRefList;
exports.fetchAttributes = fetchAttributes;

var _env = require("../config/env");

var _axios = _interopRequireDefault(require("axios"));

var _filterAttributes = _interopRequireDefault(require("../config/filterAttributes"));

var _filterRefList = _interopRequireDefault(require("../config/filterRefList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function fetchRefList(refid) {
  _filterRefList["default"].refid = refid;
  _filterRefList["default"].token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_REFLIST",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/attributes/getreflist.php"), _filterRefList["default"]).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data;
      })
    });
  };
}

function fetchAttributes(controllerName, entityType) {
  _filterAttributes["default"].entitytype = entityType;
  _filterAttributes["default"].token = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : "";
  return function (dispatch) {
    dispatch({
      type: "FETCH_ATTRIBUTES",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", _filterAttributes["default"]).then(function (result) {
        return result.data;
      }).then(function (data) {
        localStorage.setItem("attributes", JSON.stringify(data.Body.List));
        return data;
      })
    });
  };
}
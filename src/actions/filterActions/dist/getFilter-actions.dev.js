"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterDatas = getFilterDatas;
exports.getFilterFastDatas = getFilterFastDatas;

var _env = require("../../config/env");

var _axios = _interopRequireDefault(require("axios"));

var _token = require("../../config/token");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getFilterDatas(controllerName) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_FILTER_DATAS',
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/get.php", {
        token: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Token : ''
      }).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data.Body;
      })
    });
  };
}

function getFilterFastDatas(val, controllerName) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_FILTER_FAST_DATAS',
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/getfast.php", {
        token: JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Token : '',
        fast: val
      }).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data.Body;
      })
    });
  };
}
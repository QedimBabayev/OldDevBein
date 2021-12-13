"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotification = getNotification;

var _env = require("../../config/env");

var _axios = _interopRequireDefault(require("axios"));

var _token = require("../../config/token");

var _getDataAction = require("../getData-action");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getNotification(filter) {
  return function (dispatch) {
    dispatch({
      type: "GET_NOTIFICATION",
      payload: _axios["default"].post("".concat(_env.API_BASE, "/notifications/get.php"), filter).then(function (result) {
        return result.data;
      }).then(function (data) {
        return data.Body;
      })
    });
  };
}
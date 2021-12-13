"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = putData;

var _env = require("../../config/env");

var _token = require("../../config/token");

var _getGroupsAction = require("../getGroups-action");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function putData(controllerName, dataObject, isModal) {
  return function (dispatch) {
    dataObject.token = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Token : '';
    console.log(dataObject);
    dispatch({
      type: 'PUT_DATA',
      payload: _axios["default"].post("".concat(_env.API_BASE, "/") + controllerName + "/put.php", dataObject).then(function (result) {
        return result.data;
      }).then(function (data) {
        if (isModal) {
          localStorage.setItem('newCusName', dataObject.name);
        }

        return data;
      })
    });
  };
}
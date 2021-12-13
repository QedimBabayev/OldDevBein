"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newNots = newNots;

var _env = require("../../config/env");

var _axios = _interopRequireDefault(require("axios"));

var _token = require("../../config/token");

var _getDataAction = require("../getData-action");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function newNots(nots) {
  return {
    type: "NEW_NOTS",
    payload: {
      nots: nots
    }
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.docDefaultFilter = exports.docFilter = void 0;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var docFilter = {
  pg: 0,
  dr: 1,
  token: JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : ""
};
exports.docFilter = docFilter;
var docDefaultFilter = {
  pg: 0,
  dr: 1,
  token: JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).Token : ""
};
exports.docDefaultFilter = docDefaultFilter;
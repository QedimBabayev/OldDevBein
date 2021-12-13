"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Null_Content = exports.VERSION_LAST = exports.VERSION_NEW = exports.API_LOGIN = exports.API_MODS = exports.API_BASE = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var API_BASE = "";
exports.API_BASE = API_BASE;
var API_MODS = "";
exports.API_MODS = API_MODS;
var API_LOGIN = "";
exports.API_LOGIN = API_LOGIN;
var VERSION_NEW = "";
exports.VERSION_NEW = VERSION_NEW;
var VERSION_LAST = "";
exports.VERSION_LAST = VERSION_LAST;
var Null_Content = "Axtarışa uyğun nəticə tapılmadı...";
exports.Null_Content = Null_Content;

_axios["default"].get("/localEnv.json").then(function (res) {
  exports.API_BASE = API_BASE = res.data.API_BASE;
  exports.API_MODS = API_MODS = res.data.API_MODS;
  exports.API_LOGIN = API_LOGIN = res.data.API_LOGIN;
});

_axios["default"].get("/version.json").then(function (res) {
  exports.VERSION_NEW = VERSION_NEW = res.data.version_new;
  exports.VERSION_LAST = VERSION_LAST = res.data.version_last;
});
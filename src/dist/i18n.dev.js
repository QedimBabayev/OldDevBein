"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _i18next = _interopRequireDefault(require("i18next"));

var _i18nextHttpBackend = _interopRequireDefault(require("i18next-http-backend"));

var _i18nextBrowserLanguagedetector = _interopRequireDefault(require("i18next-browser-languagedetector"));

var _reactI18next = require("react-i18next");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_i18next["default"].use(_i18nextHttpBackend["default"]).use(_i18nextBrowserLanguagedetector["default"]).use(_reactI18next.initReactI18next).init({
  fallbackLng: 'aze',
  debug: true,
  detection: {
    order: ["queryString", "cookie"],
    cache: ["cookie"]
  },
  interpolation: {
    escapeValue: false
  }
});

var _default = _i18next["default"];
exports["default"] = _default;
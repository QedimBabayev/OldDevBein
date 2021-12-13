"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _ProductFolderFunction = _interopRequireDefault(require("../pages/ProductFolderFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function TestMemo(_ref) {
  var attributes = _ref.attributes;
  console.log("test memo component re-rendered");
  return {};
}

var _default = _react["default"].memo(TestMemo);

exports["default"] = _default;
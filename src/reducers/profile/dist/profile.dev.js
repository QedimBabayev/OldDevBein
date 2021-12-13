"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fetching = require("../../config/fetching");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  fetching: true,
  afterStart: false,
  profile: []
};

function profile() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case "AFTER_FIRST":
      return _objectSpread({}, state, {
        afterStart: action.payload.loggedPage
      });

    case _fetching.FETCH_PROFILE_PENDING:
      return _objectSpread({}, state, {
        fetching: true
      });

    case _fetching.FETCH_PROFILE_FULFILLED:
      return _objectSpread({}, state, {
        profile: action.payload.Body,
        fetching: false
      });

    case _fetching.FETCH_PROFILE_REJECTED:
      return _objectSpread({}, state, {
        fetching: false,
        error: action.payload
      });

    default:
      return state;
  }
}

var _default = profile;
exports["default"] = _default;
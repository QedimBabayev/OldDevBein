"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fetching = require("../config/fetching");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  selectedProduct: [],
  add: false,
  error: [],
  checkClickInput: false,
  reload: false,
  updated: false
};

function handleProduct() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  console.log(action);

  switch (action.type) {
    case "UPDATE_PRODUCT_PAGE":
      return _objectSpread({}, state, {
        reload: action.payload.reload
      });

    case "UPDATE_PRODUCT_ID":
      return _objectSpread({}, state, {
        updated: action.payload.updated
      });

    case _fetching.UPDATE_PRODUCT:
      return _objectSpread({}, state, {
        selectedProduct: action.payload.product[0],
        checkBarcode: action.payload.checkBarcode,
        changedPositions: action.payload.changedPositions
      });

    case _fetching.UPDATE_CUSTOMER:
      return _objectSpread({}, state, {
        selectedCustomer: action.payload.customer[0]
      });

    case "UPDATE_POSITIONS":
      return _objectSpread({}, state, {
        checkClickInput: action.payload.checkClickInput,
        selectedProduct: action.payload.positions,
        add: true
      });

    case _fetching.DELETE_PRODUCT:
      return _objectSpread({}, state, {
        selectedProduct: action.payload.product,
        checkBarcode: false
      });

    case _fetching.DELETE_CUSTOMER:
      return _objectSpread({}, state, {
        selectedProduct: action.payload.customer
      });

    default:
      return state;
  }
}

var _default = handleProduct;
exports["default"] = _default;
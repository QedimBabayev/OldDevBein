"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSubheader = updateSubheader;
exports.changeSubMenu = changeSubMenu;
exports.updateUpperheader = updateUpperheader;
exports.updateTokenSessionExpired = updateTokenSessionExpired;
exports["default"] = getNavbar;
exports.UPDATE_UPPERHEADER = exports.UPDATE_SUBHEADER = void 0;

var _env = require("../config/env");

var _axios = _interopRequireDefault(require("axios"));

var _token = require("../config/token");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var UPDATE_SUBHEADER = 'UPDATE_SUBHEADER';
exports.UPDATE_SUBHEADER = UPDATE_SUBHEADER;
var UPDATE_UPPERHEADER = 'UPDATE_UPPERHEADER';
exports.UPDATE_UPPERHEADER = UPDATE_UPPERHEADER;

function updateSubheader(activeItemId, activeItem) {
  return {
    type: UPDATE_SUBHEADER,
    payload: {
      id: activeItemId,
      name: activeItem
    }
  };
}

function changeSubMenu(name) {
  return {
    type: 'CHANGE_SUBMENU',
    payload: {
      submenu: name
    }
  };
}

function updateUpperheader(activeItem, activefrom) {
  return {
    type: UPDATE_UPPERHEADER,
    payload: {
      nameupper: activeItem,
      from: activefrom ? activefrom : undefined
    }
  };
}

function updateTokenSessionExpired(bool) {
  return {
    type: 'UPDATE_TOKEN_EXPIRED',
    payload: {
      expiredToken: bool
    }
  };
}

function getNavbar(object) {
  return function (dispatch) {
    dispatch({
      type: 'FETCH_MENU',
      payload: _axios["default"].post("".concat(_env.API_BASE, "/menu/get.php"), object).then(function (result) {
        return result.data;
      }).then(function (data) {
        if (data.Headers.ResponseStatus === '104') {
          dispatch(updateTokenSessionExpired(true));
          localStorage.removeItem('user');
        }

        return data.Body;
      })
    });
  };
}
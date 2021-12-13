"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.socket = void 0;

var _socket = _interopRequireDefault(require("socket.io-client"));

var _env = require("./config/env");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var socket;
exports.socket = socket;

var init = function init() {
  exports.socket = socket = (0, _socket["default"])("https://195.161.41.149:3000", {
    transprots: ["websocket"]
  });
  socket.emit("register", "admin@test");
}; // async function getNotification() {
//   const res = await axios.post(`${API_BASE}/notifications/get.php`, {
//     token: JSON.parse(localStorage.getItem("user"))
//       ? JSON.parse(localStorage.getItem("user")).Token
//       : "",
//   });
//   console.log(res);
//   return await res;
// }
// export const get = () => {
//   socket.on("notification", (data) => {
//     if (data) {
//       alert(data);
//       // getNotification();
//     }
//   });
// };


exports.init = init;
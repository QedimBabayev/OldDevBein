import io from "socket.io-client";
import { API_BASE } from "./config/env";
import axios from "axios";
export let socket;

export const init = () => {
  socket = io("https://195.161.41.149:3000", {
    transprots: ["websocket"],
  });
  socket.emit("register", "admin@test");

};

// async function getNotification() {
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

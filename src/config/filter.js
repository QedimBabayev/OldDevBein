import moment from "moment";

export const docFilter = {
  pg: 0,
  dr: 1,
  token: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "",
};






export const docDefaultFilter = {
  pg: 0,
  dr: 1,
  token: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user")).Token
    : "",

};

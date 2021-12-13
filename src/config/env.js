import axios from "axios";
export var API_BASE = "";
export var API_MODS = "";
export var API_LOGIN = "";
export var VERSION_NEW = "";
export var VERSION_LAST= "";
export const Null_Content = "Axtarışa uyğun nəticə tapılmadı...";

axios.get("/localEnv.json").then((res) => {
  API_BASE = res.data.API_BASE;
  API_MODS = res.data.API_MODS;
  API_LOGIN = res.data.API_LOGIN;
});


  axios.get("/version.json").then((res) => {
      VERSION_NEW = res.data.version_new;
      VERSION_LAST = res.data.version_last;
  });
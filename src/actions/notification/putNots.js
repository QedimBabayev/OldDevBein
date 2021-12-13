import { API_BASE } from "../../config/env";
import axios from "axios";
import { getToken } from "../../config/token";
import { fetchData } from "../getData-action";

export function newNots(nots) {
  return {
    type: "NEW_NOTS",
    payload: {
      nots: nots,
    },
  };
}
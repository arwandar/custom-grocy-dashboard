import axios from "axios";

export const baseURL = "http://192.168.86.53:80/api";

const instance = axios.create({
  baseURL,
  headers: {
    "GROCY-API-KEY": "xb8hLO1rCIAa2yKLEFj2w4aEr99fjzE85TZ5UzbE8gsjtLf4pm",
  },
});

export default instance;

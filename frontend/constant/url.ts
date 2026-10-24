import axios from "axios";

export const url = "http://localhost:5000";
export const api = axios.create({
  baseURL: `${url}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

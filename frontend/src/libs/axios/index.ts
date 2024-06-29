import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

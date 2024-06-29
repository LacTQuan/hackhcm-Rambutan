import axios from "axios";

const API_URL = process.env.API_URL || "https://hackhcm-rambutan-backend.onrender.com";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

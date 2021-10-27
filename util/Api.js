import axios from "axios";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST, //YOUR_API_URL HERE
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  httpClient.defaults.headers.common["Authorization"] = token;
};

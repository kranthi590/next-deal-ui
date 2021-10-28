import axios from "axios";
import cookie from "cookie";
const _ = require("lodash");

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST, //YOUR_API_URL HERE
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  httpClient.defaults.headers.common["Authorization"] = token;
};

export const setApiContext = (req, res, query) => {
  const browsersHeaders = req.headers;
  const cookies = cookie.parse(browsersHeaders.cookie || "");
  const headers = {
    "Content-Type": "application/json",
    origin: browsersHeaders.host,
  };
  if (browsersHeaders.referer) {
    headers.referer = browsersHeaders.referer;
  }
  if (cookies.token || query.token) {
    console.log('setting auth');
    headers.authorization = cookies.token || query.token;
  }
   if (query.token) {
    res.setHeader("set-cookie", [`token=${query.token}`]);
   }
  console.log(`query to server: ${JSON.stringify(headers)}`);
  return headers;
};

export const handleApiErrors = (req, res, query, error) => {
  const errorCode = _.get(error, "response.data.errors[0].errorCode", null);
  if (errorCode === "INVALID_DOMAIN" || errorCode === "INVALID_JWT_TOKEN") {
    res.writeHead(302, {
      Location: `/signin?redirect=http://${req.headers.host}${req.url}`,
    });
    res.end();
  } else {
    throw error;
  }
};

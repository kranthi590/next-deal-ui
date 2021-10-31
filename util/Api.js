import axios from "axios";
import cookie from "cookie";
import {Cookies} from "react-cookie";
import {useRouter} from "next/router";
const _ = require("lodash");

export const httpClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}api/v1/`, //YOUR_API_URL HERE
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = () => {
  const router = useRouter();
  const cookie = new Cookies();
  if (cookie && cookie.token){
    httpClient.defaults.headers.common["Authorization"] = cookie.token;
  } else {
    router.push('/signin')
  }

};

export const setApiContext = (req, res, query) => {
  const browsersHeaders = req.headers;
  console.log(JSON.stringify(browsersHeaders));
  const cookies = cookie.parse(browsersHeaders.cookie || "");
  const headers = {
    "Content-Type": "application/json",
    'nd-domain': browsersHeaders.host,
  };
  if (browsersHeaders.referer) {
    headers.referer = browsersHeaders.referer;
  }
  if (cookies.token) {
    headers.authorization = cookies.token;
  }
  return headers;
};

export const handleApiErrors = (req, res, query, error) => {
  const errorCode = _.get(error, "response.data.errors[0].errorCode", null);
  if (errorCode === "INVALID_DOMAIN" || errorCode === "INVALID_JWT_TOKEN") {
    res.writeHead(302, {
      Location: `/signin`,
    });
    res.end();
  } else {
    throw error;
  }
};

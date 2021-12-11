import axios from "axios";
import cookie from "cookie";
import {Cookies} from "react-cookie";
import {isClient} from "./util";
const _ = require("lodash");
import { v4 as uuidv4 } from 'uuid';

export const httpClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}api/v1/`, //YOUR_API_URL HERE
});

export const setAuthToken = () => {
  const cookie = new Cookies();
  const headers = {
      "Content-Type": "application/json",
      "nd-domain":  isClient ? window.location.hostname : "",
      "x-trace-id": uuidv4()
  }
  if (cookie.get('token')){
    headers.authorization = cookie.get('token');
  }
  return headers;
};

export const setApiContext = (req, res, query) => {
  const browsersHeaders = req.headers;
  const cookies = cookie.parse(browsersHeaders.cookie || "");
  const headers = {
    "Content-Type": "application/json",
    'nd-domain': browsersHeaders.host,
    "x-trace-id": uuidv4()
  };
  if (browsersHeaders.referer) {
    headers.referer = browsersHeaders.referer;
  }
  if (cookies.token) {
    headers.authorization = cookies.token;
  }
  if (cookies.userId){
    headers[`user-id`] = cookies.userId;
  }
  return headers;
};

export const handleApiErrors = (req, res, query, error) => {
  const errorCode = _.get(error, "response.data.errors[0].errorCode", null);
  if (errorCode === "INVALID_DOMAIN" || errorCode === "INVALID_JWT_TOKEN") {
    res.writeHead(302, {
      Location: `/app/signin`,
    });
    res.end();
  } else {
    throw error;
  }
};


export const uploadFiles = (files, context, isSecure = false) => {
  return Promise.all(files.map((file) => {
    let formData = new FormData();
    formData.append("file", file.originFileObj);
    Object.keys(context).forEach((key) => {
      formData.append(key, context[key]);
    });
    return httpClient
      .post(
        `${process.env.NEXT_PUBLIC_API_HOST}api/v1/${isSecure
          ? `secureFiles?token=${new Cookies().get('token')}`
          : 'files'}`,
        formData
      )
  }));
}
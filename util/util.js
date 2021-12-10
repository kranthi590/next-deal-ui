import React from "react";
import { NotificationManager } from "react-notifications";
import { isEmpty } from "lodash";
import IntlMessages from "./IntlMessages";
import moment from "moment";
import {getData} from "./localStorage";

export const NOTIFICATION_TIMEOUT = 2000;

export const successNotification = (messageId) => {
  NotificationManager.success(
    <IntlMessages id={messageId} />,
    "",
    NOTIFICATION_TIMEOUT
  );
};

export const errorNotification = (message = "", titleId) => {
  NotificationManager.error(
    message,
    titleId ? <IntlMessages id={titleId} /> : "",
    NOTIFICATION_TIMEOUT
  );
};

export const extractData = (key, data) => {
  const obj = {};
  data &&
    Object.keys(data).forEach((fk) => {
      if (fk.includes(key) && !!data[fk]) {
        obj[fk.split(key)[1]] = data[fk];
      }
    });
  return obj;
};

export const isValidObject = (obj) => {
  return !isEmpty(Object.values(obj).filter((val) => !isEmpty(val)));
};

export const getPhonePrefix = (prefix) => {
  return prefix || process.env.NEXT_PUBLIC_DEFAULT_LOCALE_PREFIX;
};

export const isClient = typeof window !== "undefined";

export const getDateInMilliseconds = (date) => {
  return date && moment(date).format("MM/DD/YYYY");
};

export const getBuyerId = () => {
  if (isClient) {
    const buyerInfo = getData("user");
    return buyerInfo && JSON.parse(buyerInfo.buyerId);
  }
  return;
};

export const getSubDomain = (url = "") => {
  const domain = isClient
    ? window.location.hostname.replace("www.", "").split(".")
    : "";
  return domain[0];
};

export const sanitizeString = (string) => {
  if (!string){
    return;
  }
  return string.replace(/[^a-zA-Z0-9]/g, "");
};

export const formatAmount = (amount) =>
  amount && amount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const getAvatar = str => {
  if (!str) return;
  const stringInfo = str.match(/\b(\w)/g);
  const splitString = stringInfo.splice(0,2)
  return splitString.join('').toUpperCase();
}

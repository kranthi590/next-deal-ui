import { NotificationManager } from "react-notifications";
import { isEmpty } from "lodash";
import IntlMessages from "./IntlMessages";

export const NOTIFICATION_TIMEOUT = 4000;

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
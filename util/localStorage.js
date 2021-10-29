import { isClient } from "./util";

export const setData = (data, key) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getData = (key) => {
  if (isClient) {
    return JSON.parse(localStorage.getItem(key));
  }
  return;
};

export const removeData = (key) => {
  if (isClient) {
    localStorage.removeItem(key);
  }
};

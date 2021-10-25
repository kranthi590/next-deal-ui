export const setData = (data, key) => {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
}

export const getData = key => {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  const item = localStorage.getItem(key);

  if (!item) {
    return;
  }

  return JSON.parse(item);
}

export const removeData = key => {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  localStorage.removeItem(key);
}

import React, { useEffect } from "react";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
} from "../../../constants/ThemeSetting";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar";
import { getData, setData } from "../../../util/localStorage";
import { httpClient, setAuthToken } from "../../../util/Api";
import { Cookies } from "react-cookie";
import { useAuth } from "../../../contexts/use-auth";

const SIDEBAR_VISIBLE_ON = [
  NAV_STYLE_FIXED,
  NAV_STYLE_DRAWER,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
];

const getUseProfile = async (setAuthUser) => {
  try {
    const headers = setAuthToken();
    const cookies = new Cookies();
    const data = await httpClient.get(`users/${cookies.get("userId")}`, {
      headers,
    });
    setData(data.data.data, "user");
    setAuthUser(data.data.data);
  } catch (error) {
    console.error(error);
  }
};

const AppSidebar = ({ navStyle, ...props }) => {
  const { setAuthUser } = useAuth();
  const width = useSelector(({ settings }) => settings.width);

  // Set user profile if data not exists in localStorage
  useEffect(() => {
    if (!getData("user")) {
      getUseProfile(setAuthUser);
    } else {
      setAuthUser(getData("user"));
    }
  }, []);

  if (width < TAB_SIZE || SIDEBAR_VISIBLE_ON.includes(navStyle)) {
    return <Sidebar />;
  }

  return null;
};

export default React.memo(AppSidebar);

import React, { useState } from "react";
import { Layout, Popover } from "antd";
import Link from "next/link";

import CustomScrollbars from "../../../util/CustomScrollbars";
import languageData from "./languageData";
import { switchLanguage, toggleCollapsedSideNav } from "../../../redux/actions";
import SearchBox from "../../components/SearchBox";
import UserInfo from "../../components/UserInfo";
import AppNotification from "../../components/AppNotification";
import MailNotification from "../../components/MailNotification";

import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  TAB_SIZE,
} from "../../../constants/ThemeSetting";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "../Sidebar/UserProfile";

const { Header } = Layout;

const Topbar = () => {
  const width = useSelector(({ settings }) => settings.width);
  const navCollapsed = useSelector(({ settings }) => settings.navCollapsed);
  const navStyle = useSelector(({ settings }) => settings.navStyle);

  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const languageMenu = () => (
    <CustomScrollbars className="gx-popover-lang-scroll">
      <ul className="gx-sub-popover">
        {languageData.map((language) => (
          <li
            className="gx-media gx-pointer"
            key={JSON.stringify(language)}
            onClick={() => dispatch(switchLanguage(language))}
          >
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
            <span className="gx-language-text">{language.name}</span>
          </li>
        ))}
      </ul>
    </CustomScrollbars>
  );

  const updateSearchChatUser = (evt) => {
    setSearchText(evt.target.value);
  };

  return (
    <Header>
      {navStyle === NAV_STYLE_DRAWER ||
      ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) &&
        width < TAB_SIZE) ? (
        <div className="gx-linebar gx-mr-3">
          <i
            className="gx-icon-btn icon icon-menu"
            onClick={() => {
              dispatch(toggleCollapsedSideNav(!navCollapsed));
            }}
          />
        </div>
      ) : null}
      <Link href="/">
        <img
          alt=""
          className="gx-d-block gx-d-lg-none gx-pointer"
          src={"/images/w-logo.png"}
        />
      </Link>

      {/* <SearchBox
        styleName="gx-d-none gx-d-lg-block gx-lt-icon-search-bar-lg"
        placeholder="Search in app..."
        onChange={updateSearchChatUser}
        value={searchText}
      /> */}
      <ul className="gx-header-notifications gx-ml-auto">
    {/*    <li className="gx-notify">
          <Popover
            overlayClassName="gx-popover-horizantal"
            placement="bottomRight"
            content={<AppNotification />}
            trigger="click"
          >
            <span className="gx-pointer gx-d-block">
              <i className="icon icon-notification" />
            </span>
          </Popover>
        </li>*/}
        <li className="gx-language">
          <UserProfile />
        </li>
        {/* {width >= TAB_SIZE ? null : (
          <>
            <li className="gx-user-nav">
              <UserInfo />
            </li>
          </>
        )} */}
      </ul>
    </Header>
  );
};

export default Topbar;

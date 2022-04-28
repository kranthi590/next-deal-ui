import React from 'react';
import { Layout } from 'antd';
import Link from 'next/link';

import { toggleCollapsedSideNav } from '../../../redux/actions';

import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  TAB_SIZE,
} from '../../../constants/ThemeSetting';
import { useDispatch, useSelector } from 'react-redux';
import UserProfile from '../Sidebar/UserProfile';
import { useAuth } from '../../../contexts/use-auth';
import IntlMessages from '../../../util/IntlMessages';

const { Header } = Layout;

const Topbar = () => {
  const { authUser } = useAuth();
  const width = useSelector(({ settings }) => settings.width);
  const navCollapsed = useSelector(({ settings }) => settings.navCollapsed);
  const navStyle = useSelector(({ settings }) => settings.navStyle);
  const dispatch = useDispatch();

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
      {authUser ? (
        <div>
          <span style={{ fontWeight: 500 }}>
            <IntlMessages id="app.common.text.welcome" />
          </span>
          , {authUser.firstName} {authUser.lastName}
        </div>
      ) : (
        <></>
      )}
      <ul className="gx-header-notifications gx-ml-auto">
        <li className="gx-language">
          <UserProfile />
        </li>
      </ul>
    </Header>
  );
};

export default Topbar;

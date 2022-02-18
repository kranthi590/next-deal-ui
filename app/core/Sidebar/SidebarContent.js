import React, { useEffect } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';

import { useRouter } from 'next/router';
import CustomScrollbars from '../../../util/CustomScrollbars';
import SidebarLogo from './SidebarLogo';
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from '../../../constants/ThemeSetting';
import { useDispatch, useSelector } from 'react-redux';
import { setPathName } from '../../../redux/actions';
import IntlMessages from '../../../util/IntlMessages';

const SubMenu = Menu.SubMenu;

const SidebarContent = () => {
  const themeType = useSelector(({ settings }) => settings.themeType);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(setPathName(router.pathname));
  }, [router.pathname]);

  const selectedKeys = router.pathname.substr(1) || '';
  const defaultOpenKeys = selectedKeys.split('/')[1] || 'dashboardgroup';

  return (
    <React.Fragment>
      <SidebarLogo />
      <div className="gx-sidebar-content" style={{ marginTop: 20 }}>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
            mode="inline"
          >
            <SubMenu
              key="dashboardgroup"
              title={
                <span>
                  <i className="icon icon-dasbhoard" />
                  <span>
                    <IntlMessages id="sidebar.menu.dashboard" />
                  </span>
                </span>
              }
            >
              <Menu.Item key="">
                <Link href="/">
                  <a>
                    <i className="icon icon-revenue-new" />
                    <span>
                      <IntlMessages id="sidebar.menu.budget" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item key="quotations-per-project">
                <Link href="/quotations-per-project">
                  <a>
                    <i className="icon icon-pricing-table" />
                    <span>
                      <IntlMessages id="sidebar.menu.quotations" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item key="suppliers-and-quotations">
                <Link href="/suppliers-and-quotations">
                  <a>
                    <i className="icon icon-auth-screen" />
                    <span>
                      <IntlMessages id="sidebar.menu.suppliers" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="projects">
              <Link href="/projects">
                <a>
                  <i className="icon icon-lising-dbrd" />
                  <span>
                    <IntlMessages id="sidebar.project.Projects" />
                  </span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="my-suppliers">
              <Link href="/my-suppliers">
                <a>
                  <i className="icon icon-product-list" />
                  <span>
                    <IntlMessages id="sidebar.suppliers.mySuppliers" />
                  </span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="nextdeal-suppliers">
              <Link href="/nextdeal-suppliers">
                <a>
                  <i className="icon icon-product-list" />
                  <span>
                    <IntlMessages id="sidebar.suppliers.suppliersNextDeal" />
                  </span>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="calendar">
              <Link href="/calendar">
                <a>
                  <i className="icon icon-calendar" />
                  <span>
                    <IntlMessages id="sidebar.menu.calendar" />
                  </span>
                </a>
              </Link>
            </Menu.Item>
          </Menu>
        </CustomScrollbars>
      </div>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {};
export default SidebarContent;

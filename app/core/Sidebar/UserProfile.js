import React from "react";
import {Avatar, Popover} from "antd";
import {useAuth} from "../../../util/use-auth";

const UserProfile = () => {
  const {authUser, userSignOut} = useAuth();

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li onClick={() => userSignOut()}>Logout
      </li>
    </ul>
  );
const generateAvatar = `https://ui-avatars.com/api/?name=${authUser.firstName || 'Next Deal'}&format=svg`
  return authUser ? (
    <div className="gx-flex-row gx-align-items-center gx-avatar-row">
      <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
        <Avatar src={generateAvatar} className="gx-size-40 gx-pointer gx-mr-3" alt=""/>
        <span className="gx-avatar-name">{authUser.firstName}<i className="icon icon-chevron-down gx-fs-xxs gx-ml-2"/></span>
      </Popover>
    </div>
  ) : null
};

export default UserProfile;

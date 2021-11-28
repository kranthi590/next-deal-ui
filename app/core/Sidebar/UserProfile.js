import React from "react";
import { Avatar, Popover } from "antd";
import { useAuth } from "../../../contexts/use-auth";
import {getAvatar} from "../../../util/util";

const UserProfile = () => {
  const { userSignOut, authUser } = useAuth();

  if (!authUser) {
    return <div />;
  }

  const userMenuOptions = (
    <ul className="gx-user-popover">
      <li onClick={() => userSignOut()}>Logout</li>
    </ul>
  );
  return authUser ? (
    <div className="gx-flex-row gx-align-items-center gx-avatar-row">
      <Popover
        placement="bottomRight"
        content={userMenuOptions}
        trigger="click"
      >
        <Avatar
          style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          className="gx-size-40 gx-pointer gx-mr-1"
          alt=""
        >{getAvatar(authUser.firstName)}</Avatar>
        <span className="gx-avatar-name">
          <i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" />
        </span>
      </Popover>
    </div>
  ) : null;
};

export default UserProfile;

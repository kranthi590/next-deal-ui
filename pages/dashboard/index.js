import React from "react";
import { getData } from "../../util/localStorage";
import { isClient } from "../../util/util";

const DashboardPage = (props) => {
  if (!isClient) {
    return <div/>
  }
  const userProfile = getData('user');
  return (
    <div>HI, This is a Dashboard for</div>
  );
};

export default DashboardPage;

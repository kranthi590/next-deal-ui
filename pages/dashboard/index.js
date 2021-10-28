import React from "react";

const DashboardPage = (props) => {
  let name;
  if (props.userProfile) {
    name = props.userProfile.data.firstName;
  }
  return (
    <div>HI, This is a Dashboard for {name}</div>
  );
};

export default DashboardPage;

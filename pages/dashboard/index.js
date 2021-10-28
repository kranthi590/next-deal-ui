import React from "react";

const DashboardPage = (props) => {
  console.log(props);
  return (
    <div>HI, This is a Dashboard for {props.userProfile.data.firstName}</div>
  );
};

export default DashboardPage;

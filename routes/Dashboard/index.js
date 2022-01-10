import React from 'react';

const Dashboard = ({ userProfile }) => {
  return (
    <div>
      HI, This is a Dashboard for {userProfile.firstName} {userProfile.lastName}
    </div>
  );
};

export default Dashboard;

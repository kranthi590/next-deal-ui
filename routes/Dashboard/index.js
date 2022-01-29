import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Divider } from 'antd';
import { ProjectProvider } from '../../contexts/projects';
import { Cookies } from 'react-cookie';
import NoDataAvailable from '../../app/components/NoDataAvailable.js';
import ProjectSelector from '../../app/components/ProjectSelector';
import IntlMessages from '../../util/IntlMessages';
import ChartSkeleton from '../../app/components/ChartSkeleton/index.js';

const BuyerDashboard = ({ userProfile }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const cookie = new Cookies();

  const projectChangeCallback = projectId => {
    setSelectedProject(projectId);
  };
  const changeLoadingStatus = status => {
    setLoading(status);
  };

  useEffect(() => {
    setBuyerId(cookie.get('buyerId'));
  });

  return (
    <React.Fragment>
      <div>
        <IntlMessages id="app.common.text.welcome" />, {userProfile.firstName}{' '}
        {userProfile.lastName}
      </div>
      <div className="gx-my-2">
        <ProjectSelector
          projectChangeCallback={projectChangeCallback}
          updateLoader={changeLoadingStatus}
        />
      </div>
      <Card className="ant-card gx-card-widget">
        <div className="ant-card-head gx-pt-0">
          <div className="ant-card-head-wrapper">
            <div className="ant-card-head-title gx-text-left">
              <h4 className="gx-card-bordered-title">
                <i className="icon icon-revenue-new gx-mr-3"></i>
                <IntlMessages id="app.common.text.budget" />
              </h4>
            </div>
          </div>
        </div>
        {loading ? (
          <ChartSkeleton />
        ) : buyerId && selectedProject ? (
          <div>
            <iframe
              src={`${process.env.NEXT_PUBLIC_GRAFANA_HOST}/d-solo/IWqJ14onk/budget?orgId=1&from=1641697206709&to=1642906806711&var-Buyer=${buyerId}&var-Project=${selectedProject}&panelId=10`}
              width="100%"
              height="300"
              frameBorder="0"
            />
            <Divider />
            <div>
              <iframe
                src={`${process.env.NEXT_PUBLIC_GRAFANA_HOST}/d-solo/IWqJ14onk/budget?orgId=1&from=1641697206709&to=1642906806711&var-Buyer=${buyerId}&var-Project=${selectedProject}&panelId=8`}
                width="100%"
                height="300"
                frameBorder="0"
              />
            </div>
          </div>
        ) : (
          <NoDataAvailable />
        )}
      </Card>
    </React.Fragment>
  );
};

const Dashboard = props => (
  <ProjectProvider>
    <BuyerDashboard {...props} />
  </ProjectProvider>
);
export default Dashboard;

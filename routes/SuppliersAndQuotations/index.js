import React, { useState, useEffect } from 'react';
import { Card, Col } from 'antd';
import { ProjectProvider } from '../../contexts/projects';
import { Cookies } from 'react-cookie';
import NoDataAvailable from '../../app/components/NextDeal/NoDataAvailable.js';
import IntlMessages from '../../util/IntlMessages';

const SuppliersAndQuotationsDashboard = () => {
  const [buyerId, setBuyerId] = useState(null);
  const cookie = new Cookies();
  useEffect(() => {
    setBuyerId(cookie.get('buyerId'));
  });

  return (
    <React.Fragment>
      <Card className="ant-card gx-card-widget">
        <div className="ant-card-head gx-pt-0">
          <div className="ant-card-head-wrapper">
            <div className="ant-card-head-title gx-text-left">
              <h4 className="gx-card-bordered-title">
                <i className="icon icon-auth-screen gx-mr-3" />
                <IntlMessages id="app.common.text.suppliersNquotations" />
              </h4>
            </div>
          </div>
        </div>
        {buyerId ? (
          <div>
            <iframe
              src={`${process.env.NEXT_PUBLIC_GRAFANA_HOST}/d-solo/lQAafVo7k/suppliers-and-quotations?orgId=1&var-Buyer=${buyerId}&var-Project=All&from=1642077601483&to=1642682401483&panelId=10`}
              width="100%"
              height="300"
              frameBorder="0"
            />
            <div>
              <iframe
                src={`${process.env.NEXT_PUBLIC_GRAFANA_HOST}/d-solo/lQAafVo7k/suppliers-and-quotations?orgId=1&var-Buyer=${buyerId}&var-Project=All&from=1642077669000&to=1642682469000&panelId=8`}
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

const SuppliersAndQuotations = props => (
  <ProjectProvider>
    <SuppliersAndQuotationsDashboard {...props} />
  </ProjectProvider>
);
export default SuppliersAndQuotations;

import React from 'react';
import { Row, Col, Button } from 'antd';
import Link from 'next/link';

import Widget from '../../app/components/Widget/index';

import IntlMessages from '../../util/IntlMessages';

import QuotationCard from '../../app/components/NextDeal/QuotationCard';

const colSpan = 24 / 3;

const Quotations = () => {
  const Header = title => {
    return (
      <div className="ant-card-head">
        <div className="ant-card-head-wrapper">
          <div className="ant-card-head-title">{title}</div>
        </div>
      </div>
    );
  };

  const ProjectDetails = () => {
    return (
      <Widget>
        <div className="gx-media gx-featured-item">
          <div className="gx-featured-thumb">
            <img
              className="gx-rounded-lg gx-width-175"
              src={'https://via.placeholder.com/1100x750'}
              alt="..."
            />
          </div>
          <div className="gx-media-body gx-featured-content">
            <div className="gx-featured-content-left">
              <h3 className="gx-mb-2">Project name</h3>
              <p className="gx-text-grey gx-mb-1">subTitle</p>
            </div>
            <div className="gx-featured-content-right">
              <div>
                <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">1934577</h2>
                <p className="gx-text-grey gx-fs-sm">sqft</p>
              </div>
            </div>
          </div>
        </div>
      </Widget>
    );
  };

  return (
    <div className="quotations">
      <div className="quotations-header">
        <div className="project-details">{ProjectDetails()}</div>
        <div>
          <Link href="/new-quotation">
            <Button type="primary" className="gx-btn-block">
              <i className="icon icon-add gx-mr-2" />
              <IntlMessages id="app.quotation.addQuotation" />
            </Button>
          </Link>
        </div>
      </div>
      <Row>
        <Col span={colSpan} className="gx-bg-grey customCardHeight">
          {Header('In progress')}
          <QuotationCard />
        </Col>
        <Col span={colSpan} className="gx-bg-grey left-border">
          {Header('Awarded')}
        </Col>
        <Col span={colSpan} className="gx-bg-grey left-border">
          {Header('Ended')}
        </Col>
      </Row>
    </div>
  );
};

export default Quotations;

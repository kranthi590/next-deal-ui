import React from "react";
import { Row, Col, Button } from "antd";
import Link from "next/link";

import Widget from "../../app/components/Widget/index";

import IntlMessages from "../../util/IntlMessages";

import "./index.css";

const colSpan = 24 / 3;

const Quotations = () => {
  const Header = (title) => {
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
              src={"https://via.placeholder.com/1100x750"}
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
                <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">
                  1934577
                </h2>
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
        <Col span={colSpan} className="gx-bg-grey">
          {Header("In progress")}

          <p>
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
          </p>
          <p>
          The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
          </p>
        </Col>
        <Col span={colSpan} className="gx-bg-grey left-border">
          {Header("Awarded")}
        </Col>
        <Col span={colSpan} className="gx-bg-grey left-border">
          {Header("Ended")}
        </Col>
      </Row>
    </div>
  );
};

export default Quotations;

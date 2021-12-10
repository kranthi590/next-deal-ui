import React from "react";
import { Row, Col, Button, Avatar } from "antd";
import Link from "next/link";
import { handleApiErrors, httpClient, setApiContext } from "../../../util/Api";
import cookie from "cookie";

import Widget from "../../../app/components/Widget";
import IntlMessages from "../../../util/IntlMessages";
import QuotationCard from "../../../app/components/NextDeal/QuotationCard";
import FilesManager from "../../../app/common/FileManager";
import "../../../routes/Quotations/index.css";

import { formatAmount, getAvatar } from "../../../util/util";
import CustomScrollbars from "../../../util/CustomScrollbars";
import NoDataAvailable from "../../../app/components/NoDataAvailable.js";

const colSpan = 24 / 3;

const Quotations = ({ project = {}, inProgress = [], awarded = [], completed = [] }) => {
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
      <>
      <Widget>
        <Row>
          <Col span={12}>
              <div className="gx-media gx-featured-item">
                <div className="gx-featured-thumb">
                  <Avatar
                    className="gx-rounded-lg gx-size-100"
                    alt={project.name}
                    style={{ color: '#f56a00', backgroundColor: '#fde3cf', fontSize: '2rem' }}
                    >{getAvatar(project.name)}</Avatar>
                </div>
                <div className="gx-media-body gx-featured-content">
                  <div className="gx-featured-content-left">
                    <h3 className="gx-mb-2">{project.name}</h3>
                  <p className="gx-text-grey gx-mb-1">{project.additionalData}</p>
                  <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">
                      ${formatAmount(`${project.estimatedBudget}`)}
                    <p className="gx-text-grey gx-fs-sm gx-text-uppercase">{project.currency}</p>
                  </h2>
                  </div>
                </div>
              </div>
          </Col>
          <Col span={12}>
            <FilesManager
              files={project.files}
              context={{
                fileType: "project",
                projectId: project.id
                }} />
          </Col>
        </Row>
      </Widget>
        <Link
          href={'/projects/' + [project.id] + '/new-quote'}
        >
          <Button type="primary" className="gx-btn gx-w-100  gx-mb-4">
            <i className="icon icon-add gx-mr-2" />
            <IntlMessages id="app.quotation.addQuotation" />
          </Button>
        </Link>
      </>
    );
  };
  return (
    <div className="quotations">
      <div className="quotations-header">
        <div className="project-details gx-mr-0">{ProjectDetails()}</div>
      </div>
        <div>
        </div>
      <Row gutter={8}>
        <Col span={colSpan} style={{ backgroundColor: "transparent!important" }}>
          <div style={{ backgroundColor: "#ffffff" }} className="gx-h-100">
          {Header("In progress")}
            <div className="gx-customizer">
              <CustomScrollbars>
              <div className="gx-p-2">
            {inProgress &&
            inProgress.map((item) => (
                      <QuotationCard key={item.id} data={item} />
            ))}
                {(inProgress.length === 0) && (<NoDataAvailable />)}
              </div>
          </CustomScrollbars>
          </div>
          </div>
        </Col>
        <Col span={colSpan} style={{ backgroundColor: "transparent!important" }}>
          <div style={{ backgroundColor: "#ffffff" }} className="gx-h-100">
            {Header("Awarded")}
            <div className="gx-customizer">
              <CustomScrollbars>
              <div className="gx-p-2">
                {awarded && awarded.map((item) => <QuotationCard key={item.id} data={item} />)}
                {(awarded.length === 0) && (<NoDataAvailable />)}
              </div>
          </CustomScrollbars>
          </div>
          </div>
        </Col>
        <Col span={colSpan} style={{ backgroundColor: "transparent!important" }}>
          <div style={{ backgroundColor: "#ffffff" }} className="gx-h-100">
          {Header("Completed")}
            <div className="gx-customizer">
              <CustomScrollbars>
              <div className="gx-p-2">
                  {completed && completed.map((item) => <QuotationCard key={item.id} data={item} />)}
                {(completed.length === 0) && (<NoDataAvailable />)}
              </div>
            </CustomScrollbars>
          </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Quotations;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  let project = {};
  let inProgress = [];
  let awarded = [];
  let completed = [];
  try {
    const headers = setApiContext(req, res, query);
    console.log(req.headers);
    const cookies = cookie.parse(req.headers.cookie || "");
    let promises = [
      await httpClient.get(`projects/${query.id}`, {
        headers,
      }),
      await httpClient.get(`projects/${query.id}/quotations?status=created`, {
        headers,
      }),
      await httpClient.get(`projects/${query.id}/quotations?status=awarded`, {
        headers,
      }),
      await httpClient.get(`projects/${query.id}/quotations?status=completed`, {
        headers,
      }),
    ];
    await Promise.all(promises).then(
      ([projectData, inProgressData, awardedData, completedData]) => {
        if (projectData.data.data && projectData.data.data.files) {
          projectData.data.data.files.forEach(file => {
            file.fileUrl = `${file.fileUrl}?token=${cookies.token}`;
          });
        }
        project = projectData.data.data;
        inProgress = inProgressData.data.data.rows;
        awarded = awardedData.data.data.rows;
        completed = completedData.data.data.rows;
      }
    );
  } catch (error) {
    handleApiErrors(req, res, query, error);
  }
  return {
    props: {
      project,
      inProgress,
      awarded,
      completed
    },
  };
}



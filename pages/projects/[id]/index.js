import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Avatar, Divider } from 'antd';
import Link from 'next/link';
import { handleApiErrors, httpClient, setApiContext } from '../../../util/Api';
import cookie from 'cookie';

import Widget from '../../../app/components/Widget';
import IntlMessages from '../../../util/IntlMessages';
import QuotationCard from '../../../app/components/NextDeal/QuotationCard';
import FilesManager from '../../../app/common/FileManager';

import { formatAmount, getAvatar } from '../../../util/util';
import CustomScrollbars from '../../../util/CustomScrollbars';
import NoDataAvailable from '../../../app/components/NextDeal/NoDataAvailable.js';
import BreadCrumb from '../../../app/components/BreadCrumb';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ResponsesProvider, useResponse } from '../../../contexts/responses';

const colSpan = 24 / 3;

const QuotationsList = ({ project = {}, inProgress, awarded, completed }) => {
  // inprogress
  const [inprogressQuotationsData, setInprogressQuotationsData] = useState(inProgress.rows || []);
  const [sizeInprogress, setSizeInprogress] = useState(10);
  const [hasMoreInprogress, setHasMoreInprogress] = useState(true);
  const [inProgressCount, setInprogressCount] = useState(inProgress.count || 0);
  const [in_ProgressCount, setIn_progressCount] = useState(0);
  // awarded
  const [awardedQuotationsData, setAwardedQuotationsData] = useState(awarded.rows || []);
  const [sizeAwarded, setSizeAwarded] = useState(10);
  const [hasMoreAwarded, setHasMoreAwarded] = useState(true);
  const [awardedCount, setAwardedCount] = useState(awarded.count || 0);
  // completed
  const [completedQuotationsData, setCompletedQuotationsData] = useState(completed.rows || []);
  const [sizeCompleted, setSizeCompleted] = useState(10);
  const [hasMoreCompleted, setHasMoreCompleted] = useState(true);
  const [completedCount, setCompletedCount] = useState(completed.count || 0);

  const { getQuotationsByPagination } = useResponse();
  const loadMoreInprogressQuotations = () => {
    if (inProgressCount <= inprogressQuotationsData.length) {
      loadMoreIn_progressQuotations();
    } else {
      getQuotationsByPagination(
        project.id,
        'created',
        sizeInprogress,
        inprogressQuotationsData.length,
        data => {
          setInprogressCount(data.count);
          setInprogressQuotationsData(inprogressQuotationsData.concat(data.rows));
        },
      );
    }
  };

  const loadMoreIn_progressQuotations = () => {
    getQuotationsByPagination(
      project.id,
      'in_progress',
      sizeInprogress,
      inprogressQuotationsData.length - inProgressCount,
      data => {
        setIn_progressCount(data.count);
        setInprogressQuotationsData(inprogressQuotationsData.concat(data.rows));
      },
    );
  };

  const loadMoreAwardedQuotations = () => {
    getQuotationsByPagination(
      project.id,
      'awarded',
      sizeAwarded,
      awardedQuotationsData.length,
      data => {
        setAwardedCount(data.count);
        setAwardedQuotationsData(awardedQuotationsData.concat(data.rows));
      },
    );
  };

  const loadMoreCompletedQuotations = () => {
    getQuotationsByPagination(
      project.id,
      'completed',
      sizeCompleted,
      completedQuotationsData.length,
      data => {
        setCompletedCount(data.count);
        setCompletedQuotationsData(completedQuotationsData.concat(data.rows));
      },
    );
  };

  useEffect(() => {
    if (
      in_ProgressCount > 0 &&
      inProgressCount + in_ProgressCount === inprogressQuotationsData.length
    ) {
      setHasMoreInprogress(false);
    }
    if (awardedCount === awardedQuotationsData.length) {
      setHasMoreAwarded(false);
    }
    if (completedCount === completedQuotationsData.length) {
      setHasMoreCompleted(false);
    }
  }, [inprogressQuotationsData, awardedQuotationsData, completedQuotationsData]);

  useEffect(() => {
    if (inProgressCount < 10) {
      loadMoreIn_progressQuotations();
    }
  }, []);

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
      <>
        <BreadCrumb navItems={[{ text: 'Projects', route: '/projects' }, { text: project.name }]} />
        <Widget>
          <Row>
            <Col span={12}>
              <div className="gx-media gx-featured-item">
                <div className="gx-featured-thumb">
                  <Avatar
                    className="gx-rounded-lg gx-size-100"
                    alt={project.name}
                    style={{ color: '#f56a00', backgroundColor: '#fde3cf', fontSize: '2rem' }}
                  >
                    {getAvatar(project.name)}
                  </Avatar>
                </div>
                <div className="gx-media-body gx-featured-content">
                  <div className="gx-featured-content-left">
                    <h3 className="gx-mb-2">{project.name}</h3>
                    <p className="gx-text-grey gx-mb-1">{project.additionalData}</p>
                    <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">
                      ${formatAmount(`${project.estimatedBudget}`)}
                      <span className="gx-text-grey gx-fs-sm gx-text-uppercase">
                        {' '}
                        {project.currency}
                      </span>
                    </h2>
                  </div>
                </div>
              </div>
            </Col>
            <Col
              span={12}
              style={{
                height: '150px',
                overflowX: 'auto',
              }}
              className="gx-d-flex gx-justify-content-start gx-align-items-start"
            >
              <FilesManager
                files={project.files}
                context={{
                  assetRelation: 'project',
                  assetRelationId: project.id,
                }}
              />
            </Col>
          </Row>
        </Widget>
        <Link href={'/projects/' + [project.id] + '/new-quote'}>
          <Button type="primary" className="gx-btn gx-w-100  gx-mb-4">
            <i className="icon icon-add gx-mr-2" />
              <IntlMessages id="app.quotation.addquotation"/>
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
      <Row gutter={8}>
        <Col span={colSpan} className="quotation-column-divider">
          <div style={{ backgroundColor: '#ffffff' }} className="gx-h-100">
            {Header(<IntlMessages id="app.quotationresponses.button.inprogress" />)}
            <div className="gx-customizer">
              <CustomScrollbars sid="inprogressQuotations">
                <InfiniteScroll
                  dataLength={inprogressQuotationsData.length}
                  next={loadMoreInprogressQuotations}
                  scrollableTarget="inprogressQuotations"
                  hasMore={hasMoreInprogress}
                  // endMessage={
                  //   inprogressQuotationsData.length === 0 ? <NoDataAvailable /> :
                  //     <Divider><IntlMessages id="app.common.text.noMoreData" /></Divider>
                  // }
                >
                  <div className="gx-p-2">
                    {inprogressQuotationsData &&
                      inprogressQuotationsData.map(item => (
                        <QuotationCard key={item.id} data={item} activeTab={1} />
                      ))}
                  </div>
                </InfiniteScroll>
              </CustomScrollbars>
            </div>
          </div>
        </Col>
        <Col span={colSpan} className="quotation-column-divider">
          <div style={{ backgroundColor: '#ffffff' }} className="gx-h-100">
            {Header(<IntlMessages id="app.quotationresponses.button.awarded" />)}
            <div className="gx-customizer">
              <CustomScrollbars sid="awardedQuotations">
                <InfiniteScroll
                  dataLength={awardedQuotationsData.length}
                  next={loadMoreAwardedQuotations}
                  scrollableTarget="awardedQuotations"
                  hasMore={hasMoreAwarded}
                  // endMessage={
                  //   awardedQuotationsData.length === 0 ? <NoDataAvailable /> :
                  //     <Divider><IntlMessages id="app.common.text.noMoreData" /></Divider>
                  // }
                >
                  <div className="gx-p-2">
                    {awardedQuotationsData &&
                      awardedQuotationsData.map(item => (
                        <QuotationCard key={item.id} data={item} activeTab={2} />
                      ))}
                  </div>
                </InfiniteScroll>
              </CustomScrollbars>
            </div>
          </div>
        </Col>
        <Col span={colSpan} className="quotation-column-divider">
          <div style={{ backgroundColor: '#ffffff' }} className="gx-h-100">
            {Header(<IntlMessages id="app.quotationresponses.button.completed" />)}
            <div className="gx-customizer">
              <CustomScrollbars sid="completedQuotations">
                <InfiniteScroll
                  dataLength={completedQuotationsData.length}
                  next={loadMoreCompletedQuotations}
                  scrollableTarget="completedQuotations"
                  hasMore={hasMoreCompleted}
                  // endMessage={
                  //   completedQuotationsData.length === 0 ? <NoDataAvailable /> :
                  //     <Divider><IntlMessages id="app.common.text.noMoreData" /></Divider>
                  // }
                >
                  <div className="gx-p-2">
                    {completedQuotationsData &&
                      completedQuotationsData.map(item => (
                        <QuotationCard key={item.id} data={item} activeTab={3} />
                      ))}
                  </div>
                </InfiniteScroll>
              </CustomScrollbars>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Quotations = props => (
  <ResponsesProvider>
    <QuotationsList {...props} />
  </ResponsesProvider>
);

export default Quotations;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  let project = {};
  let inProgress = [];
  let awarded = [];
  let completed = [];
  try {
    const headers = setApiContext(req, res, query);
    const cookies = cookie.parse(req.headers.cookie || '');
    let promises = [
      await httpClient.get(`projects/${query.id}`, {
        headers,
      }),
      await httpClient.get(`projects/${query.id}/quotations?status=created&size=10&offset=0`, {
        headers,
      }),
      await httpClient.get(`projects/${query.id}/quotations?status=awarded&size=10&offset=0`, {
        headers,
      }),
      await httpClient.get(`projects/${query.id}/quotations?status=completed&size=10&offset=0`, {
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
        inProgress = inProgressData.data.data;
        awarded = awardedData.data.data;
        completed = completedData.data.data;
      },
    );
  } catch (error) {
    handleApiErrors(req, res, query, error);
  }
  return {
    props: {
      project,
      inProgress,
      awarded,
      completed,
    },
  };
}

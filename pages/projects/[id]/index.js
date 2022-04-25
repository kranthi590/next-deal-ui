import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Avatar, Modal } from 'antd';
import Link from 'next/link';
import { handleApiErrors, httpClient, setApiContext } from '../../../util/Api';
import cookie from 'cookie';

import Widget from '../../../app/components/Widget';
import IntlMessages from '../../../util/IntlMessages';
import QuotationCard from '../../../app/components/NextDeal/QuotationCard';
import FilesManager from '../../../app/common/FileManager';

import { formatAmount, getAvatar, successNotification } from '../../../util/util';
import CustomScrollbars from '../../../util/CustomScrollbars';
import BreadCrumb from '../../../app/components/BreadCrumb';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ResponsesProvider, useResponse } from '../../../contexts/responses';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { useAuth } from '../../../contexts/use-auth';
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
  const { deleteFile } = useAuth();

  const { getQuotationsByPagination } = useResponse();
  const intl = useIntl();
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

  const customFileDelete = file => {
    const { confirm } = Modal;
    return new Promise((resolve, reject) => {
      confirm({
        title: '¿Está seguro de que quiere eliminar el archivo?', //<IntlMessages id="app.common.confirmDeleteFile" />,
        onOk: () => {
          deleteFile(
            file.url.split('files/')[1].split('/')[0],
            data => {
              successNotification('app.registration.detailsSaveSuccessMessage');
              resolve(true);
            },
            () => {
              reject(true);
            },
          );
        },
        onCancel: () => {
          reject(true);
        },
      });
    });
  };

  const ProjectDetails = () => {
    return (
      <>
        <BreadCrumb
          navItems={[
            { text: <IntlMessages id="sidebar.project.Projects" />, route: '/projects' },
            { text: project.name },
          ]}
        />
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
                    {/* <h3 className="gx-mb-2">{project.name}</h3> */}

                    <p className="gx-mb-1">
                      <IntlMessages id="app.project.field.projectname" />:{' '}
                      <span className="gx-text-grey">{project.name}</span>
                    </p>
                    {project.managerName ? (
                      <p className="gx-mb-1">
                        <IntlMessages id="app.project.field.manager" />:{' '}
                        <span className="gx-text-grey">{project.managerName}</span>
                      </p>
                    ) : null}
                    {project.costCenter ? (
                      <p className="gx-mb-1">
                        <IntlMessages id="app.project.field.costcenter" />:{' '}
                        <span className="gx-text-grey">{project.costCenter}</span>
                      </p>
                    ) : null}
                    {project.startDate ? (
                      <p className="gx-mb-1">
                        <IntlMessages id="app.project.field.startdate" />:{' '}
                        <span className="gx-text-grey">
                          {moment(project.startDate).format('DD-MM-YYYY')}
                        </span>
                      </p>
                    ) : null}
                    {project.estimatedBudget ? (
                      <p className="gx-mb-1">
                        <IntlMessages id="app.project.field.estimatedBudget" />:
                        <span className="gx-text-grey">
                          {project.estimatedBudget ? (
                            <> {formatAmount(`${project.estimatedBudget}`)}</>
                          ) : null}
                          {project.currency ? (
                            <span className="gx-text-grey gx-fs-sm gx-text-uppercase">
                              {' '}
                              {project.currency}
                            </span>
                          ) : null}
                        </span>
                      </p>
                    ) : null}
                    {/*<p className="gx-mb-1"><IntlMessages id="app.project.field.projectenddate" />: <span className='gx-text-grey'>{moment(project.expectedEndDate).format('DD-MM-YYYY')}</span></p>
                     <p className="gx-mb-1"><IntlMessages id="app.project.field.costcenter" />: <span className='gx-text-grey'>{project.costCenter}</span></p>
                    <p className="gx-mb-1"><IntlMessages id="app.project.field.manager" />: <span className='gx-text-grey'>{project.managerName}</span></p>
                    <p className="gx-mb-1"><IntlMessages id="app.project.field.projectDescription" />: <span className='gx-text-grey'>{project.description}</span></p> */}

                    {/* <p className="gx-text-grey gx-mb-1">{project.additionalData}</p> */}
                    {/* <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">
                      ${formatAmount(`${project.estimatedBudget}`)}
                      <span className="gx-text-grey gx-fs-sm gx-text-uppercase">
                        {' '}
                        {project.currency}
                      </span>
                    </h2> */}
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
                tooltiptext={
                  intl.formatMessage({ id: 'app.common.filesAcceptTooltip' }) +
                  ` (.pdf, .xlsx, .jpg, etc)`
                }
                allowDelete={true}
                handleCustomDelete={customFileDelete}
              />
            </Col>
          </Row>
        </Widget>
        <Link href={'/projects/' + [project.id] + '/new-quote'}>
          <Button type="primary" className="gx-btn gx-w-100 gx-mb-4 nd-add-quote">
            <PlusOutlined style={{ fontSize: '18px', marginRight: '5px' }} />
            <IntlMessages id="app.quotation.addquotation" />
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

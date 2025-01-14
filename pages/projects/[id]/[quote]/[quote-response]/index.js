import React, { useState } from 'react';
import cookie from 'cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Row, Col, Button, Modal, Divider } from 'antd';

import Widget from '../../../../../app/components/Widget';
import {
  formatAmount,
  getAvatar,
  handleErrorNotification,
  successNotification,
} from '../../../../../util/util';
import ProjectProgressTabs from '../../../../../app/components/NextDeal/ProjectProgressTabs';
import QuoteResponses from '../../../../../app/components/NextDeal/QuoteResponse';
import QuotationAwarded from '../../../../../app/components/NextDeal/QuotationAwarded';
import { handleApiErrors, httpClient, setApiContext, uploadFiles } from '../../../../../util/Api';
import { ResponsesProvider, useResponse } from '../../../../../contexts/responses';
import NoDataAvailable from '../../../../../app/components/NextDeal/NoDataAvailable.js';
import QuotationCompleted from '../../../../../app/components/NextDeal/QuotationCompleted';
import FilesManager from '../../../../../app/common/FileManager';
import BreadCrumb from '../../../../../app/components/BreadCrumb';
import IntlMessages from '../../../../../util/IntlMessages';
import { CloseOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import SweetAlert from 'react-bootstrap-sweetalert';
import QuotationTimeline from '../../../../../app/components/NextDeal/QuotationTimeline';
import moment from 'moment';
import SupplierRegistrationPage from '../../../../supplier-registration';
import SupplierSelector from '../../../../../app/components/NextDeal/SuppliersSelector';
import { RegistrationProvider } from '../../../../../contexts/business-registration';
import { useAuth } from '../../../../../contexts/use-auth';

const NewQuoteResponse = props => {
  const { projectsList, quotationData, awardedResponses, projectsDetails, activitiesList } = props;
  const {
    createResponses,
    createAward,
    completeQuotation,
    deAwardQuotation,
    abortQuotation,
    addNewActivity,
    getActivities,
    deleteQuotationResponse,
    deleteQuotation,
    assignSuppliersToQuotation,
    unAssignQuotationResponse,
    updateQuotationResponse,
  } = useResponse();
  const [showAbortAlert, setShowAbortAlert] = useState(false);
  const [activeAbortId, setActiveAbortId] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ type: '', confirmText: '' });
  const [quotationActivities, setQuotationActivities] = useState(activitiesList);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [visible, setVisible] = useState(false);
  const { deleteFile } = useAuth();

  const router = useRouter();
  const projectId = router.query.quote;
  let awarded = false,
    completed = false;
  if (awardedResponses.length) {
    awarded = true;
    if (quotationData.status === 'completed') {
      completed = true;
    }
  }
  const onSave = (values, qid) => {
    if (!qid) {
      const files = values.files;
      delete values.files;
      createResponses(projectId, values, async data => {
        try {
          if (files.length > 0) {
            await uploadFiles(
              files,
              {
                assetRelation: 'quotation_response',
                assetRelationId: data.id,
              },
              true,
            );
          }
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.data &&
            error.response.data.data.errors &&
            error.response.data.data.errors.length
          ) {
            error.response.data = error.response.data.data;
            handleErrorNotification(error);
          }
        }
        successNotification('app.registration.detailsSaveSuccessMessage');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
    if (qid) {
      createAward(qid, values, data => {
        successNotification('app.registration.detailsSaveSuccessMessage');
        setTimeout(() => {
          window.location.hash = '2';
          window.location.reload();
        }, 1000);
      });
    }
  };

  const onDeleteResponse = (deleteId, newQuote) => {
    setShowAbortAlert(true);
    if (newQuote) {
      setAlertInfo({
        type: 'unassign',
        confirmText: <IntlMessages id="app.common.text.confirmUnassignQuotationResponse" />,
      });
    } else {
      setAlertInfo({
        type: 'delete',
        confirmText: <IntlMessages id="app.common.text.confirmDeleteQuotationResponse" />,
      });
    }
    setSelectedResponseId(deleteId);
  };

  const onCompleteQuotation = (values, qid) => {
    completeQuotation(qid, values, data => {
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {
        window.location.hash = '3';
        window.location.reload();
      }, 1000);
    });
  };

  const onUpdateData = (values, qid) => {
    updateQuotationResponse(qid, values, data => {
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  const onConfirmAlert = () => {
    if (alertInfo.type === 'deaward') {
      deAwardQuotation(activeAbortId, data => {
        successNotification('app.registration.detailsSaveSuccessMessage');
        setTimeout(() => {
          setShowAbortAlert(false);
          setActiveAbortId(null);
          window.location.hash = '1';
          window.location.reload();
        }, 1000);
      });
    }
    if (alertInfo.type === 'abort') {
      abortQuotation(quotationData.id, data => {
        successNotification('app.registration.detailsSaveSuccessMessage');
        setTimeout(() => {
          window.location.href = `${window.location.origin}/app/projects/${quotationData.projectId}`;
        }, 1000);
      });
    }
    if (alertInfo.type === 'delete') {
      deleteQuotationResponse(selectedResponseId, data => {
        successNotification('app.registration.detailsSaveSuccessMessage');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
    if (alertInfo.type === 'deleteQuotation') {
      deleteQuotation(quotationData.id, data => {
        successNotification('app.registration.detailsSaveSuccessMessage');
        setTimeout(() => {
          window.location.href = `${window.location.origin}/app/projects/${quotationData.projectId}`;
        }, 1000);
      });
    }
    if (alertInfo.type === 'unassign') {
      unAssignQuotationResponse(quotationData.id, { suppliers: [selectedResponseId] }, data => {
        successNotification('app.registration.detailsSaveSuccessMessage');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  };

  const onDeawardQuotation = qid => {
    setShowAbortAlert(true);
    setAlertInfo({
      type: 'deaward',
      confirmText: <IntlMessages id="app.common.text.confirmquotationDeaward" />,
    });
    setActiveAbortId(qid);
  };
  const onAbortQuotation = () => {
    setShowAbortAlert(true);
    setAlertInfo({
      type: 'abort',
      confirmText: <IntlMessages id="app.common.text.confirmQuotationAborted" />,
    });
  };
  const onDeleteQuotation = () => {
    console.log('work');
    setShowAbortAlert(true);
    setAlertInfo({
      type: 'deleteQuotation',
      confirmText: <IntlMessages id="app.common.text.confirmQuotationDelete" />,
    });
  };
  const onCancelAlert = () => {
    setShowAbortAlert(false);
    setActiveAbortId(null);
    setSelectedResponseId(null);
    setAlertInfo({ type: '', confirmText: '' });
  };

  const onSaveActivity = (values, resetForm) => {
    addNewActivity({ ...values, quotationRequestId: quotationData.id }, data => {
      resetForm();
      successNotification('app.registration.detailsSaveSuccessMessage');
      getActivities(quotationData.id, data => {
        setQuotationActivities(data);
      });
    });
  };

  const showCreateSupplierModal = () => {
    setVisible(true);
  };
  const onSupplierCreated = newSupplier => {
    assignSuppliersToQuotation(quotationData.id, { suppliers: [newSupplier] }, () => {
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  const customFileDelete = file => {
    const { confirm } = Modal;
    return new Promise((resolve, reject) => {
      confirm({
        title: '¿Está seguro de que quiere eliminar el archivo?',
        onOk: () => {
          if (file.status !== 'error') {
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
          } else {
            resolve(true);
          }
        },
        onCancel: () => {
          reject(true);
        },
      });
    });
  };

  const ProjectDetails = () => {
    return (
      <Widget>
        <Row>
          <Col span={12}>
            <div className="gx-media gx-featured-item">
              <div className="gx-featured-thumb">
                <Avatar
                  className="gx-rounded-lg gx-size-100"
                  alt={quotationData.name}
                  style={{ color: '#f56a00', backgroundColor: '#fde3cf', fontSize: '2rem' }}
                >
                  {getAvatar(quotationData.name)}
                </Avatar>
              </div>
              <div className="gx-media-body gx-featured-content">
                <div className="gx-featured-content-left">
                  {projectsDetails && projectsDetails.name ? (
                    <p className="gx-mb-1">
                      <span className="gx-text-grey">{projectsDetails.name}</span>
                    </p>
                  ) : null}
                  {quotationData.name ? (
                    <p className="gx-mb-1">
                      <IntlMessages id="app.quotation.field.quotationname" />:{' '}
                      <span className="gx-text-grey">{quotationData.name}</span>
                    </p>
                  ) : null}
                  {quotationData.estimatedBudget ? (
                    <p className="gx-mb-1">
                      <IntlMessages id="app.project.field.estimatedBudget" />:
                      <span className="gx-text-grey">
                        {quotationData.estimatedBudget ? (
                          <> {formatAmount(`${quotationData.estimatedBudget}`)}</>
                        ) : null}
                        {quotationData.currency ? (
                          <span className="gx-text-grey gx-fs-sm gx-text-uppercase">
                            {' '}
                            {quotationData.currency}
                          </span>
                        ) : null}
                      </span>
                    </p>
                  ) : null}
                  {quotationData.startDate ? (
                    <p className="gx-mb-1">
                      <IntlMessages id="app.project.field.startdate" />:{' '}
                      <span className="gx-text-grey">
                        {moment(quotationData.startDate).format('DD-MM-YYYY')}
                      </span>
                    </p>
                  ) : null}
                  {quotationData.expectedEndDate ? (
                    <p className="gx-mb-1">
                      <IntlMessages id="app.project.field.enddate" />:{' '}
                      <span className="gx-text-grey">
                        {moment(quotationData.expectedEndDate).format('DD-MM-YYYY')}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </Col>
          <Col
            span={12}
            style={{
              height: '130px',
              overflowX: 'auto',
            }}
          >
            <FilesManager
              files={quotationData.files}
              context={{
                assetRelation: 'quotation_request',
                assetRelationId: quotationData.id,
              }}
              allowDelete={quotationData.status === 'completed' ? false : true}
              handleCustomDelete={customFileDelete}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="gx-d-flex gx-justify-content-end gx-mt-4">
              {quotationData.status === 'created' || quotationData.status === 'in_progress' ? (
                <Button
                  type="primary"
                  icon={<CloseOutlined />}
                  className="gx-mb-0 gx-mt-1"
                  onClick={onAbortQuotation}
                >
                  <span>
                    <IntlMessages id="app.quotationresponses.button.abort" />
                  </span>
                </Button>
              ) : (
                <></>
              )}
              {quotationData.status === 'created' || quotationData.status === 'in_progress' ? (
                <Button
                  type="primary"
                  className="gx-mb-0 gx-mt-1"
                  onClick={showCreateSupplierModal}
                >
                  <UserAddOutlined className="gx-mr-2" />
                  <IntlMessages id="app.common.addSupplier" />
                </Button>
              ) : (
                <></>
              )}
              {quotationData.status === 'created' || quotationData.status === 'in_progress' ? (
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  className="gx-mb-0 gx-mt-1"
                  onClick={onDeleteQuotation}
                >
                  <span>
                    <IntlMessages id="button.delete" />
                  </span>
                </Button>
              ) : (
                <></>
              )}
              {quotationData.status === 'aborted' ? (
                <p className="gx-text-danger">
                  <IntlMessages id="app.common.text.quotationAborted" />
                </p>
              ) : null}
            </div>
          </Col>
        </Row>
      </Widget>
    );
  };

  const InProgressForms = () => {
    return (
      <>
        {projectsList.length === 0 && <NoDataAvailable />}
        {projectsList.map(item => (
          <QuoteResponses
            formData={item}
            key={item.id}
            onSave={onSave}
            onUpdateData={onUpdateData}
            awarded={awarded}
            onDeleteResponse={onDeleteResponse}
            quotationData={quotationData}
            allowDelete={quotationData.status === 'completed' ? false : true}
          />
        ))}
      </>
    );
  };
  const AwardedForms = () => {
    return (
      <>
        {awardedResponses.length === 0 && <NoDataAvailable />}
        {awardedResponses &&
          awardedResponses.map(item => (
            <QuotationAwarded
              formData={item}
              key={item.id}
              onUpdateData={onUpdateData}
              onSave={onCompleteQuotation}
              completed={completed}
              onDeaward={() => {
                onDeawardQuotation(item.id);
              }}
              allowDelete={quotationData.status === 'completed' ? false : true}
            />
          ))}
      </>
    );
  };
  const CompletedForms = () => {
    return (
      <>
        {completed === false || awardedResponses.length === 0 ? (
          <NoDataAvailable />
        ) : (
          awardedResponses.map(item => (
            <QuotationCompleted formData={item} key={item.id} completed={completed} />
          ))
        )}
      </>
    );
  };

  const projectDetailsTabs = {
    defaultActiveKey: '1',
    tabs: [
      {
        key: '1',
        title: <IntlMessages id="app.quotationresponses.button.inprogress" />,
        badgeCount: projectsList.length,
        tabContentComponent: <InProgressForms />,
      },
      {
        key: '2',
        title: <IntlMessages id="app.quotationresponses.button.awarded" />,
        badgeCount: awardedResponses.length,
        tabContentComponent: <AwardedForms />,
      },
      {
        key: '3',
        title: <IntlMessages id="app.quotationresponses.button.completed" />,
        badgeCount: completed === true ? awardedResponses.length : 0,
        tabContentComponent: <CompletedForms />,
      },
    ],
  };
  return (
    <>
      <BreadCrumb
        navItems={[
          { text: <IntlMessages id="sidebar.project.Projects" />, route: '/projects' },
          { text: projectsDetails.name, route: '/projects/' + quotationData.projectId },
          { text: quotationData.name },
        ]}
      />
      <div className="quotations">
        <div className="quotations-header">
          <div className="project-details">
            {ProjectDetails()}
            <QuotationTimeline activities={quotationActivities} onSaveActivity={onSaveActivity} />
            <ProjectProgressTabs tabsConfig={projectDetailsTabs} enableHash />
          </div>
        </div>
      </div>
      <SweetAlert
        confirmBtnText={<IntlMessages id="button.ok" />}
        show={showAbortAlert}
        warning
        title={<IntlMessages id="app.common.text.confirm" />}
        onConfirm={onConfirmAlert}
        cancelBtnText={<IntlMessages id="button.cancel" />}
        showCancel
        onCancel={onCancelAlert}
      >
        <div>
          <span>{alertInfo.confirmText}</span>
        </div>
      </SweetAlert>
      <Modal
        title={<IntlMessages id={'app.common.addSupplier'} />}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        bodyStyle={{ padding: '0' }}
        okButtonProps={{ style: { display: 'none' } }}
        destroyOnClose={true}
        width={1000}
        maskClosable={false}
      >
        <SupplierRegistrationPage
          isBannerShown={false}
          showLoginLink={false}
          isBuyer={true}
          isAuthenticated={true}
          onAletSuccess={() => {
            window.location.reload();
          }}
          onSupplierCreated={onSupplierCreated}
        />
        <Divider>
          <IntlMessages id="app.userAuth.or" />
        </Divider>
        <div className="gx-p-4">
          <SupplierSelector
            quotationId={quotationData.id}
            existingSuppliers={projectsList.map(item =>
              item.supplier && item.supplier.id ? item.supplier.id : item.id,
            )}
          />
        </div>
      </Modal>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  let AssignedForResponses = [];
  let ResponsesList = [];
  let AwardedResponsesList = [],
    activitiesList = [];
  let QuotationData = {};
  let projectsDetails = null;
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const headers = setApiContext(req, res, query);
    const promises = [
      await httpClient.get(`quotations/${query.quote}/suppliers`, {
        headers,
      }),
      await httpClient.get(`quotations/${query.quote}/responses`, {
        headers,
      }),
      await httpClient.get(`quotations/${query.quote}`, {
        headers,
      }),
      await httpClient.get(`projects/${query.id}`, {
        headers,
      }),
      await httpClient.get(`activities/${query.quote}`, {
        headers,
      }),
    ];
    await Promise.all(promises).then(
      ([
        assignedForResponsesData,
        responsesListData,
        quotationData,
        projectData,
        activitiesData,
      ]) => {
        AssignedForResponses = assignedForResponsesData.data.data.map(item => ({
          ...item,
          newQuote: true,
        }));
        responsesListData.data.data.rows.forEach(({ files }) => {
          files.forEach(file => {
            file.fileUrl = `${file.fileUrl}?token=${cookies.token}`;
          });
        });
        responsesListData.data.data.rows.map(item => {
          if (item.isAwarded === true) {
            AwardedResponsesList.push(item);
          } else {
            ResponsesList.push(item);
          }
        });
        QuotationData = quotationData.data.data;
        projectsDetails = projectData.data.data;
        activitiesList = activitiesData.data.data;
      },
    );
  } catch (error) {
    handleApiErrors(req, res, query, error);
  }

  if (QuotationData.files) {
    const cookies = cookie.parse(req.headers.cookie || '');
    QuotationData.files.forEach(file => {
      file.fileUrl = `${file.fileUrl}?token=${cookies.token}`;
    });
  }
  return {
    props: {
      projectsList: [...ResponsesList, ...AssignedForResponses],
      quotationData: QuotationData,
      awardedResponses: AwardedResponsesList,
      projectsDetails: projectsDetails,
      activitiesList: activitiesList,
    },
  };
}

const QuoteResponse = props => (
  <RegistrationProvider>
    <ResponsesProvider>
      <NewQuoteResponse {...props} />
    </ResponsesProvider>
  </RegistrationProvider>
);
export default QuoteResponse;

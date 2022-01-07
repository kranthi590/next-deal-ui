import React from "react";
import cookie from "cookie";
import Link from 'next/link';
import { useRouter } from "next/router";
import { Avatar, Row, Col } from "antd";

import Widget from "../../../../../app/components/Widget";
import { formatAmount, getAvatar, successNotification } from "../../../../../util/util";
import ProjectProgressTabs from "../../../../../app/components/NextDeal/ProjectProgressTabs";
import QuoteResponses from "../../../../../app/components/NextDeal/QuoteResponse";
import QuotationAwarded from "../../../../../app/components/NextDeal/QuotationAwarded";
import { handleApiErrors, httpClient, setApiContext } from "../../../../../util/Api";
import { ResponsesProvider, useResponse } from "../../../../../contexts/responses";
import NoDataAvailable from "../../../../../app/components/NoDataAvailable.js";
import QuotationCompleted from "../../../../../app/components/NextDeal/QuotationCompleted";
import FilesManager from "../../../../../app/common/FileManager";
import BreadCrumb from "../../../../../app/components/BreadCrumb";
import IntlMessages from "../../../../../util/IntlMessages";


const NewQuoteResponse = (props) => {
  const { projectsList, quotationData, awardedResponses } = props;
  const { createResponses, createAward, completeQuotation,deAwardQuotation, abortQuotation } = useResponse();
  const router = useRouter();
  const projectId = router.query.quote;
  let awarded = false, completed = false;
  if (awardedResponses.length) {
    awarded = true;
    if (quotationData.status === 'completed') {
      completed = true;
    }
  }

  const onSave = (values, qid) => {
    if (values) {
      createResponses(projectId, values, (data) => {
        successNotification("app.registration.detailsSaveSuccessMessage");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
    if (qid) {
      createAward(qid, (data) => {
        successNotification("app.registration.detailsSaveSuccessMessage");
        setTimeout(() => {
          window.location.hash = "2";
          window.location.reload();
        }, 1000);
      })
    }
  };
  const onCompleteQuotation = (values, qid) => {
    completeQuotation(qid, values, (data) => {
      successNotification("app.registration.detailsSaveSuccessMessage");
      setTimeout(() => {
        window.location.hash = "3";
        window.location.reload();
      }, 1000);
    });
  }

  const onDeawardQuotation = (qid) => {
    deAwardQuotation(qid, (data) => {
      successNotification("app.registration.detailsSaveSuccessMessage");
      setTimeout(() => {
        window.location.hash = "1";
        window.location.reload();
      }, 1000);
    });
  }
  const onAbortQuotation = (qid) => {
    abortQuotation(qid, (data) => {
      successNotification("app.registration.detailsSaveSuccessMessage");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }
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
                >{getAvatar(quotationData.name)}</Avatar>
              </div>
              <div className="gx-media-body gx-featured-content">
                <div className="gx-featured-content-left">
                  <h3 className="gx-mb-2">
                  <Link href={'/projects/' + [quotationData.projectId]} as={'/projects/' + quotationData.projectId}>
                      <a>
                        {quotationData.name}-{quotationData.code}
                      </a>
                    </Link>
                    </h3>
                  {/* <p className="gx-text-grey gx-mb-1">{quotationData.description}</p> */}
                    <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">
                      ${formatAmount(`${quotationData.estimatedBudget}`)} <span className="gx-text-grey gx-fs-sm gx-text-uppercase">{quotationData.currency}</span>
                    </h2>
                </div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <FilesManager
                files={quotationData.files}
                context={{
                  assetRelation: "quotation_request",
                  assetRelationId: quotationData.id
                }}
              />
          </Col>
        </Row>
      </Widget>
    );
  };

  const InProgressForms = () => {
    return (<>
      {(projectsList.length === 0) && <NoDataAvailable />}
      {
        projectsList.map(item => (<QuoteResponses formData={item} key={item.id} onSave={onSave} awarded={awarded}
          onAbort={() => { onAbortQuotation(item.id) }} />))
      }
    </>)
  }
  const AwardedForms = () => {
    return (
      <>
        {(awardedResponses.length === 0) && <NoDataAvailable />}
        {
          awardedResponses.map(item => (<QuotationAwarded formData={item} key={item.id} onSave={onCompleteQuotation} completed={completed}
            onDeaward={() => { onDeawardQuotation(item.id) }}
          />))
        }
      </>
    )
  }
  const CompletedForms = () => {
    return (
      <>
        {
          (completed === false || awardedResponses.length === 0) ?
            <NoDataAvailable />
            :
            awardedResponses.map(item => (<QuotationCompleted formData={item} key={item.id} completed={completed} />))
        }
      </>
    )
  }

  const projectDetailsTabs = {
    defaultActiveKey: "1",
    tabs: [
      { key: "1", title: <IntlMessages id="app.quotationresponses.button.inprogress" />, badgeCount: projectsList.length, tabContentComponent: <InProgressForms /> },
      { key: "2", title: <IntlMessages id="app.quotationresponses.button.awarded" />, badgeCount: awardedResponses.length, tabContentComponent: <AwardedForms /> },
      { key: "3", title: <IntlMessages id="app.quotationresponses.button.completed" />, badgeCount: (completed === true) ? awardedResponses.length : 0, tabContentComponent: <CompletedForms /> },
    ]
  }
  return (
    <>
      <BreadCrumb navItems={[
        { text: "Projects", route: "/projects" },
        { text: quotationData.projectId , route: "/projects/" + quotationData.projectId },
        { text: quotationData.name }]}
      />
    <div className="quotations">
      <div className="quotations-header">
        <div className="project-details">{ProjectDetails()}
            <ProjectProgressTabs tabsConfig={projectDetailsTabs} enableHash />
        </div>
      </div>
    </div>
    </>

  )
}

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  let AssignedForResponses = [];
  let ResponsesList = [];
  let AwardedResponsesList = [];
  let QuotationData = {};
  let projectsList = null;
  try {

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
      })
    ]
    await Promise.all(promises).then(
      ([assignedForResponsesData, responsesListData, quotationData]) => {
        AssignedForResponses = (assignedForResponsesData.data.data).map(item => ({ ...item, newQuote: true }));
        (responsesListData.data.data.rows).map(item => {
          if (item.isAwarded === true) {
            AwardedResponsesList.push(item);
          } else {
            ResponsesList.push(item)
          }
        });
        QuotationData = quotationData.data.data;
      }
    );

  } catch (error) {
    handleApiErrors(req, res, query, error);
  }

  if (QuotationData.files) {
    const cookies = cookie.parse(req.headers.cookie || "");
    QuotationData.files.forEach(file => {
      file.fileUrl = `${file.fileUrl}?token=${cookies.token}`;
    });
  }
  return {
    props: {
      projectsList: [...ResponsesList, ...AssignedForResponses],
      quotationData: QuotationData,
      awardedResponses: AwardedResponsesList
    },
  };
}

const QuoteResponse = (props) => (
  <ResponsesProvider>
    <NewQuoteResponse {...props} />
  </ResponsesProvider>
)
export default QuoteResponse;

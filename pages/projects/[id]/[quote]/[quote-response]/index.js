import React, { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { Avatar } from "antd";
import Widget from "../../../../../app/components/Widget";
import { formatAmount, getAvatar, successNotification } from "../../../../../util/util";
import ProjectProgressTabs from "../../../../../app/components/NextDeal/ProjectProgressTabs";
import QuoteResponses from "../../../../../app/components/NextDeal/QuoteResponse";
import QuotationAwarded from "../../../../../app/components/NextDeal/QuotationAwarded";
import { handleApiErrors, httpClient, setApiContext } from "../../../../../util/Api";
import { ResponsesProvider, useResponse } from "../../../../../contexts/responses";
import NoDataAvailable from "../../../../../app/components/NoDataAvailable.js";

const NewQuoteResponse = (props) => {
  const { projectsList, quotationData, awardedResponses } = props;
  const { createResponses, createAward, completeQuotation } = useResponse();
  const router = useRouter();
  const projectId = router.query.quote;

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
  const ProjectDetails = () => {
    return (
      <Widget>
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
              <h3 className="gx-mb-2">{quotationData.name}-{quotationData.code}</h3>
              <p className="gx-text-grey gx-mb-1">{quotationData.description}</p>
            </div>
            <div className="gx-featured-content-right">
              <div>
                <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">
                  {formatAmount(`${quotationData.estimatedBudget}`)}
                </h2>
                <p className="gx-text-grey gx-fs-sm gx-text-uppercase">{quotationData.currency}</p>
              </div>
            </div>
          </div>
        </div>
      </Widget>
    );
  };

  const InProgressForms = () => {
    return (<>
      {(projectsList.length === 0) && <NoDataAvailable />}
      {
        projectsList.map(item => (<QuoteResponses formData={item} key={item.id} onSave={onSave} />))
      }
    </>)
  }
  const AwardedForms = () => {
    return (
      <>
        {(awardedResponses.length === 0) && <NoDataAvailable />}
        {
          awardedResponses.map(item => (<QuotationAwarded formData={item} key={item.id} onSave={onCompleteQuotation} />))
        }
      </>
    )
  }

  const projectDetailsTabs = {
    defaultActiveKey: "1",
    tabs: [
      { key: "1", title: "In Progress", badgeCount: projectsList.length, tabContentComponent: <InProgressForms /> },
      { key: "2", title: "Awarded", badgeCount: awardedResponses.length, tabContentComponent: <AwardedForms /> },
      { key: "3", title: "Completed", badgeCount: "1", tabContentComponent: "" },
    ]
  }
  return (
    <div className="quotations">
      <div className="quotations-header">
        <div className="project-details">{ProjectDetails()}
          <ProjectProgressTabs tabsConfig={projectDetailsTabs} enableHash/>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  console.log("Query text");
  console.log(query);
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

    // console.log({
    //   AssignedForResponses: AssignedForResponses,
    //   ResponsesList: ResponsesList,
    //   QuotationData: QuotationData,
    //   AwardedResponsesList: AwardedResponsesList
    // })
  } catch (error) {
    handleApiErrors(req, res, query, error);
  }
  return {
    props: {
      projectsList: [...AssignedForResponses, ...ResponsesList],
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

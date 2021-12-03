import React from "react";
import { useRouter } from "next/router";
import { Avatar } from "antd";
import Widget from "../../../../../app/components/Widget";
import { formatAmount, getAvatar, successNotification } from "../../../../../util/util";
import ProjectProgressTabs from "../../../../../app/components/NextDeal/ProjectProgressTabs";
import QuoteResponses from "../../../../../app/components/NextDeal/QuoteResponse";
import QuotationAwarded from "../../../../../app/components/NextDeal/QuotationAwarded";
import { handleApiErrors, httpClient, setApiContext } from "../../../../../util/Api";
import { ResponsesProvider, useResponse } from "../../../../../contexts/responses";

const NewQuoteResponse = (props) => {
  const { projectsList } = props;
  const { createResponses } = useResponse();
  const router = useRouter();
  const projectId = router.query.id;
  const onSave = (values) => {
    createResponses(projectId, values, (data) => {
      successNotification("app.registration.detailsSaveSuccessMessage");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };
  const ProjectDetails = () => {
    return (
      <Widget>
        <div className="gx-media gx-featured-item">
          <div className="gx-featured-thumb">
            <Avatar
              className="gx-rounded-lg gx-size-100"
              alt={'Hello'}
              style={{color: '#f56a00', backgroundColor: '#fde3cf', fontSize: '2rem'}}
            >{getAvatar('Hello')}</Avatar>
          </div>
          <div className="gx-media-body gx-featured-content">
            <div className="gx-featured-content-left">
              <h3 className="gx-mb-2">{'Hello'}</h3>
              <p className="gx-text-grey gx-mb-1">{'Hello'}</p>
            </div>
            <div className="gx-featured-content-right">
              <div>
                <h2 className="gx-text-primary gx-mb-1 gx-font-weight-medium">
                  {formatAmount(`${200000}`)}
                </h2>
                <p className="gx-text-grey gx-fs-sm gx-text-uppercase">{'CF'}</p>
              </div>
            </div>
          </div>
        </div>
      </Widget>
    );
  };

  const InProgressForms = () => {
    return (<>
      {
        projectsList.map(item => (<QuoteResponses formData={item} key={item.id} onSave={onSave} />))
      }
    </>)
  }
  const AwardedForms = () =>{
    return(<QuotationAwarded formData={{}} />)
  }

  const projectDetailsTabs = {
    defaultActiveKey: "1",
    tabs: [
      { key: "1", title: "In Progress", badgeCount: projectsList.length, tabContentComponent: <InProgressForms /> },
      { key: "2", title: "Awarded", badgeCount: "5", tabContentComponent: <AwardedForms /> },
      { key: "3", title: "Completed", badgeCount: "1", tabContentComponent: "" },
    ]
  }
  return (
    <div className="quotations">
      <div className="quotations-header">
        <div className="project-details">{ProjectDetails()}
          <ProjectProgressTabs tabsConfig={projectDetailsTabs} />
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
  let ResponsesList = []
  let projectsList = null;
  try {

    const headers = setApiContext(req, res, query);
    const promises = [
    await httpClient.get(`quotations/${query.quote}/suppliers`, {
      headers,
    }),
      await httpClient.get(`quotations/${query.quote}/responses`, {
        headers,
      })
    ]
    await Promise.all(promises).then(
      ([assignedForResponsesData, responsesListData]) => {
        AssignedForResponses = assignedForResponsesData.data.data;
        ResponsesList = responsesListData.data.data.rows;
      }
    );

    console.log({AssignedForResponses:AssignedForResponses, ResponsesList: ResponsesList})
  } catch (error) {
    handleApiErrors(req, res, query, error);
  }
  return {
    props: {
      projectsList: AssignedForResponses,
    },
  };
}

const QuoteResponse = (props) => (
  <ResponsesProvider>
    <NewQuoteResponse {...props} />
  </ResponsesProvider>
)
export default QuoteResponse;

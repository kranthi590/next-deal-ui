import React from "react";
import { Avatar } from "antd";
import Widget from "../../../../../app/components/Widget";
import {formatAmount, getAvatar} from "../../../../../util/util";
import ProjectProgressTabs from "../../../../../app/components/NextDeal/ProjectProgressTabs";
import QuoteResponses from "../../../../../app/components/NextDeal/QuoteResponse";

const QuoteResponse = (props) => {
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

  const projectDetailsTabs = {
    defaultActiveKey: "1",
    tabs: [
      { key: "1", title: "In Process", badgeCount: "10", tabContentComponent: <QuoteResponses /> },
      { key: "2", title: "Awarded", badgeCount: "5", tabContentComponent: "" },
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

export default QuoteResponse;

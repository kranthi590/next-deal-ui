import React from "react";
import {Button} from "antd";
import {getDateInMilliseconds} from "../../../util/util";

const CardsListItem=({styleName, data})=> {
  const {createdAt, expectedEndDate, costCenter, name, managerName} = data;
  return (
    <div className={`gx-user-list ${styleName}`}>
      <img alt="..." src={`https://ui-avatars.com/api/?name=${
        (name) || "Next Deal"
      }&format=svg`} className="gx-avatar-img gx-border-0"/>
      <div className="gx-description">
        <div className="gx-flex-row">
          <h4>{name}</h4>
          <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
          <span>{costCenter}</span>
        </div>
        <p className="gx-text-grey gx-mb-2">{managerName}</p>
        <p>
          <span className="gx-mr-3 gx-d-inline-block">Created Date: {getDateInMilliseconds(createdAt)}</span>
          <span className="gx-mr-3 gx-d-inline-block">Expected End Date: {getDateInMilliseconds(expectedEndDate)}</span>
        </p>
      </div>
      <div className="gx-card-list-footer">

      </div>
    </div>
  );
};

export default CardsListItem;

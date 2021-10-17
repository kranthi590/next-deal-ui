import React from "react";
import {Button} from "antd";

const CardsListItem=({styleName, data})=> {
  const {avatar, rate, earning, position, name, description} = data;
  return (
    <div className={`gx-user-list ${styleName}`}>
      <img alt="..." src={avatar} className="gx-avatar-img gx-border-0"/>
      <div className="gx-description">
        <div className="gx-flex-row">
          <h4>{name}</h4>
          <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
          <span>{position}</span>
        </div>
        <p className="gx-text-grey gx-mb-2">{description}</p>
        <p>
          <span className="gx-mr-3 gx-d-inline-block">${rate}/<span className="gx-text-grey">hr</span></span>
          <span className="gx-mr-3 gx-d-inline-block">${earning}K <span className="gx-text-grey">earned</span></span>
        </p>
      </div>
      <div className="gx-card-list-footer">

      </div>
    </div>
  );
};

export default CardsListItem;

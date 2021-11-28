import Link from 'next/link';
import React from "react";
import {Badge, Avatar} from "antd";
import {getAvatar} from "../../../util/util";

const CardsListItem = ({styleName, data}) => {
  const {status, costCenter, name, managerName, quotationsCount, id} = data;
  return (
    <Badge.Ribbon text={status} color="cyan" placement="start" style={{top: 0}}>
      <div className={`gx-user-list ${styleName}`}>
        <Avatar
          className={`gx-mr-2`}
          size={40}
          style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
          {getAvatar(name || 'Next Deal')}
        </Avatar>
        <div className="gx-description">
          <div className="gx-flex-row">
            <h4><Link href={'/projects/' + [id]} as={'/projects/' + id}>{name}</Link></h4>
            <span className="gx-d-inline-block gx-toolbar-separator">&nbsp;</span>
            <span>{costCenter}</span>
          </div>
          <p className="gx-text-grey gx-mb-2">{managerName}</p>
          <div className="gx-media gx-align-items-left gx-flex-nowrap">
            <div className="gx-mr-2 gx-mr-xxl-3">
              <i className="icon icon-diamond gx-fs-icon-lg"/></div>
            <div className="gx-media-body">
              <h1
                className="gx-fs-xxl gx-font-weight-semi-bold gx-mb-1 gx-text-orange">{quotationsCount}</h1><p
              className="gx-mb-0">Quotation {`${quotationsCount > 10 ? 's' : ''}`}</p></div>
          </div>
        </div>
        <div className="gx-card-list-footer">
          <div className="gx-featured-content-right"><p
            className="gx-text-primary gx-text-truncate gx-mt-auto gx-mb-0 gx-pointer">
            <Link href={'/projects/' + [id]} as={'/projects/' + id}>
              Check in detail
            </Link>
            <i
  className="icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle"/>
          </p>
          </div>
        </div>
      </div>
    </Badge.Ribbon>
  );
};

export default CardsListItem;

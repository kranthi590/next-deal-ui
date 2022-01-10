import React from 'react';
import { Col, Row, Skeleton } from 'antd';

// Components
import ContainerHeader from '../../../app/components/ContainerHeader';
import CardsListItem from './CardsListItem';

// Utils
import IntlMessages from '../../../util/IntlMessages';

function CardList({ projects, loader }) {
  return (
    <div className="gx-module-list gx-mail-list">
      <Col span={24}>
        <ContainerHeader title={<IntlMessages id="sidebar.listType.cardListView" />} />
      </Col>
      <Col span={24}>
        {loader &&
          Array(10)
            .fill(1)
            .map((x, i) => (
              <Skeleton key={i} className="gx-mb-4" avatar active paragraph={{ rows: 2 }} />
            ))}
        {!loader &&
          projects &&
          projects.map((data, index) => (
            <CardsListItem key={index} data={data} styleName="gx-card-list" />
          ))}
      </Col>
    </div>
  );
}

export default CardList;

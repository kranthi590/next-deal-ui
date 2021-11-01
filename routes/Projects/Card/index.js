import React from "react";
import {Col, Row} from "antd";

// Components
import ContainerHeader from "../../../app/components/ContainerHeader";
import CardsListItem from "./CardsListItem";

// Utils
import IntlMessages from "../../../util/IntlMessages";

// Data
import { cardsList } from "./data";

function CardList({projects}) {
  return (
    <div className="gx-module-list gx-mail-list">
      <Row>
        <Col span={24}>
          <ContainerHeader
            title={<IntlMessages id="sidebar.listType.cardListView" />}
          />
        </Col>
        <Col span={24}>
          {projects && projects.map((data, index) => (
            <CardsListItem key={index} data={data} styleName="gx-card-list"/>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default CardList;

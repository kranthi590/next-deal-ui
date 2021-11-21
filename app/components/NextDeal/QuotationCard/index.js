import React, {useState} from "react";
import {Button, Col, Form, Input, Row} from "antd";
import Widget from "../../Widget";
import Link from "next/link";
import QuotationDrawer from "../QuotationDrawer";

const QuotationCard = () => {

  const [isCustomizerOpened, setIsCustomizerOpened] = useState(false);

  const toggleCustomizer = () => {
    setIsCustomizerOpened(!isCustomizerOpened);
  };

  return (
    <>
      <Widget styleName={`gx-card-full gx-px-3`}>
        <h2 className="h3 gx-mb-2 gx-pt-2 gx-show-hand" onClick={toggleCustomizer}>Interlocking bricks house construction</h2>
        <div className="gx-currentplan-row gx-card-full">
          <div className="gx-currentplan-col"><h2
            className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">19<sub
            className="gx-fs-md gx-bottom-0">/Responses</sub></h2>
            <p className="gx-mb-1">
              <span className="gx-size-8 gx-bg-dark gx-rounded-xs gx-d-inline-block gx-mr-1"/> Lorem ipsum - 10
            </p>
            <p>
              <span className="gx-size-8 gx-bg-dark gx-rounded-xs gx-d-inline-block gx-mr-1"/> Lorem ipsum - 10
            </p>
          </div>
          <div className="gx-currentplan-col gx-currentplan-right">
            <h2 className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">18<sub
              className="gx-fs-md gx-bottom-0">/Suppliers</sub></h2>
            <div className="gx-currentplan-right-content">
            <span className="gx-text-primary gx-fs-md gx-pointer gx-mts-3 gx-oth-plans-down">Other plans <i
              className="icon icon-long-arrow-right gx-fs-xxl gx-ml-2 gx-d-inline-flex gx-vertical-align-middle"/></span>
            </div>
          </div>
        </div>
      </Widget>
      <QuotationDrawer isCustomizerOpened={isCustomizerOpened} onClose={toggleCustomizer}/>
    </>
  );
};

export default QuotationCard;

import { Row, Col } from 'antd';
import React from 'react';
import IntlMessages from '../../../../util/IntlMessages';
import Widget from '../../Widget';
const SupplierCategories = ({ categories = [], onClick }) => {
  return (
    <div>
      <Row gutter={16}>
        {categories &&
          categories.map(category => {
            return (
              <Col xl={8} lg={8} md={8} sm={12} xs={24} key={category.id}>
                <Widget styleName="gx-card-full gx-dot-arrow-hover gx-py-2">
                  <div className="gx-media gx-align-items-center gx-flex-nowrap">
                    <div
                      className="gx-px-3 gx-build-box-lay gx-d-flex gx-justify-content-center gx-align-items-center"
                      style={{ width: '15px' }}
                    ></div>
                    <div className="gx-media-body gx-py-3 gx-pr-4 gx-build-box-lay-content">
                      <h2 className="h3 gx-mb-0">{category.name}</h2>
                      <div className="gx-mb-0 gx-text-grey gx-fs-sm suppliersContainer gx-fs-lg">
                        <h2 className="gx-fs-xl gx-font-weight-medium gx-text-primary gx-mb-0 suppliersCountLabel">
                          {category.suppliersCount}/
                        </h2>
                        <IntlMessages id="app.quotation.suppliers" />
                      </div>
                      <div
                        className="gx-dot-arrow"
                        onClick={() => {
                          if (onClick) {
                            onClick(category);
                          }
                        }}
                      >
                        <div className="gx-bg-primary gx-hover-arrow">
                          <i className="icon icon-long-arrow-right gx-text-white" />
                        </div>
                        <div className="gx-dot">
                          <i className="icon icon-ellipse-v gx-text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Widget>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default SupplierCategories;

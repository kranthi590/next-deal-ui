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
                <Widget styleName={`gx-card-full gx-card-quote-border gx-mb-3`}>
                  <a
                    onClick={() => {
                      if (onClick) {
                        onClick(category);
                      }
                    }}
                  >
                    <h2 className="h3 gx-mb-2 gx-pt-2 gx-show-hand">{category.name}</h2>
                    <div className="gx-currentplan-row gx-card-full">
                      <div className="gx-currentplan-col">
                        <h2 className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">
                          {category.suppliersCount}
                          <sub className="gx-fs-md gx-bottom-0">
                            /<IntlMessages id="app.quotation.suppliers" />
                          </sub>
                        </h2>
                      </div>
                    </div>
                  </a>
                </Widget>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default SupplierCategories;

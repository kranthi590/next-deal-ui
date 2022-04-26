import { Row, Col } from 'antd';
import React from 'react';
const SupplierCategories = ({ categories = [], onClick }) => {
  return (
    <div>
      <Row gutter={16}>
        {categories &&
          categories.map(category => {
            return (
              <Col xl={8} lg={8} md={8} sm={12} xs={24} key={category.id}>
                <a
                  onClick={() => {
                    if (onClick) {
                      onClick(category);
                    }
                  }}
                >
                  <div className="ant-card ant-card-bordered gx-card-widget gx-w-100">
                    <div className="ant-card-body">
                      <div className="gx-media gx-align-items-center gx-flex-nowrap">
                        <div className="gx-media-body gx-text-center">
                          <h1 className="gx-fs-xxxl gx-font-weight-medium gx-mb-1">12</h1>
                          <div className="gx-text-grey gx-text-truncate gx-mb-0">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default SupplierCategories;

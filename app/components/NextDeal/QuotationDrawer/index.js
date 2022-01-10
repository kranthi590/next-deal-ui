import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Radio, Switch } from 'antd';
import CustomScrollbars from '../../../../util/CustomScrollbars';

const QuotationDrawer = props => {
  /*
  useEffect(() => {

  }, [])
*/

  const toggleCustomizer = () => {
    props.onClose();
  };

  const getCustomizerContent = () => {
    return (
      <CustomScrollbars className="gx-customizer">
        <div className="gx-customizer-item gx-mt-4">
          <h2 className="gx-mb-3">Interlocking bricks house construction</h2>
        </div>
        <div className="gx-customizer-item">
          <div className="gx-fs-lg gx-text-capitalize gx-mb-2">
            Suppliers assigned to the quotation
          </div>
          <h2 className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">
            18<sub className="gx-fs-md gx-bottom-0">/Suppliers</sub>
          </h2>
        </div>
        <div className="gx-customizer-item">
          <div className="gx-fs-lg gx-text-capitalize gx-mb-2">
            Responses received to the quotation
          </div>
          <h2 className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">
            09<sub className="gx-fs-md gx-bottom-0">/Responses</sub>
          </h2>
        </div>
      </CustomScrollbars>
    );
  };

  return (
    <>
      <Drawer
        title="Quotation Snapshot"
        placement="right"
        closeIcon={<i className="icon icon-close-circle gx-fs-xl" />}
        onClose={toggleCustomizer}
        visible={props.isCustomizerOpened}
      >
        {getCustomizerContent()}
      </Drawer>
    </>
  );
};

export default QuotationDrawer;

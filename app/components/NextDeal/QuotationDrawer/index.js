import React, {useEffect, useState} from "react";
import {Button, Drawer, Form, Radio, Switch} from "antd";
import CustomScrollbars from "../../../../util/CustomScrollbars";

const QuotationDrawer = (props) => {


/*
  useEffect(() => {

  }, [])
*/

  const toggleCustomizer = () => {
    props.onClose()
  }

  const getCustomizerContent = () => {
    return <CustomScrollbars className="gx-customizer">
      <div className="gx-customizer-item gx-mt-4">
        <h1>Placeholder for quotation overview</h1>
      </div>
    </CustomScrollbars>
  };

  return (
    <>
      <Drawer
        title="Quotation Snapshot"
        placement="right"
        closeIcon={<i className="icon icon-close-circle gx-fs-xl" />}
        onClose={toggleCustomizer}
        visible={props.isCustomizerOpened}>
        {
          getCustomizerContent()
        }
      </Drawer>
    </>
  );
};

export default QuotationDrawer;

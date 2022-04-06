import React, { useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Card, Divider, InputNumber, Select } from 'antd';
import moment from 'moment';
import IntlMessages from '../../../../util/IntlMessages';
import ClpFormatter from '../../../../shared/CLP';
import { clpToNumber, numberToClp } from '../../../../util/util';
import FilesManager from '../../../common/FileManager';
import { CURRENCY } from '../../../../util/appConstants';
import { useIntl } from 'react-intl';

const QuotationCompleted = props => {
  const { onSave } = props;
  const {
    id,
    netWorth,
    currency,
    purchaseOrderNumber,
    paymentCondition,
    includesTax,
    incoterm,
    deliveryDate,
    validityDate,
    supplier,
    comments,
    files = [],
  } = props.formData;

  const [cdeliveryDate, setCDeliveryDate] = useState(null);
  const [cvalidityDate, setCValidityDate] = useState(null);
  const [netValue, setNetValue] = useState(netWorth || null);

  const [form] = Form.useForm();
  const intl = useIntl();
  const initialFormData = {
    netWorth: numberToClp(netWorth),
    currency: currency,
    purchaseOrderNumber: purchaseOrderNumber,
    paymentCondition: paymentCondition,
    deliveryDate: moment(deliveryDate),
    comments: comments,
  };
  const deliveryDateChangeHandler = date => {
    setCDeliveryDate(moment(date).valueOf());
  };
  const validityDateChangeHandler = date => {
    setCValidityDate(moment(date).valueOf());
  };
  const onFinishFailed = errorInfo => {};
  const getFormData = data => {
    const formData = Object.keys(data).reduce((acc, key) => {
      if (data[key] && key === 'deliveryDate') {
        acc = { ...acc, deliveryDate: cdeliveryDate };
      } else if (data[key] && key === 'validityDate') {
        acc = { ...acc, validityDate: cvalidityDate };
      } else if (data[key] && key === 'netWorth') {
        acc = { ...acc, netWorth: clpToNumber(netValue) };
      } else if (data[key]) {
        acc = { ...acc, [key]: data[key] };
      }
      return acc;
    }, {});

    return formData;
  };
  const onFinish = values => {
    // on finish
    onSave({ purchaseOrderNumber: values.purchaseOrderNumber }, id);
  };
  const onNetValueChange = async value => {
    setNetValue(value);
  };

  return (
    <Card title={supplier.fantasyName} className="ant-card-bordered gx-card-widget">
      <Divider />
      <Form
        form={form}
        initialValues={initialFormData}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        name="quoteResponseForm"
        className="gx-progress-form"
      >
        <Row gutter={2}>
          <Col xl={6} xs={24}>
            <Form.Item
              name="netWorth"
              label={<IntlMessages id="app.quotationresponses.field.netWorth" />}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.quotationresponses.field.netWorth.error.required" />
                  ),
                },
              ]}
            >
              <ClpFormatter
                className="gx-w-100"
                value={netValue}
                onChange={onNetValueChange}
                placeholder="1.00.00"
                disabled
              />
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              label={<IntlMessages id="app.project.field.currency" />}
              name="currency"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder={intl.formatMessage({ id: 'app.project.field.currency' })}
                disabled
                showSearch
                filterOption={(input, option) => {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                {Object.keys(CURRENCY).map(item => (
                  <Option key={item} value={CURRENCY[item].toLowerCase()}>
                    {CURRENCY[item]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              name="deliveryDate"
              label={<IntlMessages id="app.quotationresponses.field.deliveryDate" />}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.quotationresponses.field.deliveryDate.error.required" />
                  ),
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({
                  id: 'app.quotationresponses.field.deliveryDate',
                })}
                disabled
                onChange={deliveryDateChangeHandler}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              name="purchaseOrderNumber"
              label={<IntlMessages id="app.quotationresponses.field.purchaseOrderNumber" />}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.quotationresponses.field.purchaseOrderNumber.error.required" />
                  ),
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.quotationresponses.field.purchaseOrderNumber',
                })}
                disabled
              />
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              name="paymentCondition"
              label={<IntlMessages id="app.quotationresponses.field.paymentCondition" />}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.quotationresponses.field.paymentCondition.error.required" />
                  ),
                },
              ]}
            >
              <Select
                allowClear
                placeholder={intl.formatMessage({
                  id: 'app.quotationresponses.field.paymentCondition',
                })}
                disabled
                showSearch
                filterOption={(input, option) => {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
              >
                <Option value="al-contado">al contado</Option>
                <Option value="7">7 días</Option>
                <Option value="15">15 días</Option>
                <Option value="30">30 días</Option>
                <Option value="45">45 días</Option>
                <Option value="60">60 días</Option>
                <Option value="90">90 días</Option>
                <Option value="otro">otro</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              name="comments"
              label={<IntlMessages id="app.quotationresponses.field.description" />}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.TextArea
                placeholder={intl.formatMessage({ id: 'app.quotationresponses.field.description' })}
                disabled
              ></Input.TextArea>
            </Form.Item>
          </Col>
          {/* <Col xl={6} xs={24}>
                    <Form.Item
                        name="purchaseOrderNumber"
                        label="Purchase Order Number"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Input placeholder="Number Of Purchase Order" />
                    </Form.Item>
                </Col> */}
        </Row>
        <Row gutter={2}>
          <Col xl={24} xs={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{
                height: '130px',
                overflowX: 'auto',
              }}
            >
              <FilesManager
                files={files}
                context={{
                  assetRelation: 'quotation_response',
                  assetRelationId: id,
                }}
                hideButton={true}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default QuotationCompleted;

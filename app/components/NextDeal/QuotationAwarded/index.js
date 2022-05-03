import React, { useState } from 'react';
import { Button, Row, Col, Form, Input, DatePicker, Card, Divider, Select, Tooltip } from 'antd';
import { QuestionCircleOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import moment from 'moment';
import IntlMessages from '../../../../util/IntlMessages';
import { clpToNumber, numberToClp } from '../../../../util/util';
import ClpFormatter from '../../../../shared/CLP';
import FilesManager from '../../../common/FileManager';
import { CURRENCY } from '../../../../util/appConstants';
import { useIntl } from 'react-intl';

const QuoteAwarded = props => {
  const { onSave, completed, onDeaward, onUpdateData } = props;
  const {
    id,
    netWorth,
    currency,
    paymentCondition,
    purchaseOrderNumber,
    deliveryDate,
    supplier,
    comments,
    files = [],
  } = props.formData;
  const [cdeliveryDate, setCDeliveryDate] = useState(moment(deliveryDate).valueOf());
  const [cvalidityDate, setCValidityDate] = useState(null);
  const [netValue, setNetValue] = useState(netWorth || null);
  const intl = useIntl();
  const [form] = Form.useForm();
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
    onSave(
      {
        purchaseOrderNumber: values.purchaseOrderNumber,
        comments: values.comments,
        deliveryDate: cdeliveryDate,
      },
      id,
    );
  };
  const onNetValueChange = async value => {
    setNetValue(value);
  };

  const onUpdateSave = async () => {
    try {
      const values = await form.validateFields();
      if (onUpdateData) {
        onUpdateData(
          {
            purchaseOrderNumber: values.purchaseOrderNumber ? values.purchaseOrderNumber : null,
            comments: values.comments ? values.comments : null,
            deliveryDate: cdeliveryDate,
          },
          id,
        );
      }
    } catch (errorInfo) {
      return;
    }
  };

  return (
    <Card title={supplier.legalName} className="ant-card-bordered gx-card-widget">
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
                  required: false,
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
                disabled={completed}
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
                <Option value="7-dias">7 días</Option>
                <Option value="15-dias">15 días</Option>
                <Option value="30-dias">30 días</Option>
                <Option value="45-dias">45 días</Option>
                <Option value="60-dias">60 días</Option>
                <Option value="90-dias">90 días</Option>
                <Option value="otro">otro</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              name="comments"
              label={
                <span>
                  <IntlMessages id="app.quotationresponses.field.description" />
                  &nbsp;
                  <Tooltip
                    title={<IntlMessages id="app.quotationresponses.field.description.info" />}
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input.TextArea
                placeholder={intl.formatMessage({ id: 'app.quotationresponses.field.description' })}
                disabled={completed}
              ></Input.TextArea>
            </Form.Item>
          </Col>
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
                hideButton={completed}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={2} className="gx-mt-4">
          {!completed && (
            <Col
              xl={18}
              xs={24}
              className="gx-d-flex gx-justify-content-start gx-align-items-start"
            >
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  className="gx-mb-0"
                  onClick={onUpdateSave}
                >
                  <span>
                    <IntlMessages id="app.quotationresponses.button.save" />
                  </span>
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  className="gx-mb-0"
                >
                  <span>
                    <IntlMessages id="app.quotationresponses.button.confirm" />
                  </span>
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  icon={<UndoOutlined />}
                  className="gx-mb-0"
                  onClick={onDeaward}
                >
                  <span>
                    <IntlMessages id="app.quotationresponses.button.deaward" />
                  </span>
                </Button>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Card>
  );
};

export default QuoteAwarded;

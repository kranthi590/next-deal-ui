import React, { useState } from 'react';
import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Select,
  DatePicker,
  Card,
  Divider,
  Tooltip,
} from 'antd';
import { SaveOutlined, QuestionCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import IntlMessages from '../../../../util/IntlMessages';
import ClpFormatter from '../../../../shared/CLP';
import { clpToNumber, numberToClp } from '../../../../util/util';
import FilesManager from '../../../common/FileManager';
import { CURRENCY } from '../../../../util/appConstants';
import { useIntl } from 'react-intl';

const QuoteResponses = props => {
  const { onSave, awarded, onDeleteResponse } = props;
  const {
    id,
    fantasyName,
    newQuote,
    netWorth,
    paymentCondition,
    includesTax,
    incoterm,
    currency,
    deliveryDate,
    validityDate,
    supplier,
    comments,
    files = [],
  } = props.formData;
  const [cdeliveryDate, setCDeliveryDate] = useState(moment(deliveryDate).valueOf());
  const [cvalidityDate, setCValidityDate] = useState(moment(validityDate).valueOf());
  const [filesList, setFiles] = useState(files);
  const intl = useIntl();

  const [netValue, setNetValue] = useState(netWorth);
  let initialFormData = {};
  if (newQuote !== true) {
    initialFormData = {
      netWorth: numberToClp(netWorth),
      currency: currency,
      paymentCondition: paymentCondition,
      includesTax: includesTax,
      incoterm: incoterm,
      deliveryDate: moment(deliveryDate),
      validityDate: moment(validityDate),
      comments: comments,
    };
  } else {
    initialFormData = {
      netWorth: null,
      currency: null,
      includesTax: false,
      paymentCondition: null,
      incoterm: 'NO-APLICA',
      deliveryDate: null,
      validityDate: null,
      comments: null,
    };
  }

  const [form] = Form.useForm();
  const { Option } = Select;

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
        acc = { ...acc, netWorth: clpToNumber(data[key]) };
      } else if (data[key]) {
        acc = { ...acc, [key]: data[key] };
      }
      return acc;
    }, {});

    return formData;
  };
  const onFinish = values => {
    const formValues = getFormData(values);
    onSave({
      ...formValues,
      supplierId: id,
      includesTax: formValues.includesTax ? true : false,
      files: newQuote ? filesList : [],
    });
  };

  const awardQuote = () => {
    const formData = form.getFieldsValue();
    onSave({ comments: formData.comments }, id);
  };

  const onNetValueChange = async value => {
    setNetValue(value);
  };

  const stringRule = {
    required: true,
    message: <IntlMessages id="app.project.create.validations" />,
  };
  return (
    <Card
      title={fantasyName ? fantasyName : supplier.fantasyName}
      className="ant-card-bordered gx-card-widget"
    >
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
              className="gx-grp-input"
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
                value={netValue}
                onChange={onNetValueChange}
                placeholder="1.00.00"
                disabled={awarded || !newQuote}
                addonAfter={
                  <Form.Item name="includesTax" valuePropName="checked" className="gx-mb-0">
                    <Checkbox disabled={awarded || !newQuote}>
                      <IntlMessages id="app.quotationresponses.field.includesTax" />
                    </Checkbox>
                  </Form.Item>
                }
              />
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              label={<IntlMessages id="app.project.field.currency" />}
              name="currency"
              rules={[stringRule]}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                placeholder={intl.formatMessage({ id: 'app.project.field.currency' })}
                disabled={awarded || !newQuote}
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
              label={<IntlMessages id="app.quotationresponses.field.deliveryDate" />}
              name="deliveryDate"
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
                  id: 'app.quotationresponses.field.deliveryDateWithPO',
                })}
                disabled={awarded || !newQuote}
                onChange={deliveryDateChangeHandler}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xl={6} xs={24}>
            <Form.Item
              label={<IntlMessages id="app.quotationresponses.field.validityDate" />}
              name="validityDate"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.quotationresponses.field.validityDate.error.required" />
                  ),
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({
                  id: 'app.quotationresponses.field.validityDate',
                })}
                disabled={awarded || !newQuote}
                onChange={validityDateChangeHandler}
                format="DD/MM/YYYY"
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
                disabled={awarded || !newQuote}
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
              name="incoterm"
              label={<IntlMessages id="app.quotationresponses.field.incoterm" />}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.quotationresponses.field.incoterm.error.required" />
                  ),
                },
              ]}
            >
              <Select
                allowClear
                placeholder={intl.formatMessage({ id: 'app.quotationresponses.field.incoterm' })}
                disabled={awarded || !newQuote}
              >
                <Option value="NO_APLICA">No Aplica</Option>
                <Option value="EXW">EXW</Option>
                <Option value="FCA">FCA</Option>
                <Option value="FAS">FAS</Option>
                <Option value="FOB">FOB</Option>
                <Option value="CFR">CFR</Option>
                <Option value="CIF">CIF</Option>
                <Option value="CPT">CPT</Option>
                <Option value="CIP">CIP</Option>
                <Option value="DAP">DAP</Option>
                <Option value="DPU">DPU</Option>
                <Option value="DDP">DDP</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xl={8} xs={24}>
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
                disabled={awarded}
              ></Input.TextArea>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            xl={124}
            xs={24}
            style={{
              height: '130px',
              overflowX: 'auto',
            }}
          >
            {newQuote ? (
              <FilesManager
                files={filesList}
                hideButton={awarded}
                context={{
                  assetRelation: 'quotation_response',
                  //  assetRelationId: quotationData.id
                }}
                customSubmitHandler={({ fileList }) => {
                  setFiles(fileList);
                }}
              />
            ) : (
              <FilesManager
                files={filesList}
                context={{
                  assetRelation: 'quotation_response',
                  assetRelationId: id,
                }}
                hideButton={awarded}
              />
            )}
          </Col>
        </Row>
        <Row className="gx-mt-4">
          <Col xl={24} xs={24}>
            <Form.Item>
              {!awarded && (
                <>
                  {newQuote ? (
                    <></>
                  ) : (
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      className="gx-mb-0"
                      onClick={awardQuote}
                    >
                      <span>
                        <IntlMessages id="app.quotationresponses.button.award" />
                      </span>
                    </Button>
                  )}
                  {newQuote ? (
                    <>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        className="gx-mb-0"
                      >
                        <span>
                          <IntlMessages id="app.quotationresponses.button.save" />
                        </span>
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                  {!awarded && !newQuote ? (
                    <Button
                      type="primary"
                      icon={<DeleteOutlined />}
                      className="gx-mb-0"
                      onClick={() => {
                        onDeleteResponse(id);
                      }}
                    >
                      <span>
                        <IntlMessages id="button.delete" />
                      </span>
                    </Button>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default QuoteResponses;

import React, { useState } from "react";
import {
    Button, Row, Col, Form, Input, Checkbox, Select,
    DatePicker, Upload, Card, Divider, InputNumber
} from "antd";
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import moment from "moment";
import IntlMessages from "../../../../util/IntlMessages";

const QuoteResponses = (props) => {
    const { onSave, awarded,onAbort } = props;
    const { id, fantasyName, newQuote, netWorth, paymentCondition, includesTax, incoterm, deliveryDate, validityDate, supplier, comments } = props.formData;
    const [cdeliveryDate, setCDeliveryDate] = useState(null);
    const [cvalidityDate, setCValidityDate] = useState(null);

    let initialFormData = {};
    if (newQuote !== true) {
        initialFormData = {
            netWorth: netWorth,
            paymentCondition: paymentCondition,
            includesTax: includesTax,
            incoterm: incoterm,
            deliveryDate: moment(deliveryDate),
            validityDate: moment(validityDate),
            comments: comments
        }
    } else {
        initialFormData = {
            netWorth: null,
            includesTax: false,
            paymentCondition: null,
            incoterm: "NO_APLICA",
            deliveryDate: null,
            validityDate: null,
            comments: null
        }
    }

    const [form] = Form.useForm();
    const { Option } = Select;

    const deliveryDateChangeHandler = (date) => {
        setCDeliveryDate(moment(date).valueOf());
    };
    const validityDateChangeHandler = (date) => {
        setCValidityDate(moment(date).valueOf());
    };
    const onFinishFailed = (errorInfo) => {
    };
    const getFormData = (data) => {
        const formData = Object.keys(data).reduce((acc, key) => {
            if (data[key] && key === "deliveryDate") {
                acc = { ...acc, deliveryDate: cdeliveryDate };
            } else if (data[key] && key === "validityDate") {
                acc = { ...acc, validityDate: cvalidityDate };
            } else if (data[key]) {
                acc = { ...acc, [key]: data[key] };
            }
            return acc;
        }, {});

        return formData;
    };
    const onFinish = (values) => {
        if (newQuote !== true) {
            onSave(null, id);
        } else {
            const formValues = getFormData(values);
            onSave({ ...formValues, supplierId: id, currency: "clp", includesTax: formValues.includesTax ? true : false },);
        }
    };

  const disabledStartDate = (value) => {
    return moment().add(-1, 'days')  >= value;
  }

  const disabledEndDate = (value) =>{
    const formData = form;
    return value < formData.getFieldValue('deliveryDate') || moment() >= value;
  };

    return (<Card title={fantasyName ? fantasyName : supplier.fantasyName} className="ant-card-bordered gx-card-widget">
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
                                message: <IntlMessages id="app.quotationresponses.field.netWorth.error.required" />,
                            },
                        ]}>
                        <InputNumber
                            className="gx-w-100"
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            placeholder="Net Worth"
                            disabled={awarded}
                        />
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
                                message: <IntlMessages id="app.quotationresponses.field.deliveryDate.error.required" />,
                            },
                        ]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Delivery Date(With a purchase order confirm)"
                            disabled={awarded}
                            onChange={deliveryDateChangeHandler}
                            disabledDate={disabledStartDate}
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
                                message: <IntlMessages id="app.quotationresponses.field.validityDate.error.required" />,
                            },
                        ]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Validity Date"
                            disabled={awarded}
                            onChange={validityDateChangeHandler}
                            disabledDate={disabledEndDate}
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
                                message: <IntlMessages id="app.quotationresponses.field.paymentCondition.error.required" />,
                            },
                        ]}>
                        <Select allowClear placeholder="Payment Conditions" disabled={awarded}>
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
                        label={<IntlMessages id="app.quotationresponses.field.description" />}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Input.TextArea placeholder="Comments" disabled={awarded}></Input.TextArea>
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item name="includesTax" valuePropName="checked"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        className="gx-pt-4"
                    >
                        <Checkbox disabled={awarded}>
                            <IntlMessages id="app.quotationresponses.field.includesTax" />
                        </Checkbox>
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
                                message: <IntlMessages id="app.quotationresponses.field.incoterm.error.required" />,
                            },
                        ]}>
                        <Select allowClear placeholder="Incoterm" disabled={awarded}>
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
                {
                    !awarded && (
                        <Col xl={6} xs={24} className="gx-d-flex gx-justify-content-end gx-align-items-end">
                            {!newQuote&&(<Form.Item wrapperCol={{ span: 24 }}>
                                <Button type="primary" icon={<CloseOutlined />} className="gx-mb-0" onClick={onAbort}>
                                    <span><IntlMessages id="app.quotationresponses.button.abort" /></span>
                                </Button>
                            </Form.Item>)}
                            <Form.Item wrapperCol={{ span: 24 }}>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className="gx-mb-0">
                                    <span>
                                    {
                                        newQuote ?
                                        <IntlMessages id="app.quotationresponses.button.save" />
                                        :
                                        <IntlMessages id="app.quotationresponses.button.award" />
                                    }
                                    </span>
                                </Button>
                            </Form.Item>
                        </Col>
                    )
                }
            </Row>
        </Form>
    </Card>)
}

export default QuoteResponses;

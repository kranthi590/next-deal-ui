import React, { useState } from "react";
import {
    Button, Row, Col, Form, Input, Checkbox, Select,
    DatePicker, Upload, Card, Divider, InputNumber
} from "antd";
import { SaveOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import "./index.css"
import { getDateInMilliseconds } from "../../../../util/util";
import moment from "moment";

const QuoteResponses = (props) => {
    const { onSave, awarded } = props;
    const { id, fantasyName, newQuote, netWorth, paymentCondition, includesTax, incoterm, deliveryDate, validityDate, supplier, additionalData } = props.formData;

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
            description: additionalData
        }
    } else {
        initialFormData = {
            netWorth: null,
            includesTax: false,
            paymentCondition: null,
            incoterm: null,
            deliveryDate: null,
            validityDate: null,
            description: null
        }
    }

    const [form] = Form.useForm();
    const { Option } = Select;

    const deliveryDateChangeHandler = (date) => {
        setCDeliveryDate(moment(date).valueOf());
        // setDeliveryDate(getDateInMilliseconds(date));
    };
    const validityDateChangeHandler = (date) => {
        setCValidityDate(moment(date).valueOf());
        // setValidityDate(getDateInMilliseconds(date));
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
        // on finish
        if (newQuote !== true) {
            onSave(null, id);
        } else {
            const formValues = getFormData(values);
            onSave({ ...formValues, supplierId: id, currency: "clp", includesTax: formValues.includesTax ? true : false },);
        }
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
                        label="Net Worth"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
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
                        name="incoterm"
                        label="Incoterm"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Select allowClear placeholder="Incoterm" disabled={awarded}>
                            <Option value="term1">Term 1</Option>
                            <Option value="term2">Term 2</Option>
                            <Option value="term3">Temrm 3</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="deliveryDate"
                        label="Delivery Date"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Delivery Date(With a purchase order confirm)"
                            disabled={awarded}
                            onChange={deliveryDateChangeHandler}
                        />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="validityDate"
                        label="Validity Date"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Validity Date"
                            disabled={awarded}
                            onChange={validityDateChangeHandler}
                        />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="paymentCondition"
                        label="Payment Conditions"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Input.TextArea placeholder="Payment Conditions" disabled={awarded}/>
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="description"
                        label="Comments"
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
                    >
                        <Checkbox disabled={awarded}>
                            Incl.IVA
                        </Checkbox>
                    </Form.Item>
                </Col>
                {
                    !awarded && (
                        <Col xl={6} xs={24} className="gx-d-flex">
                            <Form.Item wrapperCol={{ span: 24 }}>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                    {
                                        newQuote ? "Save" : "Award"
                                    }
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
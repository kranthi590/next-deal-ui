import React, { useState } from "react";
import {
    Button, Row, Col, Form, Input,
    DatePicker, Upload, Card, Divider, InputNumber
} from "antd";
import { SaveOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { getDateInMilliseconds } from "../../../../util/util";
import moment from "moment";

const QuotationCompleted = (props) => {
    const { onSave } = props;
    const { id, netWorth, paymentCondition, includesTax, incoterm, deliveryDate, validityDate, supplier, additionalData } = props.formData;

    const [cdeliveryDate, setCDeliveryDate] = useState(null);
    const [cvalidityDate, setCValidityDate] = useState(null);
    const [form] = Form.useForm();

    const initialFormData = {
        netWorth: netWorth,
        paymentCondition: paymentCondition,
        // includesTax: includesTax,
        // incoterm: incoterm,
        deliveryDate: moment(deliveryDate),
        // validityDate: moment(validityDate),
        description: additionalData
    }
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
        // on finish
        onSave({ purchaseOrderNumber: values.purchaseOrderNumber }, id);

    };

    return (<Card title={supplier.fantasyName} className="ant-card-bordered gx-card-widget">
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
                            placeholder="Amount"
                            disabled
                        />
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
                            placeholder="Delivery Date"
                            disabled
                            onChange={deliveryDateChangeHandler}
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
                        <Input.TextArea placeholder="Payment Conditions" disabled />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="description"
                        label="Comments"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Input.TextArea placeholder="Comments" disabled></Input.TextArea>
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
        </Form>
    </Card>)
}

export default QuotationCompleted;

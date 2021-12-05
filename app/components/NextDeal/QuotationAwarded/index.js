import React, { useState } from "react";
import {
    Button, Row, Col, Form, Input,
    DatePicker, Upload, Card, Divider, InputNumber
} from "antd";
import { SaveOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { getDateInMilliseconds } from "../../../../util/util";
import moment from "moment";

const QuoteAwarded = (props) => {
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
        onSave({ purchaseOrderNumber:values.purchaseOrderNumber},id);

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
            <Row>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="netWorth"
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
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Delivery Date"
                            onChange={deliveryDateChangeHandler}
                            disabled
                        />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="paymentCondition"
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Input.TextArea placeholder="Payment Conditions" disabled/>
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="description"                        
                        >
                        <Input.TextArea placeholder="Comments" disabled></Input.TextArea>
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="purchaseOrderNumber"
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Input placeholder="Number Of Purchase Order" />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Confirm Receiption</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </Card>)
}

export default QuoteAwarded;
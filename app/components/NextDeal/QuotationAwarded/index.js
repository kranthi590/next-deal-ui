import React, { useState } from "react";
import {
    Button, Row, Col, Form, Input,
    DatePicker, Card, Divider, InputNumber,Select
} from "antd";
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import moment from "moment";

const QuoteAwarded = (props) => {
    const { onSave, completed,onDeaward } = props;
    const { id, netWorth, paymentCondition, deliveryDate, supplier, additionalData } = props.formData;

    const [cdeliveryDate, setCDeliveryDate] = useState(null);
    const [cvalidityDate, setCValidityDate] = useState(null);
    const [form] = Form.useForm();

    const initialFormData = {
        netWorth: netWorth,
        paymentCondition: paymentCondition,
        deliveryDate: moment(deliveryDate),
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
                            onChange={deliveryDateChangeHandler}
                            disabled
                        />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
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
                        <Input placeholder="Number Of Purchase Order" disabled={completed} />
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
                        <Select allowClear placeholder="Payment Conditions" disabled>
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
                        name="description"
                        label="Comments"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Input.TextArea placeholder="Comments" disabled></Input.TextArea>
                    </Form.Item>
                </Col>
                {
                    !completed && (
                        <Col xl={18} xs={24} className="gx-d-flex gx-justify-content-end gx-align-items-end">
                            <Form.Item wrapperCol={{ span: 24 }}>
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} className="gx-mb-0">Confirm Receiption</Button>
                            </Form.Item>
                            <Form.Item wrapperCol={{ span: 24 }}>
                                <Button type="primary" icon={<UndoOutlined />} className="gx-mb-0" onClick={onDeaward}>Deaward</Button>
                            </Form.Item>
                        </Col>
                    )
                }
            </Row>
        </Form>
    </Card>)
}

export default QuoteAwarded;

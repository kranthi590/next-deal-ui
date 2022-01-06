import React, { useState } from "react";
import {
     Row, Col, Form, Input,
    DatePicker, Card, Divider, InputNumber,Select
} from "antd";
import moment from "moment";
import IntlMessages from "../../../../util/IntlMessages";

const QuotationCompleted = (props) => {
    const { onSave } = props;
    const { id, netWorth, paymentCondition, includesTax, incoterm, deliveryDate, validityDate, supplier, comments } = props.formData;

    const [cdeliveryDate, setCDeliveryDate] = useState(null);
    const [cvalidityDate, setCValidityDate] = useState(null);
    const [form] = Form.useForm();

    const initialFormData = {
        netWorth: netWorth,
        paymentCondition: paymentCondition,
        deliveryDate: moment(deliveryDate),
        comments: comments
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
                            placeholder="Amount"
                            disabled
                        />
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
                                message: <IntlMessages id="app.quotationresponses.field.deliveryDate.error.required" />,
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
                        label={<IntlMessages id="app.quotationresponses.field.paymentCondition" />}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessages id="app.quotationresponses.field.paymentCondition.error.required" />,
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
                        name="comments"
                        label={<IntlMessages id="app.quotationresponses.field.description" />}
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

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
    const { id, fantasyName } = props.formData;
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [validityDate, setValidityDate] = useState(null);

    const [form] = Form.useForm();

    const deliveryDateChangeHandler = (date) => {
        setDeliveryDate(moment(date).valueOf());
        // setDeliveryDate(getDateInMilliseconds(date));
    };
    const validityDateChangeHandler = (date) => {
        setValidityDate(moment(date).valueOf());
        // setValidityDate(getDateInMilliseconds(date));
    };
    const onFinishFailed = (errorInfo) => {
    };
    const getFormData = (data) => {
        const formData = Object.keys(data).reduce((acc, key) => {
            if (data[key] && key === "deliveryDate") {
                acc = { ...acc, deliveryDate };
            } else if (data[key] && key === "validityDate") {
                acc = { ...acc, validityDate };
            } else if (data[key]) {
                acc = { ...acc, [key]: data[key] };
            }
            return acc;
        }, {});

        return formData;
    };
    const onFinish = (values) => {
        // on finish
        console.log(getFormData(values))
        const formValues = getFormData(values);
        onSave({ ...formValues, supplierId: id, currency: "clp", includesTax: true },);

    };

    return (<Card title={fantasyName} className="ant-card-bordered gx-card-widget">
        <Divider />
        <Form
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            name="quoteResponseForm"
            className="gx-progress-form"
        >
            <Row>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="amount"
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
                        <Input.TextArea placeholder="Payment Conditions" />
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
                        <Input placeholder="Number Of Purchase Order" />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Input.TextArea placeholder="Observation"></Input.TextArea>
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
import React from "react";
import {
    Button, Row, Col, Form, Input, Checkbox, Select,
    DatePicker, Upload, Card, Divider
} from "antd";
import { SaveOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import "./index.css"

const QuoteResponses = (props) => {
    const [form] = Form.useForm();
    const { Option } = Select;

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (<Card title="Supplier Name" className="gx-text-center ant-card-bordered gx-card-widget">
        <Divider />
        <Form form={form} name="quoteResponseForm" className="gx-progress-form">
            <Row>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="networth"
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Input addonAfter={
                            <Checkbox >
                                Incl.IVA
                            </Checkbox>
                        }
                            placeholder="Net Worth" />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="incoterm"
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Select allowClear placeholder="Incoterm">
                            <Option value="1">Option 1</Option>
                            <Option value="2">Option 2</Option>
                            <Option value="3">Option 3</Option>
                        </Select>
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
                        <DatePicker style={{ width: '100%' }} placeholder="Delivery Date(With a purchase order confirm)" />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="validity"
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Input placeholder="Validity" />
                    </Form.Item>
                </Col>
                <Col xl={6} xs={24}>
                    <Form.Item
                        name="paymentconditions"
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
                        name="comments"
                        rules={[
                            {
                                required: true,
                                message: 'Input something!',
                            },
                        ]}>
                        <Input.TextArea placeholder="Comments"></Input.TextArea>
                    </Form.Item>
                </Col>
              <Col xl={6} xs={24}>
                <Form.Item
                  name="attachmants"
                  getValueFromEvent={normFile}
                >
                  <Upload>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
                <Col xl={6} xs={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Awarded</Button>
                        <Button type="primary" icon={<DeleteOutlined />}>Delete</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </Card>)
}

export default QuoteResponses;

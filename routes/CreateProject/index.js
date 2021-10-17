import React from "react";
import { Form, Input, Button, Card, Col, Row, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import IntlMessages from "../../util/IntlMessages";

const { TextArea } = Input;

const formLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 20 },
  },
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: { span: 5 },
    lg: { span: 5 },
  },
};

const stringRule = {
  required: true,
  message: <IntlMessages id="app.project.create.validations" />,
};

const Createproject = () => {
  const [form] = Form.useForm();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onSave = (values) => {
    console.log(values);
  };

  return (
    <Card className="gx-card" title={<IntlMessages id="app.project.createNewProject"/>}>
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={onSave}
        {...formLayout}
      >
        <Row>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              name="projectName"
              label={<IntlMessages id="sidebar.project.projectName"/>}
              rules={[stringRule]}
            >
              <Input placeholder="Project Name" />
            </Form.Item>
            <Form.Item name="manager" label={<IntlMessages id="app.project.field.manager"/>} rules={[stringRule]}>
              <Input placeholder="Manager" />
            </Form.Item>
            <Form.Item
              name="costCenter"
              label={<IntlMessages id="app.project.field.costcenter"/>}
              rules={[stringRule]}
            >
              <Input placeholder="Cost Center" />
            </Form.Item>
            <Form.Item
              name="description"
              label={<IntlMessages id="app.project.field.description"/>}
              rules={[stringRule]}
            >
              <TextArea placeholder="Description" rows={8} />
            </Form.Item>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Form.Item label="Dragger">
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              <IntlMessages id="sidebar.general.button"/>
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Createproject;

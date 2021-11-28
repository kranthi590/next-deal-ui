import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Col,
  Row,
  Upload,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

// Uitls
import IntlMessages from "../../util/IntlMessages";
import { useProject } from "../../contexts/projects";
import {
  errorNotification,
  NOTIFICATION_TIMEOUT,
  successNotification,
  getDateInMilliseconds, getBuyerId,
} from "../../util/util";
import {useRouter} from "next/router";

const { TextArea } = Input;
const { Option } = Select;

const formLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 20 },
    lg: { span: 20 },
  },
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 7 },
    lg: { span: 7 },
  },
};

const stringRule = {
  required: true,
  message: <IntlMessages id="app.project.create.validations" />,
};

const NewProject = () => {
  const router = useRouter();
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [expectedEndDate, setExpectedEndDate] = useState(null);

  const { error, newProject } = useProject();

  const [form] = Form.useForm();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const startDateChangeHandler = (date) => {
    setStartDate(getDateInMilliseconds(date));
  };

  const endDateChangeHandler = (date) => {
    setExpectedEndDate(getDateInMilliseconds(date));
  };

  const getFormData = (data) => {
    const formData = Object.keys(data).reduce((acc, key) => {
      if (data[key] && key === "startDate") {
        acc = { ...acc, startDate };
      } else if (data[key] && key === "expectedEndDate") {
        acc = { ...acc, expectedEndDate };
      } else if (data[key]) {
        acc = { ...acc, [key]: data[key] };
      }
      return acc;
    }, {});

    return formData;
  };

  const onSave = (values) => {
        newProject(getFormData(values), () => {
          successNotification("app.registration.detailsSaveSuccessMessage");
          setTimeout(() => {
            router.push("/projects");
          }, NOTIFICATION_TIMEOUT);
        });
  };

  return (
    <Card
      className="gx-card"
      title={<IntlMessages id="app.project.createNewProject" />}
    >
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={onSave}
        {...formLayout}
      >
        <Row>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              name="name"
              label={<IntlMessages id="app.project.field.projectname" />}
              rules={[stringRule]}
            >
              <Input placeholder="Project Name" />
            </Form.Item>
            <Form.Item
              name="managerName"
              label={<IntlMessages id="app.project.field.manager" />}
              rules={[stringRule]}
            >
              <Input placeholder="Manager" />
            </Form.Item>
            <Form.Item
              name="costCenter"
              label={<IntlMessages id="app.project.field.costcenter"/>}
            >
              <Input placeholder="Cost Center" />
            </Form.Item>
            <Form.Item
              name="startDate"
              label={<IntlMessages id="app.project.field.startdate" />}
            >
              <DatePicker
                className="gx-w-100"
                placeholder="Start Date"
                onChange={startDateChangeHandler}
              />
            </Form.Item>
            <Form.Item
              name="expectedEndDate"
              label={<IntlMessages id="app.project.field.enddate" />}
              rules={[
                {
                  required: !!startDate,
                  validator: (_, value) => {
                    if (startDate && !value) {
                      return Promise.reject(
                        <IntlMessages id="app.project.create.validations" />
                      );
                    } else if (startDate > getDateInMilliseconds(value)) {
                      return Promise.reject("Please select valid end date");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                className="gx-w-100"
                placeholder="End Date"
                onChange={endDateChangeHandler}
              />
            </Form.Item>
            <Form.Item
              name="estimatedBudget"
              label={<IntlMessages id="app.project.field.estimatedBudget" />}
            >
              <InputNumber
                className="gx-w-100"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Estimated Budget"
                onChange={(value) => setEstimatedBudget(value)}
              />
            </Form.Item>
            <Form.Item
              label={<IntlMessages id="app.project.field.currency" />}
              name="currency"
              rules={[
                {
                  ...stringRule,
                  required: !!estimatedBudget,
                },
              ]}
            >
              <Select placeholder="Select Currency">
                <Option value=""></Option>
                <Option value="clp">CLP</Option>
                <Option value="uf">UF</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label={<IntlMessages id="app.project.field.description"/>}
              rules={[stringRule]}
            >
              <TextArea placeholder="Description" rows={8} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              <IntlMessages id="sidebar.project.saveProject" />
            </Button>
          </Col>
        </Row>
      </Form>
      {error && errorNotification(error, "app.registration.errorMessageTitle")}
    </Card>
  );
};

export default NewProject;

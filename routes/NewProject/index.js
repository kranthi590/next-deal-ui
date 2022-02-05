import React, { useState } from 'react';
import { Form, Input, Button, Card, Col, Row, DatePicker, Select } from 'antd';

// Uitls
import IntlMessages from '../../util/IntlMessages';
import { useProject } from '../../contexts/projects';
import {
  NOTIFICATION_TIMEOUT,
  successNotification,
  getDateInMilliseconds,
  clpToNumber,
} from '../../util/util';
import { useRouter } from 'next/router';
import BreadCrumb from '../../app/components/BreadCrumb';
import ClpFormatter from '../../shared/CLP';

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

const NewProject = props => {
  const router = useRouter();
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [expectedEndDate, setExpectedEndDate] = useState(null);

  const { error, newProject } = useProject();

  const [form] = Form.useForm();

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const startDateChangeHandler = date => {
    setStartDate(getDateInMilliseconds(date));
  };

  const endDateChangeHandler = date => {
    setExpectedEndDate(getDateInMilliseconds(date));
  };

  const getFormData = data => {
    const formData = Object.keys(data).reduce((acc, key) => {
      if (data[key] && key === 'startDate') {
        acc = { ...acc, startDate };
      } else if (data[key] && key === 'expectedEndDate') {
        acc = { ...acc, expectedEndDate };
      } else if (data[key] && key === 'estimatedBudget') {
        acc = { ...acc, estimatedBudget: clpToNumber(estimatedBudget) };
      } else if (data[key]) {
        acc = { ...acc, [key]: data[key] };
      }
      return acc;
    }, {});

    return formData;
  };

  const onSave = values => {
    newProject(getFormData(values), () => {
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {
        router.push('/projects');
      }, NOTIFICATION_TIMEOUT);
    });
  };

  const disabledStartDate = value => {
    const formData = form;
    return value > formData.getFieldValue('expectedEndDate');
  };

  const disabledEndDate = value => {
    const formData = form;
    return value < formData.getFieldValue('startDate');
  };

  const onChange = async value => {
    setEstimatedBudget(value);
  };

  return (
    <>
      <BreadCrumb
        navItems={[
          { text: <IntlMessages id="sidebar.project.Projects" />, route: '/projects' },
          { text: <IntlMessages id="app.common.createProject" /> },
        ]}
      />
      <Card className="gx-card" title={<IntlMessages id="app.project.createNewProject" />}>
        <Form form={form} initialValues={{ remember: true }} onFinish={onSave} {...formLayout}>
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
                label={<IntlMessages id="app.project.field.costcenter" />}
              >
                <Input placeholder="Cost Center" />
              </Form.Item>
              <Form.Item name="startDate" label={<IntlMessages id="app.project.field.startdate" />}>
                <DatePicker
                  className="gx-w-100"
                  placeholder="Start Date"
                  onChange={startDateChangeHandler}
                  disabledDate={disabledStartDate}
                />
              </Form.Item>
              <Form.Item
                name="expectedEndDate"
                label={<IntlMessages id="app.project.field.enddate" />}
                rules={[
                  {
                    required: !!startDate,
                  },
                ]}
              >
                <DatePicker
                  className="gx-w-100"
                  placeholder="End Date"
                  onChange={endDateChangeHandler}
                  disabledDate={disabledEndDate}
                />
              </Form.Item>
              <Form.Item
                name="estimatedBudget"
                label={<IntlMessages id="app.project.field.estimatedBudget" />}
              >
                <ClpFormatter
                  {...props}
                  className="gx-w-100"
                  value={estimatedBudget}
                  size="large"
                  onChange={onChange}
                  placeholder="1.00.00"
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
                  <Option value="clp">CLP</Option>
                  <Option value="uf">UF</Option>
                  <Option value="usd">USD</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                label={<IntlMessages id="app.project.field.description" />}
                rules={[stringRule]}
              >
                <TextArea placeholder="Description" rows={8} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                <IntlMessages id="sidebar.project.saveProject" />
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default NewProject;

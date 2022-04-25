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
import { FileAddOutlined } from '@ant-design/icons';
import FilesManager from '../../app/common/FileManager';
import { uploadFiles } from '../../util/Api';
import { CURRENCY } from '../../util/appConstants';
import { useIntl } from 'react-intl';

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
  const [files, setFiles] = useState([]);

  const { newProject } = useProject();

  const [form] = Form.useForm();
  const intl = useIntl();
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
    newProject(getFormData(values), async data => {
      if (files.length > 0) {
        await uploadFiles(
          files,
          {
            assetRelation: 'project',
            assetRelationId: data.id,
          },
          true,
        );
      }
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {
        router.push('/projects');
      }, NOTIFICATION_TIMEOUT);
    });
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
      <Card className="gx-card gx-card-widget">
        <div className="ant-card-head gx-pt-0">
          <div className="ant-card-head-wrapper">
            <div className="ant-card-head-title gx-text-left">
              <h4 className="gx-card-bordered-title">
                <FileAddOutlined className="gx-mr-3" />
                <IntlMessages id="app.project.createNewProject" />
              </h4>
            </div>
          </div>
        </div>
        <Form form={form} initialValues={{ remember: true }} onFinish={onSave} {...formLayout}>
          <Row>
            <Col xl={14} lg={24} md={24} sm={24} xs={24}>
              <Form.Item
                name="name"
                label={<IntlMessages id="app.project.field.projectname" />}
                rules={[stringRule]}
              >
                <Input placeholder={intl.formatMessage({ id: 'app.project.field.projectname' })} />
              </Form.Item>
              <Form.Item
                name="managerName"
                label={<IntlMessages id="app.project.field.manager" />}
                rules={[stringRule]}
              >
                <Input placeholder={intl.formatMessage({ id: 'app.project.field.manager' })} />
              </Form.Item>
              <Form.Item
                name="costCenter"
                label={<IntlMessages id="app.project.field.costcenter" />}
              >
                <Input placeholder={intl.formatMessage({ id: 'app.project.field.costcenter' })} />
              </Form.Item>
              <Form.Item
                name="startDate"
                label={<IntlMessages id="app.project.field.startdate" />}
                rules={[stringRule]}
              >
                <DatePicker
                  className="gx-w-100"
                  placeholder={intl.formatMessage({ id: 'app.project.field.startdate' })}
                  onChange={startDateChangeHandler}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
              <Form.Item
                name="expectedEndDate"
                label={<IntlMessages id="app.project.field.projectenddate" />}
              >
                <DatePicker
                  className="gx-w-100"
                  placeholder={intl.formatMessage({ id: 'app.project.field.projectenddate' })}
                  onChange={endDateChangeHandler}
                  format="DD/MM/YYYY"
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
                rules={[stringRule]}
              >
                <Select
                  placeholder={intl.formatMessage({ id: 'app.project.field.currency' })}
                  showSearch
                  filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                >
                  {Object.keys(CURRENCY).map(item => (
                    <Option key={item} value={CURRENCY[item].toLowerCase()}>
                      {CURRENCY[item]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                label={<IntlMessages id="app.project.field.projectDescription" />}
              >
                <TextArea
                  placeholder={intl.formatMessage({ id: 'app.project.field.projectDescription' })}
                  rows={8}
                />
              </Form.Item>
            </Col>
            <Col
              span={10}
              style={{
                height: '130px',
                overflowX: 'auto',
              }}
            >
              <FilesManager
                files={files}
                context={{
                  assetRelation: 'project',
                }}
                customSubmitHandler={({ fileList }) => {
                  setFiles(fileList);
                }}
                tooltiptext={
                  intl.formatMessage({ id: 'app.common.filesAcceptTooltip' }) +
                  ` (.pdf, .xlsx, .jpg. etc)`
                }
                allowDelete={true}
              />
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

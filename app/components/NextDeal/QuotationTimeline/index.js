import React from 'react';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import {
  AuditOutlined,
  EditOutlined,
  ExceptionOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FormOutlined,
  SaveOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Button, Card, Row, Col, Form, Input, Popover } from 'antd';
import IntlMessages from '../../../util/IntlMessages';

const timelineData = {
  QUOTATION_CREATED: {
    icon: FormOutlined,
    title: 'Created',
    color: '#003366',
  },
  QUOTATION_RESPONSE_CREATED: {
    icon: SolutionOutlined,
    title: 'Response Created',
    color: '#003366',
  },
  QUOTATION_AWARDED: {
    icon: AuditOutlined,
    title: 'Awarded',
    color: '#f70',
  },
  QUOTATION_RETAINED: {
    icon: FileProtectOutlined,
    title: 'Retained',
    color: '#003366',
  },
  QUOTATION_RECEPTION_CONFIRMED: {
    icon: ExceptionOutlined,
    title: 'Confirmed',
    color: '#003366',
  },
  QUOTATION_COMPLETED: {
    icon: FileDoneOutlined,
    title: 'Completed',
    color: '#f70',
  },
  QUOTATION_ABORTED: {
    icon: ExceptionOutlined,
    title: 'Aborted',
    color: '#F44336',
  },
  CUSTOM: {
    icon: EditOutlined,
    title: 'Custom',
    color: '#003366',
  },
};

const QuotationTimeline = ({ activities, onSaveActivity }) => {
  const [form] = Form.useForm();
  const initialFormData = { activityText: '' };
  const onFinish = values => {
    // on finish
    onSaveActivity({ activityText: values.activityText });
  };
  const onFinishFailed = errorInfo => {};

  const AddCustomActivityForm = () => {
    return (
      <div className="gx-p-2">
        <Form
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={initialFormData}
          layout="vertical"
        >
          <Row gutter={2}>
            <Col xs={24}>
              <Form.Item
                name="activityText"
                placeholder="Activity text"
                label={'Activity text'}
                rules={[
                  {
                    required: true,
                    message: (
                      <IntlMessages id="app.activityform.field.activityText.error.required" />
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} className="gx-d-flex gx-justify-content-end gx-align-items-end">
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  className="gx-mb-0"
                >
                  <span>
                    <IntlMessages id="app.quotationresponses.button.save" />
                  </span>
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
  return (
    <React.Fragment>
      <Card className="gx-card">
        <div>
          <Timeline height={200}>
            {activities.map(item => {
              const currentEventData = timelineData[item.activityType];
              return (
                <TimelineEvent
                  icon={currentEventData.icon}
                  title={item.activityText || currentEventData.title}
                  color={currentEventData.color}
                />
              );
            })}
            <Card
              className="gx-h-100 gx-m-2 gx-d-flex gx-justify-content-center gx-align-items-center"
              style={{ width: '225px' }}
            >
              <Popover content={<AddCustomActivityForm />} title="Add Activity">
                <Button type="primary" size="large" shape="circle" icon={<FileAddOutlined />} />
              </Popover>
            </Card>
          </Timeline>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default QuotationTimeline;

import React from 'react';
import {
  AuditOutlined,
  EditOutlined,
  FileSyncOutlined,
  FileAddOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileExclamationOutlined,
  FormOutlined,
  SaveOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Button, Card, Row, Col, Form, Input, Popover } from 'antd';
import IntlMessages from '../../../../util/IntlMessages';
import moment from 'moment';
import CustomTimeLineEvent from '../../NextDeal/CustomTimeLineEvent';
import Scrollbars from 'react-custom-scrollbars';

const timelineData = {
  QUOTATION_CREATED: {
    icon: FormOutlined,
    title: <IntlMessages id="app.common.text.created" />,
    color: '#038fdd',
  },
  QUOTATION_RESPONSE_CREATED: {
    icon: SolutionOutlined,
    title: <IntlMessages id="app.common.text.responseCreated" />,
    color: '#003366',
  },
  QUOTATION_AWARDED: {
    icon: FileProtectOutlined,
    title: <IntlMessages id="app.quotationresponses.button.awarded" />,
    color: '#f70',
  },
  QUOTATION_RETAINED: {
    icon: FileSyncOutlined,
    title: <IntlMessages id="app.common.text.retained" />,
    color: '#FDE3CF',
  },
  QUOTATION_RECEPTION_CONFIRMED: {
    icon: AuditOutlined,
    title: <IntlMessages id="app.common.text.confirmed" />,
    color: '#13c2c28f',
  },
  QUOTATION_COMPLETED: {
    icon: FileDoneOutlined,
    title: <IntlMessages id="app.quotationresponses.button.completed" />,
    color: '#13C2C2',
  },
  QUOTATION_ABORTED: {
    icon: FileExclamationOutlined,
    title: <IntlMessages id="app.common.text.aborted" />,
    color: '#F44336',
  },
  CUSTOM: {
    icon: EditOutlined,
    title: <IntlMessages id="app.common.text.custom" />,
    color: '#05488b',
  },
};

const QuotationTimeline = ({ activities, onSaveActivity }) => {
  const [form] = Form.useForm();
  const initialFormData = { activityText: '' };
  const onFinish = values => {
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
                label={<IntlMessages id="app.activityform.field.activityText" />}
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
        <Scrollbars autoHeight universal>
          <div className="gx-d-flex gx-position-relative gx-mb-2" style={{ width: 0 }}>
            {activities &&
              activities.map((item, index) => {
                const currentEventData = timelineData[item.activityType];
                return (
                  <CustomTimeLineEvent
                    key={index + '-event'}
                    color={currentEventData.color}
                    icon={currentEventData.icon}
                    title={
                      <div>
                        <span>{item.activityText || currentEventData.title}</span>
                        {item.createdAt ? (
                          <>
                            <br />
                            <span className="gx-text-muted">
                              {moment(item.createdAt).format('MMM Do YY')}
                            </span>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    }
                  />
                );
              })}
            <div
              className="gx-p-2 gx-d-flex gx-justify-content-center gx-align-items-center"
              style={{ height: '160px!important' }}
            >
              <Card
                className="gx-h-100 gx-mb-0 gx-d-flex gx-justify-content-center gx-align-items-center"
                style={{ width: '225px' }}
              >
                <Popover
                  content={<AddCustomActivityForm />}
                  title={<IntlMessages id="app.activityform.title" />}
                >
                  <Button type="primary" size="large" shape="circle" icon={<FileAddOutlined />} >
                    <IntlMessages id="app.activityform.title" />
                  </Button>
                </Popover>
              </Card>
            </div>
          </div>
        </Scrollbars>
      </Card>
    </React.Fragment>
  );
};

export default QuotationTimeline;

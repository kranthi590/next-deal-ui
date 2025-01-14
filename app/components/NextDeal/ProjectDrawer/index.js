import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Drawer, Skeleton } from 'antd';
import CustomScrollbars from '../../../../util/CustomScrollbars';
import { useProject } from '../../../../contexts/projects';
import IntlMessages from '../../../../util/IntlMessages';
import {
  formatAmount,
  getDateInMilliseconds,
  NOTIFICATION_TIMEOUT,
  successNotification,
} from '../../../../util/util';
import moment from 'moment';
import { FormOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const formLayout = {
  wrapperCol: {
    xs: { span: 24 },
  },
  labelCol: {
    xs: { span: 24 },
  },
};
const { TextArea } = Input;

const stringRule = {
  required: true,
  message: <IntlMessages id="app.project.create.validations" />,
};

const ProjectDrawer = ({ isCustomizerOpened, onClose, projectId }) => {
  const [projectDetails, setProjectDetails] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [expectedEndDate, setExpectedEndDate] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getProjectById, updateProject } = useProject();

  const [form] = Form.useForm();

  const intl = useIntl();
  const toggleForm = val => {
    setOpenForm(val);
  };

  const toggleCustomizer = () => {
    toggleForm(false);
    onClose();
  };
  const endDateChangeHandler = date => {
    setExpectedEndDate(getDateInMilliseconds(date));
  };
  const getFormData = data => {
    const formData = Object.keys(data).reduce((acc, key) => {
      if (data[key] && key === 'expectedEndDate') {
        acc = { ...acc, expectedEndDate };
      } else if (data[key]) {
        acc = { ...acc, [key]: data[key] };
      } else {
        acc = { ...acc, [key]: null };
      }
      return acc;
    }, {});

    return formData;
  };

  const onSave = values => {
    setIsLoading(true);
    updateProject({ id: projectDetails.id, ...getFormData(values) }, async data => {
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {
        setIsLoading(false);
        window.location.reload();
      }, 1000);
    });
  };

  const setFormData = () => {
    const newFormData = {};
    if (projectDetails.name) {
      newFormData.name = projectDetails.name;
    }
    if (projectDetails.managerName) {
      newFormData.managerName = projectDetails.managerName;
    }

    if (projectDetails.expectedEndDate) {
      newFormData.expectedEndDate = moment(projectDetails.expectedEndDate);
      endDateChangeHandler(moment(projectDetails.expectedEndDate));
    }
    if (projectDetails.costCenter) {
      newFormData.costCenter = projectDetails.costCenter;
    }
    if (projectDetails.description) {
      newFormData.description = projectDetails.description;
    }
    form.setFieldsValue(newFormData);
  };

  const loadProjectDetails = () => {
    setProjectLoading(true);
    getProjectById(projectId, projectData => {
      setProjectDetails(projectData);
      setProjectLoading(false);
    });
  };

  useEffect(() => {
    if (projectId) {
      loadProjectDetails();
    } else {
      setProjectDetails(null);
    }
  }, [projectId]);

  useEffect(() => {
    if (openForm === false) {
      form.resetFields();
    } else {
      if (projectDetails) {
        setFormData();
      }
    }
  }, [openForm]);

  const getCustomizerContent = () => {
    return (
      <CustomScrollbars className="gx-customizer">
        {
          <div className="gx-px-2 gx-p-2">
            {!openForm ? (
              <>
                {projectDetails && !projectLoading ? (
                  <div className="gx-pt-2">
                    <h4>
                      <IntlMessages id="app.project.field.projectname" /> :
                    </h4>
                    <p className="gx-text-grey gx-mb-4">
                      {projectDetails.name ? projectDetails.name : '-'}
                    </p>

                    <h4>
                      <IntlMessages id="app.project.field.estimatedBudget" /> :
                    </h4>
                    <p className="gx-text-grey gx-mb-4">
                      {projectDetails.estimatedBudget ? (
                        <>
                          {' '}
                          {formatAmount(`${projectDetails.estimatedBudget}`)}
                          {projectDetails.currency ? (
                            <span className="gx-text-grey gx-fs-sm gx-text-uppercase">
                              {' '}
                              {projectDetails.currency}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        '-'
                      )}
                    </p>

                    <h4>
                      <IntlMessages id="app.project.field.startdate" /> :
                    </h4>
                    <p className="gx-text-grey gx-mb-4">
                      {projectDetails.startDate
                        ? moment(projectDetails.startDate).format('DD-MM-YYYY')
                        : '-'}
                    </p>
                    <h4>
                      <IntlMessages id="app.project.field.projectenddate" /> :
                    </h4>
                    <p className="gx-text-grey gx-mb-4">
                      {projectDetails.expectedEndDate
                        ? moment(projectDetails.expectedEndDate).format('DD-MM-YYYY')
                        : '-'}
                    </p>
                    <h4>
                      <IntlMessages id="app.project.field.costcenter" /> :
                    </h4>
                    <p className="gx-text-grey gx-mb-4">
                      {projectDetails.costCenter ? projectDetails.costCenter : '-'}
                    </p>

                    <h4>
                      <IntlMessages id="app.project.field.manager" /> :
                    </h4>
                    <p className="gx-text-grey gx-mb-4">
                      {projectDetails.managerName ? projectDetails.managerName : '-'}
                    </p>

                    <h4>
                      <IntlMessages id="app.project.field.projectDescription" /> :
                    </h4>
                    <p className="gx-text-grey gx-mb-4">
                      {projectDetails.description ? projectDetails.description : '-'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Skeleton active paragraph={{ rows: 1 }} />
                    <Skeleton active paragraph={{ rows: 1 }} />
                    <Skeleton active paragraph={{ rows: 1 }} />
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </div>
                )}
                <Button
                  type="primary"
                  className="gx-btn gx-w-100 gx-mb-4 nd-add-quote"
                  onClick={() => {
                    toggleForm(true);
                  }}
                >
                  <FormOutlined style={{ fontSize: '14px', marginRight: '5px' }} />
                  <IntlMessages id="app.common.edit" />
                </Button>
              </>
            ) : null}
            {openForm ? (
              <div className="gx-pt-2">
                <Form
                  form={form}
                  initialValues={{ remember: true }}
                  onFinish={onSave}
                  {...formLayout}
                  labelAlign="left"
                >
                  <Form.Item
                    name="name"
                    label={<IntlMessages id="app.project.field.projectname" />}
                    rules={[stringRule]}
                  >
                    <Input
                      placeholder={intl.formatMessage({ id: 'app.project.field.projectname' })}
                    />
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
                    <Input
                      placeholder={intl.formatMessage({ id: 'app.project.field.costcenter' })}
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
                    name="description"
                    label={<IntlMessages id="app.project.field.projectDescription" />}
                  >
                    <TextArea
                      placeholder={intl.formatMessage({
                        id: 'app.project.field.projectDescription',
                      })}
                      rows={8}
                    />
                  </Form.Item>
                  <div className="gx-text-right">
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                      <IntlMessages id="button.save" />
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        toggleForm(false);
                      }}
                    >
                      <IntlMessages id="button.cancel" />
                    </Button>
                  </div>
                </Form>
              </div>
            ) : null}
          </div>
        }
      </CustomScrollbars>
    );
  };

  return (
    <>
      <Drawer
        title={<IntlMessages id="app.common.projectDetails" />}
        placement="right"
        closeIcon={<i className="icon icon-close-circle gx-fs-xl" />}
        onClose={toggleCustomizer}
        visible={isCustomizerOpened}
        className={'project-drawer'}
      >
        {getCustomizerContent()}
      </Drawer>
    </>
  );
};

export default ProjectDrawer;

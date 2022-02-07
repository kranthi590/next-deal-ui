import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Select } from 'antd';
import { useProject } from '../../../../contexts/projects';
import IntlMessages from '../../../../util/IntlMessages';

const { Option } = Select;

const ProjectSelector = ({
  projectChangeCallback,
  updateLoader,
  showStatus,
  statusChangeCallback,
  welcomemsg,
}) => {
  const { getProjectsByPagination } = useProject();
  const [initialFormData, setInitialFormData] = useState({
    project: null,
    projectStatus: 'awarded',
  });
  const [allProjects, setAllProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const colSetInput = { xs: { span: 24 }, sm: { span: 14 }, md: { span: 16 } };
  const colSetLabel = { xs: { span: 24 }, sm: { span: 10 }, md: { span: 8 } };
  const onFinish = values => {};
  const onFinishFailed = errorInfo => {};

  const handleProjectChanged = value => {
    setSelectedProject(value);
  };
  const handleStatusChanged = value => {
    if (statusChangeCallback) {
      statusChangeCallback(value);
    }
  };
  useEffect(() => {
    getProjectsByPagination(100, 0, data => {
      setAllProjects(data.rows);
      if (data.rows.length) {
        setSelectedProject(data.rows[0].id);
      }
      if (updateLoader) {
        updateLoader(false);
      }
    });
  }, []);

  useEffect(() => {
    if (projectChangeCallback) {
      projectChangeCallback(selectedProject);
    }
  }, [selectedProject]);

  return (
    <div>
      <Form
        initialValues={initialFormData}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        name="metricsSelectionForm"
        fields={[
          {
            name: ['project'],
            value: selectedProject,
          },
        ]}
      >
        <Row>
          {welcomemsg ? (
            <Col xs={24} sm={{ span: 12 }}>
              <Col>
                <div className="ant-form-item-label">
                  <label className="ant-form-item-no-colon">{welcomemsg}</label>
                </div>
              </Col>
            </Col>
          ) : (
            <></>
          )}
          <Col xs={24} sm={{ span: 12, push: showStatus || welcomemsg ? 0 : 12 }}>
            <Form.Item
              name="project"
              label={<IntlMessages id="app.common.text.selectProject" />}
              labelCol={colSetLabel}
              wrapperCol={colSetInput}
            >
              <Select placeholder="Select Projects" onSelect={handleProjectChanged}>
                {allProjects &&
                  allProjects.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          {showStatus ? (
            <Col xs={24} sm={12}>
              <Form.Item
                name="projectStatus"
                label={<IntlMessages id="calendar.filter.status" />}
                labelCol={colSetLabel}
                wrapperCol={colSetInput}
              >
                <Select placeholder="Project Status" onSelect={handleStatusChanged}>
                  <Option value="all">
                    <IntlMessages id="calendar.filter.option.all" />
                  </Option>
                  <Option value="awarded">
                    <IntlMessages id="calendar.filter.option.awarded" />
                  </Option>
                  <Option value="unawarded">
                    <IntlMessages id="calendar.filter.option.dewarded" />
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Form>
    </div>
  );
};

export default ProjectSelector;

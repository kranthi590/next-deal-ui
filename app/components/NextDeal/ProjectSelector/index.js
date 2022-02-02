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
}) => {
  const { getProjectsByPagination } = useProject();
  const [initialFormData, setInitialFormData] = useState({
    project: null,
    projectStatus: 'awarded',
  });
  const [allProjects, setAllProjects] = useState([]);
  const [form] = Form.useForm();
  const [selectedProject, setSelectedProject] = useState(null);
  const colSetInput = { xs: { span: 24 }, sm: { span: 14 }, md: { span: 14 } };
  const colSetLabel = { xs: { span: 24 }, sm: { span: 10 }, md: { span: 10 } };
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
        // layout="horizontal"
        labelWrap
        labelAlign={showStatus ? 'left' : 'right'}
        fields={[
          {
            name: ['project'],
            value: selectedProject,
          },
        ]}
      >
        <Row>
          <Col xs={24} sm={{ span: 12, push: showStatus ? 0 : 12 }}>
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
                label={'Status'}
                labelCol={colSetLabel}
                wrapperCol={colSetInput}
              >
                <Select placeholder="Project Status" onSelect={handleStatusChanged}>
                  <Option value="awarded">Awarded</Option>
                  <Option value="unawarded">Un Awarded</Option>
                  <Option value="all">All</Option>
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

import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { useProject } from '../../../../contexts/projects';
import IntlMessages from '../../../../util/IntlMessages';

const { Option } = Select;

const ProjectSelector = ({ projectChangeCallback, updateLoader }) => {
  const { getProjectsByPagination } = useProject();
  const [initialFormData, setInitialFormData] = useState({ project: null });
  const [allProjects, setAllProjects] = useState([]);
  const [form] = Form.useForm();
  const [selectedProject, setSelectedProject] = useState(null);

  const onFinish = values => {};
  const onFinishFailed = errorInfo => {};

  const handleProjectChanged = value => {
    setSelectedProject(value);
  };
  useEffect(() => {
    getProjectsByPagination(50, 0, data => {
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
        layout="horizontal"
        labelWrap
        labelAlign="right"
        fields={[
          {
            name: ['project'],
            value: selectedProject,
          },
        ]}
      >
        <Form.Item
          name="project"
          label={<IntlMessages id="app.common.text.selectProject" />}
          labelCol={{ xs: { span: 24 }, sm: { span: 10, push: 4 }, md: { span: 8, push: 8 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 10, push: 4 }, md: { span: 8, push: 8 } }}
        >
          <Select placeholder="Select Projects" onSelect={handleProjectChanged}>
            {/* <Option value="" ><IntlMessages id="app.common.text.selectProject" /></Option> */}
            {allProjects &&
              allProjects.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectSelector;

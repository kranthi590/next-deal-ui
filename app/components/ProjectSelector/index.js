import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { useProject } from '../../../contexts/projects';
import IntlMessages from '../../../util/IntlMessages';

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
    getProjectsByPagination(20, 0, data => {
      setAllProjects(data.rows);
      if (data.rows.length) {
        setSelectedProject(data.rows[0].id);
      }
      updateLoader(false);
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
        <Form.Item name="project" label={<IntlMessages id="app.common.text.selectProject" />}>
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

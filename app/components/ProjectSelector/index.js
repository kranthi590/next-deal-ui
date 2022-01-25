import React, { useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { useProject } from '../../../contexts/projects';

const { Option } = Select;

const ProjectSelector = ({ projectChangeCallback }) => {
    const { getProjectsByPagination } = useProject();
    const [initialFormData, setInitialFormData] = useState({ project: "" });
    const [allProjects, setAllProjects] = useState([]);
    const [form] = Form.useForm();
    const [selectedProject, setSelectedProject] = useState(0);

    const onFinish = values => { };
    const onFinishFailed = errorInfo => { };

    const handleProjectChanged = (value) => {
        setSelectedProject(value);
    }
    useEffect(() => {
        getProjectsByPagination(20, 0, (data) => {
            setAllProjects(data.rows)
            if (data.rows.length) {
                setSelectedProject(data.rows[0].id)
            }
        })
    }, []);

    useEffect(() => {
        if (projectChangeCallback) {
            projectChangeCallback(selectedProject)
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
                    }]}
            >
                <Form.Item
                    name="project"
                    label="Select Project"
                >
                    <Select placeholder="Select Projects" onSelect={handleProjectChanged}>
                        <Option value="" > </Option>
                        {
                            allProjects && allProjects.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ProjectSelector
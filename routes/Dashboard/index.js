import React, { useState, useEffect } from 'react';
import { Form, Select, Card, Row, Col, Divider } from 'antd';
import { ProjectProvider, useProject } from '../../contexts/projects';

const { Option } = Select;

const BuyerDashboard = ({ userProfile, projectsList }) => {
  const { getProjectsByPagination } = useProject();
  const initialFormData = { project: 270 };
  const [form] = Form.useForm();
  const [selectedProject, setSelectedProject] = useState(270);
  const [allProjects, setAllProjects] = useState([]);
  const buyerId = 25;
  const onFinish = values => {
    // on finish
  };
  const onFinishFailed = errorInfo => {};

  const handleProjectChanged = value => {
    setSelectedProject(value);
  };
  useEffect(() => {
    getProjectsByPagination(20, 0, data => {
      setAllProjects(data.rows);
    });
  }, []);

  return (
    <React.Fragment>
      <div>
        Welcome, {userProfile.firstName} {userProfile.lastName}
      </div>
      <div className="gx-mb-2">
        <Col md={8} offset={16}>
          <div>
            <Form
              initialValues={initialFormData}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              name="metricsSelectionForm"
            >
              <Form.Item name="project" label="Select Project">
                <Select
                  placeholder="Select Projects"
                  value={selectedProject}
                  onSelect={handleProjectChanged}
                >
                  {allProjects.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </div>
      <Card className="ant-card gx-card-widget">
        <div class="ant-card-head gx-pt-0">
          <div class="ant-card-head-wrapper">
            <div class="ant-card-head-title gx-text-left">
              <h4 class="gx-card-bordered-title">
                <i class="icon icon-mail-open gx-mr-3"></i>Budget
              </h4>
            </div>
          </div>
        </div>
        <div>
          <iframe
            src={`https://metrics.nextdeal.dev/d-solo/IWqJ14onk/budget?orgId=1&from=1641697206709&to=1642906806711&var-Buyer=${buyerId}&var-Project=${selectedProject}&panelId=10`}
            width="100%"
            height="300"
            frameBorder="0"
          />
          <Divider />
          <div>
            <iframe
              src={`https://metrics.nextdeal.dev/d-solo/IWqJ14onk/budget?orgId=1&from=1641697206709&to=1642906806711&var-Buyer=${buyerId}&var-Project=${selectedProject}&panelId=8`}
              width="100%"
              height="300"
              frameBorder="0"
            />
          </div>
        </div>
      </Card>
      <Card className="ant-card gx-card-widget">
        <div class="ant-card-head gx-pt-0">
          <div class="ant-card-head-wrapper">
            <div class="ant-card-head-title gx-text-left">
              <h4 class="gx-card-bordered-title">
                <i class="icon icon-mail-open gx-mr-3"></i>
                Quotations Per Project
              </h4>
            </div>
          </div>
        </div>
        <div>
          <iframe
            src={`https://metrics.nextdeal.dev/d-solo/NNU50zTnk/quotations-per-project?orgId=1&var-Buyer=${buyerId}&var-Project=${selectedProject}&from=1642077315415&to=1642682115415&panelId=10`}
            width="100%"
            height="300"
            frameBorder="0"
          />
          <div>
            <iframe
              src={`https://metrics.nextdeal.dev/d-solo/NNU50zTnk/quotations-per-project?orgId=1&var-Buyer=${buyerId}&var-Project=${selectedProject}&from=1642077432089&to=1642682232089&panelId=4`}
              width="100%"
              height="300"
              frameBorder="0"
            />
          </div>
        </div>
      </Card>
      <Card className="ant-card gx-card-widget">
        <div class="ant-card-head gx-pt-0">
          <div class="ant-card-head-wrapper">
            <div class="ant-card-head-title gx-text-left">
              <h4 class="gx-card-bordered-title">
                <i class="icon icon-mail-open gx-mr-3"></i>
                Suppliers & Quotations
              </h4>
            </div>
          </div>
        </div>
        <div>
          <iframe
            src={`https://metrics.nextdeal.dev/d-solo/lQAafVo7k/suppliers-and-quotations?orgId=1&var-Buyer=${buyerId}&var-Project=${selectedProject}&from=1642077601483&to=1642682401483&panelId=10`}
            width="100%"
            height="300"
            frameBorder="0"
          />
          <div>
            <iframe
              src={`https://metrics.nextdeal.dev/d-solo/lQAafVo7k/suppliers-and-quotations?orgId=1&var-Buyer=${buyerId}&var-Project=${selectedProject}&from=1642077669000&to=1642682469000&panelId=8`}
              width="100%"
              height="300"
              frameBorder="0"
            />
          </div>
        </div>
      </Card>
    </React.Fragment>
  );
};

const Dashboard = props => (
  <ProjectProvider>
    <BuyerDashboard {...props} />
  </ProjectProvider>
);
export default Dashboard;

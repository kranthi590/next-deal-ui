import React, { useState, useEffect } from 'react';
import { Card, Col } from 'antd';
import { ProjectProvider } from '../../contexts/projects';
import { Cookies } from 'react-cookie';
import NoDataAvailable from '../../app/components/NoDataAvailable.js';
import ProjectSelector from '../../app/components/ProjectSelector';

const QuotationsPerProjectDashboard = () => {
    const [selectedProject, setSelectedProject] = useState(0);
    const [buyerId, setBuyerId] = useState(null);
    const cookie = new Cookies();

    const projectChangeCallback = (projectId) => {
        setSelectedProject(projectId)
    }

    useEffect(() => {
        setBuyerId(cookie.get('buyerId'));
    })

    return (
        <React.Fragment>
            <div className="gx-mb-2">
                <Col md={8} offset={16}>
                    <ProjectSelector projectChangeCallback={projectChangeCallback} />
                </Col>
            </div>
            <Card className="ant-card gx-card-widget">
                <div className="ant-card-head gx-pt-0">
                    <div className="ant-card-head-wrapper">
                        <div className="ant-card-head-title gx-text-left">
                            <h4 className="gx-card-bordered-title">
                                <i className="icon icon-pricing-table gx-mr-3" />
                                Quotations Per Project
                            </h4>
                        </div>
                    </div>
                </div>
                {
                    buyerId && selectedProject ?
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
                        : <NoDataAvailable />
                }
            </Card>
        </React.Fragment>
    );
};

const QuotationsPerProject = (props) => (<ProjectProvider>
    <QuotationsPerProjectDashboard {...props} />
</ProjectProvider>)
export default QuotationsPerProject;

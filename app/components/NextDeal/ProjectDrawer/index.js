import React, { useState, useEffect } from 'react';
import { Button, Drawer } from 'antd';
import CustomScrollbars from '../../../../util/CustomScrollbars';
import { useProject } from '../../../../contexts/projects';
import IntlMessages from '../../../../util/IntlMessages';
import { formatAmount } from '../../../../util/util';
import moment from 'moment';
import { FormOutlined } from '@ant-design/icons';

const ProjectDrawer = ({ isCustomizerOpened, onClose, projectId }) => {

  const [projectDetails, setProjectDetails] = useState(null);
  const { getProjectById } = useProject();

  const toggleCustomizer = () => {
    onClose();
  };

  useEffect(() => {
    console.log(projectId)
    if (projectId) {
      getProjectById(projectId, (projectData) => {
        console.log(projectData)
        setProjectDetails(projectData)
      })
    } else {
      setProjectDetails(null)
    }
  }, [projectId]);

  const getCustomizerContent = () => {
    return (
      <CustomScrollbars className="gx-customizer">
        {
          <div className="gx-px-2 gx-pt-2">
            <Button type="primary" className="gx-btn gx-w-100 gx-mb-4 nd-add-quote">
              <FormOutlined style={{ fontSize: '14px', marginRight: '5px' }} />
              <IntlMessages id="app.common.edit" />
            </Button>
          </div>
        }
        {
          projectDetails ?
            <div className="gx-p-2">
              {
                projectDetails.name ?
                  <p className="gx-mb-1"><IntlMessages id="app.project.field.projectname" />: <br /><span className='gx-text-grey'>{projectDetails.name}</span></p>
                  : null
              }
              {projectDetails.estimatedBudget || projectDetails.currency ?
                <p className="gx-mb-1">
                  <IntlMessages id="app.project.field.estimatedBudget" />:
                  <br />
                  <span className='gx-text-grey'>
                    {projectDetails.estimatedBudget ? <>{' '}{formatAmount(`${projectDetails.estimatedBudget}`)}</> : null}
                    {projectDetails.currency ? <span className="gx-text-grey gx-fs-sm gx-text-uppercase">
                      {' '}
                      {projectDetails.currency}
                    </span>
                      : null}
                  </span></p>
                : null}
              {
                projectDetails.startDate ?
                  <p className="gx-mb-1"><IntlMessages id="app.project.field.startdate" />: <br /><span className='gx-text-grey'>{moment(projectDetails.startDate).format('DD-MM-YYYY')}</span></p>
                  : null
              }
              {
                projectDetails.expectedEndDate ?
                  <p className="gx-mb-1"><IntlMessages id="app.project.field.projectenddate" />: <br /><span className='gx-text-grey'>{moment(projectDetails.expectedEndDate).format('DD-MM-YYYY')}</span></p>
                  : null
              }
              {
                projectDetails.costCenter ?
                  <p className="gx-mb-1"><IntlMessages id="app.project.field.costcenter" />: <br /><span className='gx-text-grey'>{projectDetails.costCenter}</span></p>
                  : null
              }
              {
                projectDetails.managerName ?
                  <p className="gx-mb-1"><IntlMessages id="app.project.field.manager" />: <br /><span className='gx-text-grey'>{projectDetails.managerName}</span></p>
                  : null
              }
              {
                projectDetails.description ?
                  <p className="gx-mb-1"><IntlMessages id="app.project.field.projectDescription" />: <br /><span className='gx-text-grey'>{projectDetails.description}</span></p>
                  : null
              }
            </div>
            : null
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
      >
        {getCustomizerContent()}
      </Drawer>
    </>
  );
};

export default ProjectDrawer;

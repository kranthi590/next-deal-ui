import React from 'react';
import { ProjectProvider } from '../../contexts/projects';
import createProject from '../../routes/NewProject';

const CreateProjectPage = () => (
  <ProjectProvider>
    <createProject />
  </ProjectProvider>
);

export default CreateProjectPage;

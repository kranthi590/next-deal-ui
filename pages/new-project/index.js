import React from 'react';
import NewProject from '../../routes/NewProject'
import { ProjectProvider } from "../../util/projects";


const NewProjectPage = () => (
  <ProjectProvider>
    <NewProject />
  </ProjectProvider>
);

export default NewProjectPage;

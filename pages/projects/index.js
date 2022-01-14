import React, { Fragment } from 'react';
import Projects from '../../routes/Projects';
import { ProjectProvider } from '../../contexts/projects';
import { handleApiErrors, httpClient, setApiContext } from '../../util/Api';

const ProjectsPage = props => {
  return (
    <Fragment>
      <ProjectProvider>
        <Projects {...props} />
      </ProjectProvider>
    </Fragment>
  );
};

export default ProjectsPage;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  let projectsList = null;
  try {
    const headers = setApiContext(req, res, query);
    const response = await httpClient.get(`projects?size=10&offset=0`, {
      headers,
    });
    projectsList = response.data.data;
  } catch (error) {
    handleApiErrors(req, res, query, error);
  }
  return {
    props: {
      projectsList: projectsList.rows,
      totalCount: projectsList.count,
    },
  };
}

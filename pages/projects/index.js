import React from "react";
import Head from "next/head";
import Projects from "../../routes/Projects";
import {ProjectProvider} from "../../util/projects";
import IntlMessages from "../../util/IntlMessages";


const ProjectsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>
          <IntlMessages id="sidebar.project.Projects" />
        </title>
      </Head>
      <ProjectProvider>
        <Projects/>
      </ProjectProvider>
    </React.Fragment>
  );
};

export default ProjectsPage;

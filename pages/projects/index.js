import React from "react";
import Head from "next/head";
import Projects from "../../routes/Projects";
import {ProjectProvider} from "../../util/projects";


const ProjectsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Projects</title>
      </Head>
      <ProjectProvider>
        <Projects/>
      </ProjectProvider>
    </React.Fragment>
  );
};

export default ProjectsPage;

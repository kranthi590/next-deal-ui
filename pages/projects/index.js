import Head from 'next/head';
import asyncComponent from "../../util/asyncComponent";
import React from "react";

const Projects = asyncComponent(() => import('../../routes/Projects'));

const ProjectsPage = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Projects</title>
      </Head>
      <Projects/>
    </React.Fragment>
  );
}

export default ProjectsPage;

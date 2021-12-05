import React from "react";
import asyncComponent from "../../util/asyncComponent";
import { ProjectProvider } from "../../util/project";

const CreateProject = asyncComponent(() =>
  import("../../routes/CreateProject")
);

const CreateProjectPage = () => (
  <ProjectProvider>
    <CreateProject />
  </ProjectProvider>
);

export default CreateProjectPage;

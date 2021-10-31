import React, { useState, useContext, createContext } from "react";
import { httpClient } from "../util/Api";

const projectContext = createContext({});

export function ProjectProvider({ children }) {
  const project = useProviderProject();
  return (
    <projectContext.Provider value={project}>
      {children}
    </projectContext.Provider>
  );
}

export const useProject = () => {
  return useContext(projectContext);
};

const useProviderProject = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStart = () => {
    setLoading(true);
    setError("");
  };

  const fetchSuccess = () => {
    setLoading(false);
    setError("");
  };

  const fetchError = (error) => {
    setLoading(false);
    setError(error);
  };

  const newProject = (data, callbackFun) => {
    fetchStart();
    httpClient
      .post("project/create", data)
      .then(({ data }) => {
        if (data) {
          fetchSuccess();
          if (callbackFun) callbackFun(data.data);
        } else {
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        fetchError(error.message);
      });
  };

  return {
    isLoading,
    error,
    newProject,
  };
};

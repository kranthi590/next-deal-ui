import React, { useState, useContext, createContext } from 'react';
import { httpClient, setAuthToken } from '../util/Api';
import { Cookies } from 'react-cookie';
import { errorNotification, handleErrorNotification } from '../util/util';

const projectContext = createContext({});

export function ProjectProvider({ children }) {
  const project = useProviderProject();
  return <projectContext.Provider value={project}>{children}</projectContext.Provider>;
}

export const useProject = () => {
  return useContext(projectContext);
};

const useProviderProject = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStart = () => {
    setLoading(true);
    setError('');
  };

  const fetchSuccess = () => {
    setLoading(false);
    setError('');
  };

  const fetchError = error => {
    setLoading(false);
    setError(error);
  };

  const newProject = (data, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    const buyerId = cookie.get('buyerId');
    httpClient
      .post(
        `projects`,
        { ...data },
        {
          headers: headers,
        },
      )
      .then(({ data }) => {
        if (data) {
          fetchSuccess();
          if (callbackFun) callbackFun(data.data);
        } else {
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        handleErrorNotification(error);
        fetchError(error.message);
      });
  };

  const getProjectById = (id, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    httpClient
      .get(`projects/${id}`, {
        headers: headers,
      })
      .then(({ data }) => {
        if (data) {
          fetchSuccess();
          if (callbackFun) callbackFun(data.data);
        } else {
          errorNotification(data.error, 'app.registration.errorMessageTitle');
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        errorNotification(error.message, 'app.registration.errorMessageTitle');
        fetchError(error.message);
      });
  };

  return {
    isLoading,
    error,
    newProject,
    getProjectById,
  };
};

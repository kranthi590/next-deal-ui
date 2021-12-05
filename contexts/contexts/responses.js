import React, { useState, useContext, createContext } from "react";
import { httpClient, setAuthToken } from "../util/Api";
import { Cookies } from "react-cookie";

const responsesContext = createContext({});

export function ResponsesProvider({ children }) {
  const project = useProviderResponses();
  return (
    <responsesContext.Provider value={project}>
      {children}
    </responsesContext.Provider>
  );
}

export const useResponse = () => {
  return useContext(responsesContext);
};

const useProviderResponses = () => {
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

  const createResponses = (id, data, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies()
    httpClient
      .post(`quotations/${id}/responses`, data, {
        headers: headers
      })
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
  const createAward = (id, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies()
    httpClient
      .post(`quotations/${id}/award`, {}, {
        headers: headers
      })
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
  const completeQuotation = (id, data, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies()
    httpClient
      .post(`quotations/${id}/complete`, data, {
        headers: headers
      })
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
    createResponses,
    createAward,
    completeQuotation
  };
};

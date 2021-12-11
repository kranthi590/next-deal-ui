import React, {useState, useContext, createContext} from "react";
import {httpClient, setAuthToken} from "../util/Api";
import {Cookies} from "react-cookie";
import {errorNotification} from "../util/util";

const quotationContext = createContext({});

export function QuotationProvider({children}) {
  const project = useProviderQuotation();
  return (
    <quotationContext.Provider value={project}>
      {children}
    </quotationContext.Provider>
  );
}

export const useQuotation = () => {
  return useContext(quotationContext);
};

const useProviderQuotation = () => {
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

  const createQuotation = (id, data, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies()
    httpClient
      .post(`projects/${id}/quotations`,  data,{
        headers: headers
      })
      .then(({data}) => {
        if (data) {
          fetchSuccess();
          if (callbackFun) callbackFun(data.data);
        } else {
          errorNotification(data.error, "app.registration.errorMessageTitle")
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        errorNotification(error.message, "app.registration.errorMessageTitle")
        fetchError(error.message);
      });
  };

  return {
    isLoading,
    error,
    createQuotation
  };
};

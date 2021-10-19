import React, { useState, useContext, createContext } from "react";
import { httpClient } from "./Api";

const registrationContext = createContext({});

export function RegistrationProvider({ children }) {
  const registration = useProviderRegistration();
  return (
    <registrationContext.Provider value={registration}>
      {children}
    </registrationContext.Provider>
  );
}

export const useRegistration = () => {
  return useContext(registrationContext);
};

const useProviderRegistration = () => {
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

  const fetchRegions = (callbackFun) => {
    fetchStart();
    httpClient
      .get(`${process.env.NEXT_PUBLIC_API_HOST}config/countries/cl/regions`)
      .then(({ data }) => {
        if (data.data) {
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

  const fetchCommune = ({ regionId }, callbackFun) => {
    fetchStart();
    httpClient
      .get(
        `${process.env.NEXT_PUBLIC_API_HOST}config/countries/cl/regions/${regionId}/comunas`
      )
      .then(({ data }) => {
        if (data.data) {
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

  const registerBuyer = (data, callbackFun) => {
    fetchStart();
    httpClient
      .post("buyer/register", data)
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
    fetchRegions,
    fetchCommune,
    registerBuyer,
  };
};

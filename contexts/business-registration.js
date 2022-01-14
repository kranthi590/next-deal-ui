import React, { useState, useContext, createContext } from 'react';
import { httpClient, setAuthToken } from '../util/Api';
import { Cookies } from 'react-cookie';
import { errorNotification, handleErrorNotification } from '../util/util';

const registrationContext = createContext({});

export function RegistrationProvider({ children }) {
  const registration = useProviderRegistration();
  return (
    <registrationContext.Provider value={registration}>{children}</registrationContext.Provider>
  );
}

export const useRegistration = () => {
  return useContext(registrationContext);
};

const useProviderRegistration = () => {
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

  const fetchRegions = callbackFun => {
    fetchStart();
    httpClient
      .get('config/countries/cl/regions')
      .then(({ data }) => {
        if (data.data) {
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

  const fetchCommune = ({ regionId }, callbackFun) => {
    fetchStart();
    httpClient
      .get(`config/countries/cl/regions/${regionId}/comunas`)
      .then(({ data }) => {
        if (data.data) {
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

  const registerBuyer = (data, callbackFun) => {
    fetchStart();
    httpClient
      .post('buyers', data)
      .then(({ data }) => {
        if (data.data) {
          fetchSuccess();
          if (callbackFun) callbackFun(data.data);
        } else {
          errorNotification(data.error, 'app.registration.errorMessageTitle');
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        handleErrorNotification(error);
        fetchError(error.message);
      });
  };

  const registerSupplier = (data, isBuyer, callbackFun) => {
    fetchStart();
    if (data && isBuyer) {
      const headers = setAuthToken();
      const cookie = new Cookies();
      const buyerId = cookie.get('buyerId');
      httpClient
        .post(`buyers/${buyerId}/suppliers`, data, { headers })
        .then(({ data }) => {
          if (data.data) {
            fetchSuccess();
            if (callbackFun) callbackFun(data.data);
          } else {
            errorNotification(data.error, 'app.registration.errorMessageTitle');
            fetchError(data.error);
          }
        })
        .catch(function (error) {
          handleErrorNotification(error);
          fetchError(error.message);
        });
    } else {
      httpClient
        .post('suppliers', data)
        .then(({ data }) => {
          if (data) {
            fetchSuccess();
            if (callbackFun) callbackFun(data.data);
          } else {
            errorNotification(error.message, 'app.registration.errorMessageTitle');
            fetchError(data.error);
          }
        })
        .catch(function (error) {
          handleErrorNotification(error);
          fetchError(error.message);
        });
    }
  };

  const uploadSupplierLogo = (data, callbackFun) => {
    fetchStart();
    httpClient
      .post('suppliers/files', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

  const getBuyerSuppliers = callbackFun => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    const buyerId = cookie.get('buyerId');
    httpClient
      .get(`buyers/${buyerId}/suppliers`, { headers })
      .then(({ data }) => {
        if (data.data) {
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

  const getSupplier = (supplierId, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    httpClient
      .get(`suppliers/${supplierId}`, { headers })
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

  return {
    isLoading,
    error,
    fetchRegions,
    fetchCommune,
    registerBuyer,
    registerSupplier,
    uploadSupplierLogo,
    getBuyerSuppliers,
    getSupplier,
  };
};

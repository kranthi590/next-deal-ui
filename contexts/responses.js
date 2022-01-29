import React, { useState, useContext, createContext } from 'react';
import { httpClient, setAuthToken } from '../util/Api';
import { Cookies } from 'react-cookie';
import { handleErrorNotification } from '../util/util';

const responsesContext = createContext({});

export function ResponsesProvider({ children }) {
  const project = useProviderResponses();
  return <responsesContext.Provider value={project}>{children}</responsesContext.Provider>;
}

export const useResponse = () => {
  return useContext(responsesContext);
};

const useProviderResponses = () => {
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

  const createResponses = (id, data, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    httpClient
      .post(`quotations/${id}/responses`, data, {
        headers: headers,
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
        handleErrorNotification(error);
        fetchError(error.message);
      });
  };
  const createAward = (id, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    httpClient
      .post(
        `quotations/${id}/award`,
        {},
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
  const completeQuotation = (id, data, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    httpClient
      .post(`quotations/${id}/complete`, data, {
        headers: headers,
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
        handleErrorNotification(error);
        fetchError(error.message);
      });
  };

  const deAwardQuotation = (id, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    // implement deaward api
    httpClient
      .post(
        `quotations/${id}/retain`,
        {},
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

  const abortQuotation = (id, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    httpClient
      .post(
        `quotations/${id}/abort`,
        {},
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

  const getQuotationsByPagination = (pid, type, size, offset, callbackFun) => {
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    httpClient
      .get(`projects/${pid}/quotations?status=${type}&size=${size}&offset=${offset}`, {
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
        handleErrorNotification(error);
        fetchError(error.message);
      });
  };
  const getQuotationsForCalendar = (pid, startdate, enddate, callbackFun) => {
    const eventsdata = [
      {
        id: 0,
        start: '2022-01-11T00:00:00.000Z',
        end: '2022-02-25T00:00:00.000Z',
        quotationName: 'Flooring',
        supplier: 'Sai raj',
      },
      {
        id: 1,
        start: '2022-01-02T00:00:00.000Z',
        end: '2022-02-25T00:00:00.000Z',
        quotationName: 'Man power',
        supplier: 'Ram',
      },
      {
        id: 2,
        start: '2022-01-11T00:00:00.000Z',
        end: '2022-02-25T00:00:00.000Z',
        quotationName: 'Carpentry Work',
        supplier: 'Ram',
      },
      {
        id: 3,
        start: '2022-02-11T00:00:00.000Z',
        end: '2022-02-25T00:00:00.000Z',
        quotationName: 'Fall ceiling',
        supplier: 'Ram',
      },
    ];
    fetchStart();
    const headers = setAuthToken();
    const cookie = new Cookies();
    if (callbackFun) {
      callbackFun(eventsdata);
    }

    // httpClient
    //   .get(`projects/${pid}/quotations`, {
    //     headers: headers,
    //   })
    //   .then(({ data }) => {
    //     if (data) {
    //       fetchSuccess();
    //       if (callbackFun) callbackFun(data.data);
    //     } else {
    //       errorNotification(data.error, 'app.registration.errorMessageTitle');
    //       fetchError(data.error);
    //     }
    //   })
    //   .catch(function (error) {
    //     handleErrorNotification(error);
    //     fetchError(error.message);
    //   });
  };

  return {
    isLoading,
    error,
    createResponses,
    createAward,
    completeQuotation,
    deAwardQuotation,
    abortQuotation,
    getQuotationsByPagination,
    getQuotationsForCalendar,
  };
};

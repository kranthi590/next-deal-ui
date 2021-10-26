import React, { useState, useEffect, useContext, createContext } from "react";
import { httpClient, setAuthToken } from "./Api";
import { Cookies } from "react-cookie";
import {getData, removeData, setData} from "./localStorage";

const authContext = createContext({});

// Provider component that wraps app and makes auth object ..
// ... available to any child component that calls useAuth().

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.

export const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoadingUser, setLoadingUser] = useState(true);
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

  const userLogin = (data, callbackFun) => {
    fetchStart();
    httpClient
      .post("user/login", data)
      .then(({ data: {data} }) => {
        if (data) {
          fetchSuccess();
          const cookies = new Cookies();
          let expiryTime = new Date();
          expiryTime.setDate(expiryTime.getDate() + 1);
          cookies.set("token", data.token, {
            path: '/',
            expires: expiryTime,
            secure: true,
            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
          });
          setAuthUser(data.user);
          if (callbackFun) callbackFun();
        } else {
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        fetchError(error.message);
      });
  };

  const userSignup = (data, callbackFun) => {
    fetchStart();
    httpClient
      .post("user/register", data)
      .then(({ data }) => {
        if (data) {
          fetchSuccess();
          console.log("coming")
          if (callbackFun) callbackFun(data);
        } else {
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        fetchError(error.message);
      });
  };

  const userSignOut = (callbackFun) => {
    fetchStart();
    try {
          fetchSuccess();
          setAuthUser(false);
          setAuthToken("");
      removeData('user');
          const cookies = new Cookies();
          cookies.remove("token");
          if (callbackFun) callbackFun();
    } catch (error) {
      setLoadingUser(false);
        fetchError(error.message);
    }
  };

  const getAuthUser = () => {
    fetchStart();
    httpClient
      .post("auth/me")
      .then(({ data }) => {
        if (data.user) {
          fetchSuccess();
          setAuthUser(data.user);
        } else {
          fetchError(data.error);
        }
      })
      .catch(function (error) {
        setAuthToken("");
        // httpClient.defaults.headers.common['Authorization'] = '';
        fetchError(error.message);
      });
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  //TODO:: Auth Checking Starts From Here
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    setAuthToken(token);
    try {
      if (token){
        setLoadingUser(false);
        const getUserData = getData('user')
        setAuthUser(getUserData);
      } else {
        cookies.remove("token");
        setAuthToken("");
        setAuthUser("");
        removeData('user');
        setLoadingUser(false);
      }
    } catch (e) {
      cookies.remove("token");
      setAuthToken("");
      // httpClient.defaults.headers.common['Authorization'] = '';
      setLoadingUser(false);
    }
  }, []);

  // Return the user object and auth methods
  return {
    isLoadingUser,
    isLoading,
    authUser,
    error,
    setAuthUser,
    getAuthUser,
    userLogin,
    userSignup,
    userSignOut,
  };
};

export const isUnRestrictedRoute = (pathname) => {
  return (
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/buyer-registration" ||
    pathname === "/supplier-registration"
  );
};

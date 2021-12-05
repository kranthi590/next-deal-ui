import React, { useState, useEffect, useContext, createContext } from "react";
import { httpClient, setAuthToken } from "../util/Api";
import { Cookies } from "react-cookie";
import { removeData, setData } from "../util/localStorage";

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
    const cookies = new Cookies();
    fetchStart();
    httpClient
      .post("users/login", data)
      .then(({ data: { data } }) => {
        if (data) {
          fetchSuccess();
          document.cookie = `token=${data.token}; path=/;domain=${process.env.NEXT_PUBLIC_APP_HOST}`;
          cookies.set("token", data.token || "", {
            path: "/",
            domain: process.env.NEXT_PUBLIC_APP_HOST,
          });
          cookies.set("buyerId", data.user.buyerId || "", {
            path: "/",
            domain: process.env.NEXT_PUBLIC_APP_HOST,
          });
          cookies.set("userId", data.user.id || "", {
            path: "/",
            domain: process.env.NEXT_PUBLIC_APP_HOST,
          });
          window.location.href = `http://${data.user.buyer.subDomainName}${process.env.NEXT_PUBLIC_APP_HOST}/app`;
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
    const headers = setAuthToken();
    httpClient
      .post("users", data, {
        headers: headers,
      })
      .then(({ data }) => {
        if (data) {
          fetchSuccess();
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
      const cookies = new Cookies();
      cookies.remove("token", {
        path: "/",
        domain: process.env.NEXT_PUBLIC_APP_HOST,
      });
      cookies.remove("buyerId", {
        path: "/",
        domain: process.env.NEXT_PUBLIC_APP_HOST,
      });
      cookies.remove("userId", {
        path: "/",
        domain: process.env.NEXT_PUBLIC_APP_HOST,
      });
      removeData("user");
      window.location.href = "/app/signin";
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

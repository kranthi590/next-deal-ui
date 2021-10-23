import React from 'react';
import SignInPage from "./signin";
import {useAuth} from "../util/use-auth";
import DashboardPage from "./dashboard";

const homePage = () => {
  const {authUser} = useAuth();

  return authUser ? <DashboardPage/> : <SignInPage/>;
}

export default homePage;

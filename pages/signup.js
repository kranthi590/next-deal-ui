import React from 'react';
import asyncComponent from "../util/asyncComponent";

const SignUp = asyncComponent(() => import('../routes/SignUp'));

const SignUpPage = () => <SignUp/>;

export default SignUpPage;

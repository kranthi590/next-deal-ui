import React from 'react';
import asyncComponent from '../../util/asyncComponent'

const Dashboard = asyncComponent(() => import('../../routes/CreateProject'));

const DashboardPage = () => <Dashboard/>;

export default DashboardPage;

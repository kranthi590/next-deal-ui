import React from 'react';
import asyncComponent from '../../util/asyncComponent'

const Dashboard = asyncComponent(() => import('../../routes/Dashboard'));

const DashboardPage = () => <Dashboard/>;

export default DashboardPage;

import React from 'react';
import Head from 'next/head';
import withRedux from 'next-redux-wrapper';
//import '../public/vendors/react-notification/react-notifications.css';
import 'antd/dist/antd.css';

import '../public/vendors/style';
import '../styles/style.css';

import initStore from '../redux/store';
import { Provider } from 'react-redux';
import LocaleProvider from '../app/core/LocaleProvider';
import { AuthProvider } from '../contexts/use-auth';
import Layout from '../app/core/Layout';
import '../static/index.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-perfect-scrollbar/dist/css/styles.min.css';
const Page = ({ Component, pageProps, store }) => {
  return (
    <React.Fragment>
      <Head>
        <title>NextDeal- Admin Dashboard</title>
      </Head>
      <Provider store={store}>
        <AuthProvider>
          <LocaleProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LocaleProvider>
        </AuthProvider>
      </Provider>
    </React.Fragment>
  );
};

export default withRedux(initStore)(Page);

import React from 'react';
import Head from 'next/head';
import withRedux from 'next-redux-wrapper';
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
import { useRouter } from 'next/router';
const Page = ({ Component, pageProps, store }) => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = url => {
      window.gtag('config', 'G-JFLD24SWY4', {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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

import Document, { Head, Html, Main, NextScript } from 'next/document';

const isProduction = process.env.NEXT_PUBLIC_APP_HOST === '.nextdeal.cl';
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" data-direction="rtl">
        <Head>
          <link rel="shortcut icon" href="/app/nd-favicon.png" />
          <link rel="stylesheet" href="/app/vendors/gaxon/styles.css" />
          <link rel="stylesheet" href="/app/vendors/flag/sprite-flags-24x24.css" />
          <link rel="stylesheet" href="/app/vendors/noir-pro/styles.css" />
          <link rel="stylesheet" href="/app/vendors/react-notification/react-notifications.css" />
          {isProduction && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id='G-JFLD24SWY4'`} />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                              window.dataLayer = window.dataLayer || [];
                              function gtag(){dataLayer.push(arguments);}
                              gtag('js', new Date());
                              gtag('config', 'G-JFLD24SWY4', {
                                page_path: window.location.pathname,
                              });
                            `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

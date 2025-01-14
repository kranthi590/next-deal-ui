import React from 'react';
import IntlMessages from '../../../util/IntlMessages';

import './index.css';

const Aside = ({ heading, content, url }) => {
  return (
    <div className="gx-app-logo-content aside">
      <div className="heading-wrapper">
        <h1 className="aside-heading">
          <IntlMessages id={heading} />
          <a className="gx-site-logo" href={url}>
            <img
              alt="logo2"
              src="/app/images/nd-logo.png"
              width="180"
              className="img-fluid main-logo"
            />
          </a>
        </h1>
        <p className="aside-text">
          <IntlMessages id={content} />
        </p>
      </div>
      <div className="image-wrapper">
        <img src="/app/images/13.png" alt="Neature" />
      </div>
    </div>
  );
};

export default Aside;

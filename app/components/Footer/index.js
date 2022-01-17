import React from 'react';
import Link from 'next/link';
import IntlMessages from '../../../util/IntlMessages';

const links = [
  { url: 'https://nextdeal.xyz', label: <IntlMessages id="app.common.text.home" /> },
  { url: 'https://nextdeal.xyz/about-us', label: <IntlMessages id="app.common.text.about" /> },
  { url: 'https://nextdeal.xyz/terms', label: <IntlMessages id="app.common.text.terms" /> },
  { url: 'https://nextdeal.xyz/contact-us', label: <IntlMessages id="app.common.text.contact" /> },
];

const FooterComponent = () => (
  <div className="footer">
    {links &&
      links.map((link, index) => (
        <Link key={index} href={link.url}>
          <a>{link.label}</a>
        </Link>
      ))}
  </div>
);

export default FooterComponent;

import React from 'react';
import Link from 'next/link';
import IntlMessages from '../../../util/IntlMessages';

const links = [
  {
    url: `https://${process.env.NEXT_PUBLIC_WEB_HOST}`,
    label: <IntlMessages id="app.common.text.home" />,
  },
  {
    url: `https://${process.env.NEXT_PUBLIC_WEB_HOST}/about-us`,
    label: <IntlMessages id="app.common.text.about" />,
  },
  {
    url: `https://${process.env.NEXT_PUBLIC_WEB_HOST}/privacy-policy`,
    label: <IntlMessages id="app.common.text.privacyPolicy" />,
  },
  {
    url: `https://${process.env.NEXT_PUBLIC_WEB_HOST}/contact-us`,
    label: <IntlMessages id="app.common.text.contact" />,
  },
];

const FooterComponent = () => (
  <div className="footer">
    {links &&
      links.map((link, index) => (
        <Link key={index} href={link.url}>
          <a target="_blank">{link.label}</a>
        </Link>
      ))}
  </div>
);

export default FooterComponent;

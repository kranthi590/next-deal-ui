import React from "react";
import Link from "next/link";

const links = [
  { url: "https://nextdeal.dev/about-us", label: "About" },
  { url: "https://nextdeal.dev/terms", label: "Terms" },
  { url: "https://nextdeal.dev/contact-us", label: "Contact" },
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

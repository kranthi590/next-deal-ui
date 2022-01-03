import React from "react";
import Link from "next/link";

const links = [
  { url: "https://nextdeal.xyz", label: "Home" },
  { url: "https://nextdeal.xyz/about-us", label: "About" },
  { url: "https://nextdeal.xyz/terms", label: "Terms" },
  { url: "https://nextdeal.xyz/contact-us", label: "Contact" },
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

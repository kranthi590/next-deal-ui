import React from "react";
import Link from "next/link";

const links = [
  { url: "/about", label: "About" },
  { url: "/support", label: "Support" },
  { url: "/purchase", label: "Purchase" },
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

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from 'antd';
{
  /* 
<BreadCrumb navItems={[{ text:"Home", route:"/" },{ text:"Projects", route:"/app/projects" }]}/> 
*/
}
const BreadCrumbItem = ({ item, x }) => {
  const { text, icon, route } = item;
  return (
    <span className={route ? 'gx-link' : ''}>
      {icon && icon}
      <span className={icon ? 'gx-ml-2' : ''}>{text && text}</span>
    </span>
  );
};

const BreadCrumb = ({ navItems }) => {
  return (
    <Breadcrumb className="gx-mb-4">
      {navItems.map((item, index) => {
        const { route } = item;
        return (
          <Breadcrumb.Item key={index}>
            {route ? (
              <Link href={route} passHref>
                <a>
                  <BreadCrumbItem item={item} x={1} />
                </a>
              </Link>
            ) : (
              <BreadCrumbItem item={item} />
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadCrumb;

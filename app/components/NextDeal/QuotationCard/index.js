import React, { useState } from 'react';
import Widget from '../../Widget';
import Link from 'next/link';
import { useRouter } from 'next/router';
const QuotationCard = ({ data, activeTab }) => {
  let navTo = '';
  if (activeTab) {
    navTo = '#' + activeTab;
  }

  const router = useRouter();
  return (
    <>
      <Widget styleName={`gx-card-full gx-card-quote-border gx-mb-3`}>
        <h2 className="h3 gx-mb-2 gx-pt-2 gx-show-hand">
          <Link
            href={'/projects/' + [router.query.id] + '/' + [data.id] + '/quote-response' + navTo}
          >
            {data.name}
          </Link>
        </h2>
        <div className="gx-currentplan-row gx-card-full">
          <div className="gx-currentplan-col">
            <h2 className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">
              {data.quotationsCount}
              <sub className="gx-fs-md gx-bottom-0">/Responses</sub>
            </h2>
          </div>
          <div className="gx-currentplan-col gx-currentplan-right">
            <h2 className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">
              {data.suppliersCount}
              <sub className="gx-fs-md gx-bottom-0">/Suppliers</sub>
            </h2>
          </div>
        </div>
      </Widget>
    </>
  );
};

export default QuotationCard;

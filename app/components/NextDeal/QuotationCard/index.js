import React from 'react';
import Widget from '../../Widget';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IntlMessages from '../../../../util/IntlMessages';
const QuotationCard = ({ data, activeTab }) => {
  let navTo = '';
  if (activeTab) {
    navTo = '#' + activeTab;
  }

  const router = useRouter();
  const MyButton = React.forwardRef(({ onClick, href }, ref) => {
    return (
      <a href={href} onClick={onClick} ref={ref}>
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
              <sub className="gx-fs-md gx-bottom-0">
                /<IntlMessages id="app.common.responses" />
              </sub>
            </h2>
          </div>
          <div className="gx-currentplan-col gx-currentplan-right">
            <h2 className="gx-text-primary gx-fs-xlxl gx-font-weight-medium gx-mb-1">
              {data.suppliersCount}
              <sub className="gx-fs-md gx-bottom-0">
                /<IntlMessages id="app.common.suppliers" />
              </sub>
            </h2>
          </div>
        </div>
      </a>
    );
  });
  return (
    <>
      <Widget styleName={`gx-card-full gx-card-quote-border gx-mb-3`}>
        <Link href={'/projects/' + [router.query.id] + '/' + [data.id] + '/quote-response' + navTo}>
          <MyButton />
        </Link>
      </Widget>
    </>
  );
};

export default QuotationCard;

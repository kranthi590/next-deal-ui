import React from 'react';
const NoDataAvailable = ({ text = 'No data available', icon = 'icon-exclamation' }) => {
  return (
    <div className="gx-flex-column gx-align-items-center gx-p-2">
      <div className="gx-fs-xlxl">
        <i className={`icon ${icon} gx-text-muted`} />
      </div>
      <h2 className="gx-text-muted gx-text-center">{text}</h2>
    </div>
  );
};
export default NoDataAvailable;

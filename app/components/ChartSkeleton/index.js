import { Card, Skeleton, Space } from 'antd';

const ChartSkeleton = () => {
  return (
    <div>
      <Card>
        <div className="gx-d-flex">
          <div style={{ width: '60%' }}>
            <div className="gx-d-flex gx-justify-content-around gx-align-items-end gx-mx-auto">
              <Skeleton.Input style={{ height: 190, width: 20 }} active />
              <Skeleton.Input
                style={{ height: 80, width: 20 }}
                active
                className="gx-d-none gx-d-sm-block"
              />
              <Skeleton.Input style={{ height: 120, width: 20 }} active />
              <Skeleton.Input
                style={{ height: 210, width: 20 }}
                active
                className="gx-d-none gx-d-md-block"
              />
              <Skeleton.Input style={{ height: 200, width: 20 }} active />
              <Skeleton.Input style={{ height: 150, width: 20 }} active />
            </div>
          </div>
          <div style={{ width: '40%' }}>
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        </div>
      </Card>
      <Card>
        <div className="gx-d-flex gx-mx-auto">
          <div style={{ width: '25%' }}>
            <Skeleton.Button style={{ height: 20 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton.Button style={{ height: 20 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton.Button style={{ height: 20 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton.Button style={{ height: 20 }} active />
          </div>
        </div>

        <div className="gx-d-flex gx-justify-content-center gx-mx-auto">
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
        </div>
        <div className="gx-d-flex gx-justify-content-center gx-mx-auto">
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
        </div>
        <div className="gx-d-flex gx-justify-content-center gx-mx-auto">
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
          <div style={{ width: '25%' }}>
            <Skeleton paragraph={{ rows: 0 }} active />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChartSkeleton;

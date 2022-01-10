import React, { useState, useEffect } from 'react';
import { Badge, Tabs } from 'antd';
//import "./index.css";

const ProjectProgressTabs = props => {
  const { TabPane } = Tabs;
  const { tabsConfig, enableHash } = props;
  const [activeKey, setActiveKey] = useState(tabsConfig.defaultActiveKey);

  useEffect(() => {
    if (enableHash) {
      if (window.location.hash) {
        const tHash = window.location.hash.split('#')[1];
        setActiveKey(tHash);
      }
    }
  }, []);
  const onTabClick = tabKey => {
    window.location.hash = tabKey;
    setActiveKey(tabKey);
  };

  return (
    <Tabs
      defaultActiveKey={tabsConfig.defaultActiveKey}
      className="gx-pill-badge-tabs"
      activeKey={enableHash && activeKey}
      onTabClick={enableHash && onTabClick}
    >
      {tabsConfig.tabs.map(item => {
        return (
          <TabPane
            tab={
              <>
                {item.title}
                <Badge count={item.badgeCount} />
              </>
            }
            key={item.key}
          >
            {item.tabContentComponent}
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default ProjectProgressTabs;

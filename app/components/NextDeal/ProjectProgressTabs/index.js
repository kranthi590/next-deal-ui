import { Badge, Tabs } from "antd";
import "./index.css";

const ProjectProgressTabs = (props) => {
    const { TabPane } = Tabs;
    const { tabsConfig } = props;
    return (<Tabs defaultActiveKey={tabsConfig.defaultActiveKey} className="gx-pill-badge-tabs">
        {
            tabsConfig.tabs.map(item => {
                return (<TabPane
                    tab={
                        <>
                            {item.title}
                            <Badge count={item.badgeCount} />
                        </>
                    }
                    key={item.key}
                >
                    {item.tabContentComponent}
                </TabPane>)
            })
        }
    </Tabs>)
}

export default ProjectProgressTabs
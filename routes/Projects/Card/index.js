import React, { useState, useEffect } from 'react';
import { Col, Divider, Row, Skeleton } from 'antd';

// Components
import ContainerHeader from '../../../app/components/ContainerHeader';
import CardsListItem from './CardsListItem';

// Utils
import IntlMessages from '../../../util/IntlMessages';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useProject } from '../../../contexts/projects';

function CardList({ projects, loader, totalCount }) {
  const { getProjectsByPagination } = useProject();
  const [projectsList, setProjectsList] = useState(projects);
  const [size, setSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(projects.length);
  const [projectsCount, setProjectsCount] = useState(totalCount);
  const [showLoading, setSetShowLoading] = useState(false);

  const loadMoreProjects = () => {
    setSetShowLoading(true);
    getProjectsByPagination(size, projectsList.length, data => {
      setProjectsCount(data.count);
      setProjectsList(projectsList.concat(data.rows));
      setSetShowLoading(false);
    });
  };
  useEffect(() => {
    if (projectsCount === projectsList.length) {
      setHasMore(false);
    }
  }, [projectsList]);
  return (
    <InfiniteScroll
      dataLength={projectsList.length}
      next={loadMoreProjects}
      scrollableTarget="projectsScrollableWrapper"
      hasMore={hasMore}
      endMessage={
        <Divider>
          <IntlMessages id="app.project.noProjectsText" />
        </Divider>
      }
    >
      <div className="gx-module-list gx-mail-list">
        <Col span={24}>
          <ContainerHeader title={<IntlMessages id="sidebar.listType.cardListView" />} />
        </Col>
        <Col span={24}>
          {!loader &&
            projectsList &&
            projectsList.map((data, index) => (
              <CardsListItem key={index} data={data} styleName="gx-card-list" />
            ))}
          {(loader || showLoading) &&
            Array(10)
              .fill(1)
              .map((x, i) => (
                <Skeleton key={i} className="gx-mb-4" avatar active paragraph={{ rows: 2 }} />
              ))}
        </Col>
      </div>
    </InfiniteScroll>
  );
}

export default CardList;

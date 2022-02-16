import React, { useState, useEffect } from 'react';
import { Col, Divider, Row, Skeleton } from 'antd';

// Components
import ContainerHeader from '../../../app/components/ContainerHeader';
import CardsListItem from './CardsListItem';

// Utils
import IntlMessages from '../../../util/IntlMessages';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useProject } from '../../../contexts/projects';
import SweetAlert from 'react-bootstrap-sweetalert';
import { successNotification } from '../../../util/util';

function CardList({ projects, loader, totalCount }) {
  const { getProjectsByPagination, deleteProject } = useProject();
  const [projectsList, setProjectsList] = useState(projects);
  const [size, setSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(projects.length);
  const [projectsCount, setProjectsCount] = useState(totalCount);
  const [showLoading, setSetShowLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const onDeleteClick = pid => {
    setSelectedProject(pid);
    setShowDeleteAlert(true);
  };

  const onDeleteConfirmed = () => {
    deleteProject(selectedProject.id, data => {
      successNotification('app.registration.detailsSaveSuccessMessage');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
  };
  const onDeleteCancel = () => {
    setShowDeleteAlert(false);
    setSelectedProject(null);
  };

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
              <CardsListItem
                key={index}
                data={data}
                styleName="gx-card-list"
                onDeleteClick={onDeleteClick}
              />
            ))}
          {(loader || showLoading) &&
            Array(10)
              .fill(1)
              .map((x, i) => (
                <Skeleton key={i} className="gx-mb-4" avatar active paragraph={{ rows: 2 }} />
              ))}
        </Col>
      </div>
      <SweetAlert
        confirmBtnText={<IntlMessages id="button.delete" />}
        cancelBtnText={<IntlMessages id="button.cancel" />}
        show={showDeleteAlert}
        success
        title={selectedProject ? selectedProject.name : ''}
        onConfirm={onDeleteConfirmed}
        onCancel={onDeleteCancel}
        showCancel
        type="warning"
        customClass="gx-sweetalert-wrapper"
      >
        <div>
          <IntlMessages id="app.common.text.confirmDeleteProject" />
        </div>
      </SweetAlert>
    </InfiniteScroll>
  );
}

export default CardList;

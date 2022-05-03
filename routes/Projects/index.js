import React, { PureComponent } from 'react';
import { Button, Drawer, message } from 'antd';
import Link from 'next/link';
import CustomScrollbars from '../../util/CustomScrollbars';

import mails from './data/mails';
import IntlMessages from '../../util/IntlMessages';
import Card from './Card';
import { PlusOutlined } from '@ant-design/icons';
import ProjectDrawer from '../../app/components/NextDeal/ProjectDrawer';

class Projects extends PureComponent {
  ProjectSideBar = () => {
    return (
      <div className="gx-module-side">
        <div className="gx-module-side-header">
          <div className="gx-module-logo">
            <IntlMessages id="sidebar.project.Projects" />
          </div>
        </div>

        <div className="gx-module-side-content">
          <CustomScrollbars className="gx-module-side-scroll">
            <div className="gx-module-add-task">
              <Link href="/new-project">
                <Button type="primary" className="gx-btn-block nd-add-quote">
                  <PlusOutlined style={{ fontSize: '18px', marginRight: '5px' }} />
                  <IntlMessages id="sidebar.project.addProject" />
                </Button>
              </Link>
            </div>
          </CustomScrollbars>
        </div>
      </div>
    );
  };

  onLabelMenuItemSelect = e => {
    const id = +e.key;
    const mails = this.state.allMail.map(mail => {
      if (mail.selected && mail.folder === this.state.selectedFolder) {
        if (mail.labels.includes(id)) {
          return { ...mail, labels: this.removeLabel(mail, id) };
        } else {
          return { ...mail, labels: this.addLabel(mail, id) };
        }
      } else {
        return mail;
      }
    });
    this.setState({
      noContentFoundMessage: 'No Project found in selected label',
      alertMessage: 'Label Updated Successfully',
      showMessage: true,
      allMail: mails,
      folderMails: mails.filter(mail => mail.folder === this.state.selectedFolder),
    });
  };

  handleRequestClose = () => {
    this.setState({
      composeMail: false,
      showMessage: false,
    });
  };

  displayProjects = (projects, noContentFoundMessage, loader, totalCount, onViewClick) => {
    return (
      <div className="gx-module-box-column">
        {projects && projects.length === 0 ? (
          <div className="gx-no-content-found gx-text-light gx-d-flex gx-align-items-center gx-justify-content-center">
            {noContentFoundMessage}
          </div>
        ) : (
          <CustomScrollbars className="gx-module-side-scroll" sid="projectsScrollableWrapper">
            <Card
              projects={projects}
              loader={loader}
              totalCount={totalCount}
              onViewClick={onViewClick}
            />
          </CustomScrollbars>
        )}
      </div>
    );
  };

  constructor() {
    super();
    this.state = {
      searchMail: '',
      noContentFoundMessage: 'Todavía no has empezado ningún proyecto.',
      alertMessage: '',
      showMessage: false,
      drawerState: false,
      allMail: mails,
      loader: true,
      user: {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        avatar: 'https://via.placeholder.com/150x150',
      },
      selectedFolder: 0,
      composeMail: false,
      folderMails: mails.filter(mail => mail.folder === 0),
      openProjectDetails: false,
      activeProjectId: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ loader: false });
    }, 1500);
  }

  removeLabel(mail, label) {
    mail.labels.splice(mail.labels.indexOf(label), 1);
    if (this.state.currentMail !== null && mail.id === this.state.currentMail.id) {
      this.setState({
        currentMail: { ...mail, labels: mail.labels },
      });
    }
    return mail.labels;
  }

  addLabel(mail, label) {
    if (this.state.currentMail !== null && mail.id === this.state.currentMail.id) {
      this.setState({
        currentMail: { ...mail, labels: mail.labels.concat(label) },
      });
    }
    return mail.labels.concat(label);
  }

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState,
    });
  }

  handleViewClick = projectId => {
    this.setState({ openProjectDetails: true, activeProjectId: projectId });
  };

  onProjectDetailsClose() {
    this.setState({ openProjectDetails: false, activeProjectId: null });
  }

  render() {
    const {
      loader,
      drawerState,
      alertMessage,
      showMessage,
      noContentFoundMessage,
      openProjectDetails,
      activeProjectId,
    } = this.state;
    const { projectsList = [], totalCount = 0 } = this.props;
    return (
      <div className="gx-main-content">
        <div className="gx-app-module">
          <div className="gx-d-block gx-d-lg-none">
            <Drawer
              placement="left"
              closable={false}
              visible={drawerState}
              onClose={this.onToggleDrawer.bind(this)}
            >
              {this.ProjectSideBar()}
            </Drawer>
          </div>
          <div className="gx-module-sidenav gx-d-none gx-d-lg-flex">{this.ProjectSideBar()}</div>

          <div className="gx-module-box">
            <div className="gx-module-box-header">
              <span className="gx-drawer-btn gx-d-flex gx-d-lg-none">
                <i
                  className="icon icon-menu gx-icon-btn"
                  aria-label="Menu"
                  onClick={this.onToggleDrawer.bind(this)}
                />
              </span>
            </div>

            <div className="gx-module-box-content cards-wrapper">
              {this.displayProjects(
                projectsList,
                noContentFoundMessage,
                loader,
                totalCount,
                this.handleViewClick.bind(this),
              )}
            </div>
          </div>
        </div>
        {showMessage &&
          message.info(<span id="message-id">{alertMessage}</span>, 3, this.handleRequestClose)}
        <ProjectDrawer
          isCustomizerOpened={openProjectDetails}
          projectId={activeProjectId}
          onClose={this.onProjectDetailsClose.bind(this)}
        />
      </div>
    );
  }
}

export default Projects;

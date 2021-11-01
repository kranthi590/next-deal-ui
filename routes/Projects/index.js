import React, {PureComponent} from "react";
import {Button, Drawer, Menu, message} from "antd";
import Link from "next/link";
import CustomScrollbars from "../../util/CustomScrollbars";

import mails from "./data/mails";
import labels from "./data/labels";
import IntlMessages from "../../util/IntlMessages";
import CircularProgress from "../../app/components/CircularProgress";
import Card from "./Card";

import "./index.css";

class Projects extends PureComponent {
  ProjectSideBar = () => {
    return (
      <div className="gx-module-side">
        <div className="gx-module-side-header">
          <div className="gx-module-logo">
            <IntlMessages id="sidebar.project.Projects"/>
          </div>
        </div>

        <div className="gx-module-side-content">
          <CustomScrollbars className="gx-module-side-scroll">
            <div className="gx-module-add-task">
              <Link href="/new-project">
                <Button type="primary" className="gx-btn-block">
                  <i className="icon icon-add gx-mr-2"/>
                  <IntlMessages id="sidebar.project.addProject"/>
                </Button>
              </Link>
            </div>

            <ul className="gx-module-nav">
              <li className="gx-module-nav-label">
                <IntlMessages id="sidebar.project.filters"/>
              </li>

              {this.getNavLabels()}
            </ul>
          </CustomScrollbars>
        </div>
      </div>
    );
  };

  onLabelMenuItemSelect = (e) => {
    const id = +e.key;
    const mails = this.state.allMail.map((mail) => {
      if (mail.selected && mail.folder === this.state.selectedFolder) {
        if (mail.labels.includes(id)) {
          return {...mail, labels: this.removeLabel(mail, id)};
        } else {
          return {...mail, labels: this.addLabel(mail, id)};
        }
      } else {
        return mail;
      }
    });
    this.setState({
      noContentFoundMessage: "No Project found in selected label",
      alertMessage: "Label Updated Successfully",
      showMessage: true,
      allMail: mails,
      folderMails: mails.filter(
        (mail) => mail.folder === this.state.selectedFolder
      ),
    });
  };

  handleRequestClose = () => {
    this.setState({
      composeMail: false,
      showMessage: false,
    });
  };

  getNavLabels = () => {
    return labels.map((label, index) => (
      <li
        key={index}
        onClick={() => {
          const filterMails = this.state.allMail.filter(
            (mail) =>
              mail.labels.includes(label.id) &&
              mail.folder === this.state.selectedFolder
          );
          this.setState({
            loader: true,
            noContentFoundMessage: "No Projects found in selected label",
            folderMails: filterMails,
          });
          setTimeout(() => {
            this.setState({loader: false});
          }, 1500);
        }}
      >
        <span className="gx-link">
          <i className={`icon icon-tag gx-text-${label.color}`}/>
          <span>{label.title}</span>
        </span>
      </li>
    ));
  };


  displayProjects = (projects, noContentFoundMessage) => {
    return (
      <div className="gx-module-box-column">
        {
          projects && projects.length === 0 ? (
            <div
              className="gx-no-content-found gx-text-light gx-d-flex gx-align-items-center gx-justify-content-center">
              {noContentFoundMessage}
            </div>
          ) : (
            <Card projects={projects}/>
          )
        }
      </div>
    );
  };

  constructor() {
    super();
    this.state = {
      searchMail: "",
      noContentFoundMessage: "Todavía no has empezado ningún proyecto.",
      alertMessage: "",
      showMessage: false,
      drawerState: false,
      allMail: mails,
      loader: true,
      user: {
        name: "Robert Johnson",
        email: "robert@example.com",
        avatar: "https://via.placeholder.com/150x150",
      },
      selectedFolder: 0,
      composeMail: false,
      folderMails: mails.filter((mail) => mail.folder === 0),
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loader: false});
    }, 1500);
  }

  removeLabel(mail, label) {
    mail.labels.splice(mail.labels.indexOf(label), 1);
    if (
      this.state.currentMail !== null &&
      mail.id === this.state.currentMail.id
    ) {
      this.setState({
        currentMail: {...mail, labels: mail.labels},
      });
    }
    return mail.labels;
  }

  addLabel(mail, label) {
    if (
      this.state.currentMail !== null &&
      mail.id === this.state.currentMail.id
    ) {
      this.setState({
        currentMail: {...mail, labels: mail.labels.concat(label)},
      });
    }
    return mail.labels.concat(label);
  }

  updateSearch(evt) {
    this.setState({
      searchMail: evt.target.value,
    });
    this.searchMail(evt.target.value);
  }

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState,
    });
  }

  render() {
    const {
      loader,
      drawerState,
      folderMails,
      user,
      alertMessage,
      showMessage,
      noContentFoundMessage,
    } = this.state;
    const {projectsList = []} = this.props;
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
          <div className="gx-module-sidenav gx-d-none gx-d-lg-flex">
            {this.ProjectSideBar()}
          </div>

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
              {loader ? (
                <div className="gx-loader-view">
                  <CircularProgress/>
                </div>
              ) : (
                this.displayProjects(
                  projectsList,
                  noContentFoundMessage
                )
              )}
            </div>
          </div>
        </div>
        {showMessage &&
        message.info(
          <span id="message-id">{alertMessage}</span>,
          3,
          this.handleRequestClose
        )}
      </div>
    );
  }
}

export default Projects;

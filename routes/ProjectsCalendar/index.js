import React, { useState, useEffect } from 'react';
import ProjectSelector from '../../app/components/NextDeal/ProjectSelector';
import { ProjectProvider } from '../../contexts/projects';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Card } from 'antd';
import { ResponsesProvider, useResponse } from '../../contexts/responses';
const localizer = momentLocalizer(moment);

const ProjectsCalendarWrapper = () => {
  const { getQuotationsForCalendar } = useResponse();
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const monthStart = moment().startOf('month');
  const monthEnd = moment().endOf('month');
  const projectChangeCallback = projectId => {
    setSelectedProject(projectId);
  };

  const updateCalendarData = (start, end) => {
    getQuotationsForCalendar(selectedProject, start, end, data => {
      setEvents(data);
    });
  };

  const onRangeChange = data => {
    updateCalendarData(data.start, data.end);
  };

  useEffect(() => {
    updateCalendarData(monthStart, monthEnd);
  }, [selectedProject]);

  useEffect(() => {
    updateCalendarData(monthStart, monthEnd);
  }, [selectedProject]);

  return (
    <React.Fragment>
      <ProjectSelector projectChangeCallback={projectChangeCallback} />
      <Card className="gx-card">
        <Calendar
          localizer={localizer}
          events={events}
          onRangeChange={onRangeChange}
          titleAccessor={event => event.quotationName + ' - ' + event.supplier}
          popup={true}
        />
      </Card>
    </React.Fragment>
  );
};

const ProjectsCalendar = props => (
  <ProjectProvider>
    <ResponsesProvider>
      <ProjectsCalendarWrapper {...props} />
    </ResponsesProvider>
  </ProjectProvider>
);

export default ProjectsCalendar;

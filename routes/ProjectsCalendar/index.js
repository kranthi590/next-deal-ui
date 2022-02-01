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
  const [quotationStatus, setQuotationStatus] = useState('awarded');
  const [quotationsByPid, setQuotationsByPid] = useState([]);
  const monthStart = moment().startOf('month');
  const monthEnd = moment().endOf('month');
  const projectChangeCallback = projectId => {
    setSelectedProject(projectId);
  };

  const updateCalendarData = (start, end) => {
    getQuotationsForCalendar(
      selectedProject,
      moment(start).format('YYYY-MM-DD'),
      moment(end).format('YYYY-MM-DD'),
      data => {
        const newCalendarData = data.filter(item => item.quotation.project.id === selectedProject);
        const updatedCalendarData = newCalendarData.map(item => {
          const quoteendDate = item.deliveryDate || item.validityDate;
          return {
            id: item.id,
            start: moment(start).toDate(),
            end:
              moment(end).diff(moment(quoteendDate), 'days') > 1
                ? moment(end).toDate()
                : moment(quoteendDate).toDate(),
            quotationName: item.quotation.name,
            supplier: item.supplier.fantasyName,
            isAwarded: item.isAwarded,
          };
        });
        setQuotationsByPid(updatedCalendarData);
      },
    );
  };

  useEffect(() => {
    let updatedEvents = [];
    switch (quotationStatus) {
      case 'awarded':
        updatedEvents = quotationsByPid.filter(item => item.isAwarded);
        break;
      case 'unawarded':
        updatedEvents = quotationsByPid.filter(item => !item.isAwarded);
        break;
      default:
        updatedEvents = quotationsByPid;
        break;
    }
    setEvents(updatedEvents);
  }, [quotationStatus, quotationsByPid]);

  const onRangeChange = data => {
    updateCalendarData(data.start, data.end);
  };

  useEffect(() => {
    // updateCalendarData(data.start, data.end)
  }, [selectedProject]);

  useEffect(() => {
    updateCalendarData(monthStart, monthEnd);
  }, []);

  return (
    <React.Fragment>
      <ProjectSelector projectChangeCallback={projectChangeCallback} />
      <Card className="gx-card">
        <Calendar
          localizer={localizer}
          events={events}
          views={['month', 'week']}
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

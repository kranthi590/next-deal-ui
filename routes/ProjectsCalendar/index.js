import React, { useState, useEffect } from 'react';
import ProjectSelector from '../../app/components/NextDeal/ProjectSelector';
import { ProjectProvider } from '../../contexts/projects';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import { Card, Popover } from 'antd';
import { ResponsesProvider, useResponse } from '../../contexts/responses';
import IntlMessages from '../../util/IntlMessages';

const localizer = momentLocalizer(moment);

const EventComponent = evtData => {
  const PopupContent = () => {
    return (
      <div className="gx-px-1 gx-py-2" style={{ maxWidth: '200px' }}>
        <div>
          <h6>
            <IntlMessages id="app.common.text.Project" />
          </h6>
          <p className="gx-text-muted">{evtData.event.project}</p>
        </div>
        <div>
          <h6>
            <IntlMessages id="app.common.text.supplier" />
          </h6>
          <p className="gx-text-muted">{evtData.event.supplier}</p>
        </div>
        <div>
          <h6>
            {evtData.event.deliveryDate ? (
              <IntlMessages id="app.common.text.deliveryDate" />
            ) : (
              <IntlMessages id="app.common.text.validityDate" />
            )}
          </h6>
          <p className="gx-text-muted">{moment(evtData.event.start).format('MMM Do YY')}</p>
        </div>
      </div>
    );
  };
  return (
    <Popover content={<PopupContent />} title={evtData.title}>
      <div className="gx-h-100 gx-w-100 gx-position-absolute gx-p-1">
        <span>{evtData.title}</span>
      </div>
    </Popover>
  );
};

const ProjectsCalendarWrapper = () => {
  const { getQuotationsForCalendar } = useResponse();
  const [selectedProject, setSelectedProject] = useState(null);
  const [events, setEvents] = useState([]);
  const [allProjectQuotes, setAllProjectQuotes] = useState([]);
  const [quotationStatus, setQuotationStatus] = useState('all');
  const [quotationsByPid, setQuotationsByPid] = useState([]);
  const monthStart = moment().startOf('month').subtract(7, 'day');
  const monthEnd = moment().endOf('month').add(7, 'day');
  const projectChangeCallback = projectId => {
    setSelectedProject(projectId);
  };
  const statusChangeCallback = value => {
    setQuotationStatus(value);
  };

  const updateCalendarData = (start, end) => {
    getQuotationsForCalendar(
      selectedProject,
      moment(start).format('YYYY-MM-DD'),
      moment(end).format('YYYY-MM-DD'),
      data => {
        setAllProjectQuotes(data);
      },
    );
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = event.validityDate ? '#f70' : '#003366';
    var style = {
      backgroundColor: backgroundColor,
      position: 'relative',
    };
    return {
      style: style,
    };
  };

  useEffect(() => {
    const newCalendarData = allProjectQuotes.filter(
      item => item.quotation.project.id === selectedProject,
    );
    const updatedCalendarData = newCalendarData.map((item, index) => {
      const quoteendDate = item.deliveryDate || item.validityDate;
      return {
        id: item.id,
        start: moment(quoteendDate).toDate(),
        end: moment(quoteendDate).toDate(),
        quotationName: item.quotation.name,
        supplier: item.supplier.fantasyName,
        isAwarded: item.isAwarded,
        allDay: true,
        project: item.quotation.project.name,
        deliveryDate: item.deliveryDate,
        validityDate: item.validityDate,
      };
    });
    setQuotationsByPid(updatedCalendarData);
  }, [allProjectQuotes, selectedProject]);

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
    if (Array.isArray(data)) {
      updateCalendarData(data[0], data[data.length - 1]);
    }
    if (data.start && data.end) {
      updateCalendarData(data.start, data.end);
    }
  };

  useEffect(() => {
    updateCalendarData(monthStart, monthEnd);
  }, []);

  return (
    <React.Fragment>
      <ProjectSelector
        projectChangeCallback={projectChangeCallback}
        showStatus={true}
        statusChangeCallback={statusChangeCallback}
      />
      <Card className="gx-card">
        <Calendar
          localizer={localizer}
          events={events}
          views={['month', 'week']}
          onRangeChange={onRangeChange}
          titleAccessor={'quotationName'}
          popup={true}
          components={{
            event: EventComponent,
          }}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: "Siguiente",
            previous: "Antes",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
          }}
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

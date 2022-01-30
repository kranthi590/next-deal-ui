import React from 'react';
import { Timeline, TimelineEvent } from '@mailtop/horizontal-timeline';
import {
  AuditOutlined,
  EditFilled,
  EditOutlined,
  ExceptionOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  FormOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';

const timelineData = {
  QUOTATION_CREATED: {
    icon: FormOutlined,
    title: 'Created',
    color: '#87CEEB',
  },
  QUOTATION_RESPONSE_CREATED: {
    icon: SolutionOutlined,
    title: 'Response Created',
    color: '#87CEEB',
  },
  QUOTATION_AWARDED: {
    icon: AuditOutlined,
    title: 'Awarded',
    color: '#3F51B5',
  },
  QUOTATION_RETAINED: {
    icon: FileProtectOutlined,
    title: 'Retained',
    color: '#FF9800',
  },
  QUOTATION_RECEPTION_CONFIRMED: {
    icon: ExceptionOutlined,
    title: 'Confirmed',
    color: '#8BC34A',
  },
  QUOTATION_COMPLETED: {
    icon: FileDoneOutlined,
    title: 'Completed',
    color: '#4CAF50',
  },
  QUOTATION_ABORTED: {
    icon: ExceptionOutlined,
    title: 'Aborted',
    color: '#F44336',
  },
  CUSTOM: {
    icon: EditOutlined,
    title: 'Custom',
    color: '#87a2c7',
  },
};

const QuotationTimeline = ({ activities }) => {
  return (
    <React.Fragment>
      <Card>
        <Timeline>
          {activities.map(item => {
            const currentEventData = timelineData[item.activityType];
            return (
              <TimelineEvent
                icon={currentEventData.icon}
                title={item.activityText || currentEventData.title}
                color={currentEventData.color}
              />
            );
          })}
        </Timeline>
      </Card>
    </React.Fragment>
  );
};

export default QuotationTimeline;

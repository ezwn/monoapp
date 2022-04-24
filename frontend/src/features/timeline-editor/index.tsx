import React from 'react';
import { File } from '../../lib/fs4webapp-client';
import { useNavigatorPersistenceContext } from '../navigator/NavigatorPersistence-ctx';
import { TimelinePersistenceProvider, useTimelinePersistenceContext } from './persistence/TimelinePersistence-ctx';
import { findRange } from './caclulation';
import { Period, Event } from './Timeline-mdl';

import './Timeline-cmp.css';
import './Period-cmp.css';

const extension = ".timeline.json"

const project = (value: number, rangeBegin: number, rangeEnd: number) => {
  return (value - rangeBegin) / (rangeEnd - rangeBegin) * 100;
}

const PeriodCmp: React.FC<{ period: Period, rangeBegin: number, rangeEnd: number }> = ({ period, rangeBegin, rangeEnd }) => {

  const pcBegin = project(period.beginning, rangeBegin, rangeEnd);
  const pcSize = project(period.end, rangeBegin, rangeEnd) - pcBegin;

  return <div className='period-cmp' style={{ left: `${pcBegin}%`, width: `${pcSize}%` }}>{period.title}</div>;
}

const EventCmp: React.FC<{ event: Event, rangeBegin: number, rangeEnd: number }> = ({ event, rangeBegin, rangeEnd }) => {

  const pcBegin = project(event.date, rangeBegin, rangeEnd);

  return <div className='event-cmp' style={{ left: `${pcBegin}%` }}></div>;
}

const TimelineCmp = () => {
  const { timeline } = useTimelinePersistenceContext();

  if (!timeline)
    return null;

  const { beginning, end } = findRange(timeline);

  return <div className='timeline-cmp'>
    {timeline.events.map(event => <EventCmp key={event.title} event={event} rangeBegin={beginning} rangeEnd={end}>{event.title}</EventCmp>)}
    {timeline.periods.map(period => <PeriodCmp key={period.title} period={period} rangeBegin={beginning} rangeEnd={end}>{period.title}</PeriodCmp>)}
  </div>;
}

const TimelineView = () => {
  const { currentFile } = useNavigatorPersistenceContext();

  if (!currentFile)
    return null;

  return <TimelinePersistenceProvider timelineId={currentFile.path}><TimelineCmp /></TimelinePersistenceProvider>;
}

const mainView = () => <TimelineView />;

const fileLabel: React.FC<{ file: File }> = ({ file }) => <>
  {file.name.substring(0, file.name.length - extension.length)}
</>;

export const fileConfigFor = (file: File) => file.name.endsWith(extension) ? {
  fileLabel,
  mainView
} : null;

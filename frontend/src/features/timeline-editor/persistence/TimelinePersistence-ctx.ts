import { useEffect, useState } from 'react';
import { loadFileNull } from '../../../lib/fs4webapp-client';
import { createHookBasedContext } from '../../../lib/react-utils/createHookBasedContext';
import { Timeline } from '../Timeline-mdl';
import { TimelinePersistence } from './TimelinePersistence-mdl';

export type TimelinePersistenceProps = {
  timelineId?: string;
};

export type TimelinePersistenceValue = {
  timeline: Timeline | null;
};

export const defaultValue: TimelinePersistenceValue = {
  timeline: null,
};

export const useTimelinePersistence: (props: TimelinePersistenceProps) => TimelinePersistenceValue = ({ timelineId }) => {
  const [timeline, setTimeline] = useState<Timeline | null>(defaultValue.timeline);

  useEffect(() => {
    async function fetch() {
      const timeline: TimelinePersistence | null = timelineId ? await loadFileNull<TimelinePersistence>(timelineId) : null;

      if (!timeline) {
        setTimeline(null);
        return;
      }


      setTimeline({
        ...timeline,
        periods: timeline.periods.map(period => ({
          ...period,
          beginning: new Date(period.beginning).getTime(),
          end: new Date(period.end).getTime()
        })),
        events: timeline.events.map(event => ({
          ...event,
          date: new Date(event.date).getTime()
        }))
      });
    }

    fetch();
  }, [timelineId]);

  return { timeline };
};

const hookBasedContext = createHookBasedContext(useTimelinePersistence, defaultValue);

export const TimelinePersistenceProvider = hookBasedContext.Provider;
export const useTimelinePersistenceContext = hookBasedContext.useContext;

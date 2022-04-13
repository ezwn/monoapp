import { Timeline } from './Timeline-mdl';

export const findRange = (timeline: Timeline) => {
    const {periods} = timeline;
  
    if (!periods || periods.length===0)
      throw new Error();
  
    let { beginning, end } = periods[0];
  
    periods.forEach(period => {
      const { beginning: beg, end: e } = period;

      beginning = Math.min(beginning, beg);
      end = Math.max(end, e);
    });

    return { beginning, end };
  }
  
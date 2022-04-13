export interface Timeline {
  periods: Period[];
  events: Event[];
}

export interface Period {
  title: string;
  beginning: number;
  end: number;
}

export interface Event {
  title: string;
  date: number;
}

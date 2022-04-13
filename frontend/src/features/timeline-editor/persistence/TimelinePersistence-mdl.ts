export interface TimelinePersistence {
  periods: PeriodPersistence[];
  events: EventPersistence[];
}

export interface PeriodPersistence {
  title: string;
  beginning: string;
  end: string;
}

export interface EventPersistence {
  title: string;
  date: string;
}

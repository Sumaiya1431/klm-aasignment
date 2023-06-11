export interface Holiday {
  holidayId: String;
  holidayLabel: String;
  employeeId: String;
  employeeName: String;
  startOfHoliday: Date;
  endOfHoliday: Date;
  status: Status;
}

export enum Status {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED'
}

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {By} from "@angular/platform-browser";

import {NewHolidayComponent} from './new-holiday.component';
import {ServiceService} from '../services/service.service';
import {MaterialModule} from "../material.module";
import {Holiday, Status} from "../modal/Holiday";

describe('NewHolidayComponent', () => {
  let component: NewHolidayComponent;
  let fixture: ComponentFixture<NewHolidayComponent>;
  let serviceMock: jasmine.SpyObj<ServiceService>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<NewHolidayComponent>>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;
  let holiday: Holiday = {
    holidayId: '1',
    holidayLabel: 'Holiday 1',
    employeeId: 'klm123456',
    startOfHoliday: new Date(),
    endOfHoliday: new Date(),
    status: Status.SCHEDULED,
    employeeName: 'test'
  };

  const holidays: Holiday[] = [
    {
      holidayId: '1',
      holidayLabel: 'Holiday 1',
      employeeId: '123',
      startOfHoliday: new Date(),
      endOfHoliday: new Date(),
      status: Status.SCHEDULED,
      employeeName: 'test'
    },
    {
      holidayId: '2',
      holidayLabel: 'Holiday 2',
      employeeId: '456',
      startOfHoliday: new Date(),
      endOfHoliday: new Date(),
      status: Status.DRAFT,
      employeeName: 'test2'
    },
  ];

  beforeEach(async () => {
    // Create mock objects
    serviceMock = jasmine.createSpyObj('ServiceService', [
      'getHolidays', 'deleteHoliday', 'getEmployeeIds',
      'saveHoliday', 'getHolidaysForEmployee', 'updateHoliday'
    ]);
    serviceMock.deleteHoliday.and.returnValue(of(null));
    serviceMock.getEmployeeIds.and.returnValue(of(['klm123456', 'klm123457']));
    serviceMock.saveHoliday.and.returnValue(of(holiday));
    serviceMock.updateHoliday.and.returnValue(of(holidays));
    serviceMock.getHolidaysForEmployee.and.returnValue(of([holiday]));
    dialogRefMock = jasmine.createSpyObj<MatDialogRef<NewHolidayComponent>>('MatDialogRef', ['close']);
    snackBarMock = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    // Configure TestBed
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      declarations: [NewHolidayComponent],
      providers: [
        {provide: ServiceService, useValue: serviceMock},
        {provide: MatDialogRef, useValue: dialogRefMock},
        {provide: MatSnackBar, useValue: snackBarMock},
        {provide: MAT_DIALOG_DATA, useValue: {}},
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with editMode set to false', () => {
    expect(component.editMode).toBeFalse();
  });

  it('should initialize the form with default values', () => {
    expect(component.form.get('holidayLabel').value).toBeNull();
    expect(component.form.get('employeeId').value).toBeNull();
    expect(component.form.get('startOfHoliday').value).toBeNull();
    expect(component.form.get('endOfHoliday').value).toBeNull();
  });

  it('should load employee IDs from service', () => {
    const employeeIds = ['klm123456', 'klm123457'];

    fixture.detectChanges();

    expect(component.employeeIds).toEqual(employeeIds);
  });

  it('should Save with Status Scheduled when save() is called with Status.SCHEDULED', () => {
    // Spy on the saveOrEdit method
    spyOn(component, 'saveOrEdit').and.callThrough();

    setFormValues(6, 8);

    // Trigger the button click event
    const saveButton = fixture.debugElement.query(By.css('button[aria-label="Schedule Save"]'));
    saveButton.triggerEventHandler('click', Status.SCHEDULED);

    // Expectations
    expect(component.saveOrEdit).toHaveBeenCalled();
    expect(serviceMock.saveHoliday).toHaveBeenCalled();
    expect(component.holiday.status).toBe(Status.SCHEDULED);
  });

  it('should update an existing holiday when "Save" button is clicked in edit mode', () => {
    component.editMode = true;
    setFormValues(6, 8);
    // Trigger the button click event;

    const saveButton = fixture.debugElement.query(By.css('button[aria-label="Draft Save"]'));
    saveButton.triggerEventHandler('click', Status.DRAFT);

    expect(serviceMock.updateHoliday).toHaveBeenCalled();
    expect(component.holiday.status).toBe(Status.DRAFT);
  });

  it('should display an error message when start date is greater than end date', () => {
    setFormValues(6, 0);

    // Trigger the button click event
    const saveButton = fixture.debugElement.query(By.css('button[aria-label="Schedule Save"]'));
    saveButton.triggerEventHandler('click', Status.DRAFT);

    expect(snackBarMock.open).toHaveBeenCalledWith('Start Date cannot be greater than end Date', 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['red-snackbar', 'login-snackbar'],
    });
  });

  it('should display an error message when start date is not 5 days before today', () => {
    setFormValues(2, 8);

    // Trigger the button click event
    const saveButton = fixture.debugElement.query(By.css('button[aria-label="Schedule Save"]'));
    saveButton.triggerEventHandler('click', Status.DRAFT);

    expect(snackBarMock.open).toHaveBeenCalledWith('You have to book holiday 5 days before', 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['red-snackbar', 'login-snackbar'],
    });
  });

  function setFormValues(startDateValue: number, endDateValue: number) {
    const startDate = new Date();
    const endDate = new Date();

    startDate.setDate(holiday.startOfHoliday.getDate() + startDateValue);
    endDate.setDate(holiday.startOfHoliday.getDate() + endDateValue);
    const formValues = {
      holidayLabel: 'Test Holiday',
      employeeId: 'klm123456',
      startOfHoliday: startDate,
      endOfHoliday: endDate
    };
    component.form.setValue(formValues);
  }
});


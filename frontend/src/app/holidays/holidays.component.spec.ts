import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Component, Input} from '@angular/core';
import {of} from 'rxjs';
import {HolidaysComponent} from "./holidays.component";
import {ServiceService} from "../services/service.service";
import {Holiday, Status} from "../modal/Holiday";
import {MaterialModule} from "../material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {By} from "@angular/platform-browser";
import {NewHolidayComponent} from "../new-holiday/new-holiday.component";
import {ReactiveFormsModule} from "@angular/forms";


@Component({
  selector: 'app-mat-paginator',
  template: '',
})
class MockMatPaginatorComponent {
  @Input() length: number;
  @Input() pageSize: number;
}

describe('HolidaysComponent', () => {
  let component: HolidaysComponent;
  let fixture: ComponentFixture<HolidaysComponent>;
  let mockService: jasmine.SpyObj<ServiceService>;
  let mockDialog: MatDialog;
  let mockSnackBar: MatSnackBar;

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
    mockService = jasmine.createSpyObj('ServiceService', ['getHolidays', 'deleteHoliday', 'getEmployeeIds']);
    mockService.getHolidays.and.returnValue(of(holidays)); // Set the return value for getHolidays method
    mockService.deleteHoliday.and.returnValue(of(null));
    mockService.getEmployeeIds.and.returnValue(of(['klm123456', 'klm123457']));
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [HolidaysComponent, MockMatPaginatorComponent],
      imports: [MaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: ServiceService, useValue: mockService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaysComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch holidays and populate the table with data', fakeAsync(() => {
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

    const serviceSpy = TestBed.inject(ServiceService) as jasmine.SpyObj<ServiceService>;
    serviceSpy.getHolidays.and.returnValue(of(holidays));

    fixture.detectChanges();
    tick();

    expect(component.holidays).toEqual(holidays);
    expect(component.dataSource.data).toEqual(holidays);
    expect(component.resultsLength).toBe(holidays.length);
  }));

  it('should open the dialog when "Edit Holiday" is clicked', () => {
    let holiday = {
      holidayId: '1',
      holidayLabel: 'Holiday 1',
      employeeId: '123',
      startOfHoliday: new Date(),
      endOfHoliday: new Date(),
      status: Status.SCHEDULED
    };

    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    const dialogRef = {
      ...dialogRefSpy,
      afterClosed: () => of(null),
    };
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(dialogRef);

    fixture.detectChanges(); // Trigger change detection

    const menuButton = fixture.debugElement.query(By.css('button[aria-label="Icon-Button with a menu"]'));
    menuButton.triggerEventHandler('click', null);

    const editButton = fixture.debugElement.query(By.css('button[aria-label="Edit Holiday"]'));
    editButton.triggerEventHandler('click', null);

    expect(dialogSpy.open).toHaveBeenCalledWith(NewHolidayComponent, {
      data: {
        holiday: {
          holidayId: holiday.holidayId,
          holidayLabel: holiday.holidayLabel,
          employeeId: holiday.employeeId,
          startOfHoliday: jasmine.any(Date), // Compare as string
          endOfHoliday: jasmine.any(Date), // Compare as string
          status: holiday.status,
          employeeName: 'test'
        },
      },
    });
  });

  it('should delete the holiday when "Delete Holiday" is clicked', () => {
    let holiday: Holiday = {
      holidayId: '1',
      holidayLabel: 'Holiday 1',
      employeeId: '123',
      startOfHoliday: new Date(),
      endOfHoliday: new Date(),
      status: Status.SCHEDULED,
      employeeName: 'test'
    };
    holiday.startOfHoliday.setDate(holiday.startOfHoliday.getDate() + 6);

    fixture.detectChanges(); // Trigger change detection
    const snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    component.deleteHoliday(holiday);

    expect(mockService.deleteHoliday).toHaveBeenCalledWith(holiday.holidayId);
    expect(component.holidays).not.toContain(holiday);
    expect(component.dataSource.data).not.toContain(holiday);
  });


  it('should display a snackbar message when attempting to delete a holiday too close to the start date', () => {
    let holiday: Holiday = {
      holidayId: '1',
      holidayLabel: 'Holiday 1',
      employeeId: '123',
      startOfHoliday: new Date(),
      endOfHoliday: new Date(),
      status: Status.SCHEDULED,
      employeeName: 'test'
    };
    const serviceSpy = TestBed.inject(ServiceService) as jasmine.SpyObj<ServiceService>;
    const snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    serviceSpy.deleteHoliday.and.returnValue(of(null));

    component.deleteHoliday(holiday);

    expect(serviceSpy.deleteHoliday).not.toHaveBeenCalled();
    expect(component.holidays).not.toContain(holiday);
    expect(component.dataSource.data).not.toContain(holiday);
    expect(snackBarSpy.open).toHaveBeenCalled();
  });
});

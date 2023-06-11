import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import {Holiday, Status} from '../modal/Holiday';
import { NewHolidayComponent } from '../new-holiday/new-holiday.component';
import {MaterialModule} from "../material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Component, Input} from "@angular/core";
import {By} from "@angular/platform-browser";

@Component({ selector: 'app-holidays', template: '' })
class MockHolidaysComponent {
  @Input() newHoliday: Holiday;
}

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let dialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [NavComponent, MockHolidaysComponent],
      imports: [MaterialModule, BrowserAnimationsModule],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    }).compileComponents();

    dialogMock = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog when "New" button is clicked', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    const dialogRef = {
      ...dialogRefSpy,
      afterClosed: () => of(undefined),
    };
    const dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogSpy.open.and.returnValue(dialogRef);

    fixture.detectChanges(); // Trigger change detection

    const newButton = fixture.debugElement.query(By.css('button[aria-label="New Holiday"]'));
    newButton.triggerEventHandler('click', null);

    expect(dialogSpy.open).toHaveBeenCalledWith(NewHolidayComponent);
  });

  it('should update the holiday when dialog is closed', () => {
    const holiday: Holiday = {
      holidayId: '1',
      holidayLabel: 'Holiday 1',
      employeeId: '123',
      startOfHoliday: new Date(),
      endOfHoliday: new Date(),
      status: Status.SCHEDULED,
      employeeName: 'abc'
    };

    const dialogRefMock = jasmine.createSpyObj<MatDialogRef<any>>(['afterClosed']);
    dialogRefMock.afterClosed.and.returnValue(of(holiday));

    const openDialogSpy = dialogMock.open.and.returnValue(dialogRefMock);
    const newButton = fixture.debugElement.query(By.css('button[aria-label="New Holiday"]'));
    newButton.triggerEventHandler('click', null);

    expect(openDialogSpy).toHaveBeenCalledWith(NewHolidayComponent);

    expect(component.holiday).toEqual(holiday);
  });
});

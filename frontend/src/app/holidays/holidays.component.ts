import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Holiday} from "../modal/Holiday";
import {ServiceService} from "../services/service.service";
import {NewHolidayComponent} from "../new-holiday/new-holiday.component";
import {SnackbarService} from "../services/snackbar.service";
import {FormControl} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() newHoliday?: Holiday;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();
  destroy = new Subject();
  displayedColumns: string[] = ['label', 'employeeId', 'startOfHoliday', 'endOfHoliday', 'status', 'menu'];
  dataSource = new MatTableDataSource<Holiday>();
  holidays: Holiday[];
  resultsLength = 0;
  employeeIds = [];
  employeeSearch = new FormControl('');

  constructor(private service: ServiceService, private dialog: MatDialog, private snackBar: SnackbarService) {
  }

  ngOnInit() {
    this.service.getHolidays().pipe(takeUntil(this.destroy)).subscribe(holidays => {
      this.holidays = holidays;
      this.dataSource.data = this.holidays;
      this.resultsLength = this.dataSource.data.length;
    })

    this.service.getEmployeeIds().pipe(takeUntil(this.destroy)).subscribe(employeeIds => {
      this.employeeIds = [...employeeIds];
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.empTbSort;
  }

  ngOnChanges(simpleChange: any) {
    this.newHoliday = simpleChange.newHoliday.currentValue;
    if (this.newHoliday) {
      this.dataSource.data.push(this.newHoliday);
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }

  deleteHoliday($holiday: Holiday) {
    const startDate = new Date($holiday.startOfHoliday);
    const todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + 5);
    if (!(todayDate.toDateString() === startDate.toDateString() || startDate > todayDate)) {
      this.snackBar.openSnackbar("You have to cancel holiday 5 days before", "red-snackbar");
    } else {
      this.service.deleteHoliday($holiday.holidayId).pipe(takeUntil(this.destroy)).subscribe(() => {
        this.holidays = this.holidays.filter(holiday => holiday.holidayId !== $holiday.holidayId);
        this.dataSource.data = this.holidays;
        this.snackBar.openSnackbar("Delete Successful", "green-snackbar");
      }, () => {
        this.snackBar.openSnackbar("Delete Unsuccessful", "red-snackbar");
      })
    }

  }

  openDialog(holiday: Holiday) {
    const dialogRef = this.dialog.open(NewHolidayComponent, {
      data: {
        holiday: holiday
      }
    });

    dialogRef.afterClosed().subscribe(holidays => {
      if (holidays) {
        this.dataSource.data = holidays;
      }
    })
  }

  searchEmployee() {
    const employeeIdsSelected = [...this.employeeSearch.value];
    this.dataSource.data = this.holidays.filter(myCallBack);

    function myCallBack(el) {
      return employeeIdsSelected.indexOf(el.employeeId) >= 0;
    }
  }

  refresh() {
    this.dataSource.data = this.holidays;
    this.employeeSearch.patchValue('');
  }
}

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Holiday, Status} from "../modal/Holiday";
import {ServiceService} from "../services/service.service";
import {SnackbarService} from "../services/snackbar.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-new-holiday',
  templateUrl: './new-holiday.component.html',
  styleUrls: ['./new-holiday.component.css']
})
export class NewHolidayComponent implements OnInit, OnDestroy {
  holiday: Holiday;
  Status = Status;
  editMode = false;
  currentHolidayId: string;
  employeeIds: String[] = [];
  errorMessage: string;
  destroy = new Subject();
  form: FormGroup = new FormGroup({
    holidayLabel: new FormControl(null, [Validators.required]),
    employeeId: new FormControl(null, [Validators.required]),
    startOfHoliday: new FormControl(null, [Validators.required]),
    endOfHoliday: new FormControl(null, [Validators.required])
  });

  constructor(private dialogRef: MatDialogRef<NewHolidayComponent>,
              private service: ServiceService,
              @Inject(MAT_DIALOG_DATA) private passedData: any,
              private snackBar: SnackbarService) {
    if (passedData && passedData.holiday) {
      this.editMode = true;
      this.currentHolidayId = passedData.holiday.holidayId;
      this.form.patchValue(passedData.holiday);
      this.holiday = passedData.holiday;
    }
  }

  ngOnInit() {
    this.service.getEmployeeIds().pipe(takeUntil(this.destroy)).subscribe(employeeIds => {
      this.employeeIds = [...employeeIds];
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }

  save(status: Status) {
    const startDate = new Date(this.form.value.startOfHoliday);
    const endDate = new Date(this.form.value.endOfHoliday);
    const todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + 5);
    if (startDate > endDate) {
      this.snackBar.openSnackbar("Start Date cannot be greater than end Date", "red-snackbar");
    } else if (!(todayDate.toDateString() === startDate.toDateString() || startDate > todayDate)) {
      this.snackBar.openSnackbar("You have to book holiday 5 days before", "red-snackbar");
    } else {
      this.holiday = this.form.value;
      this.holiday.status = status;
      this.dateValidation(startDate, endDate);
    }
  }

  saveOrEdit() {
    if (this.editMode) {
      this.holiday.holidayId = this.currentHolidayId;
      this.service.updateHoliday(this.holiday).pipe(takeUntil(this.destroy)).subscribe(holidays => {
          this.dialogRef.close(holidays);
          this.snackBar.openSnackbar("Update Successful", "green-snackbar");
        },
        error => {
          this.snackBar.openSnackbar(error.error.message, "red-snackbar");
        })
    } else {
      this.service.saveHoliday(this.holiday).pipe(takeUntil(this.destroy)).subscribe(holiday => {
          this.dialogRef.close(holiday);
        },
        error => {
          this.snackBar.openSnackbar(error.error.message, "red-snackbar");
        })
    }

  }

  getErrorMessage(formControlName: string) {
    if (/^\s*$/.test(this.form.get(formControlName).value)) {
      this.errorMessage = 'Value cannot be empty';
    }
    return this.form.get(formControlName)?.dirty ? this.errorMessage : '';
  }

  close() {
    this.dialogRef.close();
  }

  dateValidation(newStartDate: Date, newEndDate: Date) {
    this.service.getHolidaysForEmployee(this.form.value.employeeId).pipe(takeUntil(this.destroy)).subscribe(holidays => {
      const holiday = holidays.find(holiday => {
        const startDate = new Date(holiday.startOfHoliday);
        const endDate = new Date(holiday.endOfHoliday);
        const diffTime = newStartDate.getTime() - endDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        const diffTime1 = startDate.getTime() - newEndDate.getTime();
        const diffDays1 = diffTime1 / (1000 * 60 * 60 * 24);
        return (diffDays < 3 && diffDays > 0) || (diffDays1 > 0 && diffDays1 < 3);
      });
      if (holiday && !this.currentHolidayId) {
        this.snackBar.openSnackbar("There Should be 3 days gap between two holidays", "red-snackbar");
      } else {
        this.saveOrEdit();
      }
    })
  }
}

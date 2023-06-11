import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {NewHolidayComponent} from "../new-holiday/new-holiday.component";
import {Holiday} from "../modal/Holiday";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnDestroy{
  holiday: Holiday;
  destroy = new Subject();

  constructor(private dialog: MatDialog) {
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewHolidayComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe(holiday => {
      this.holiday = holiday;
    })
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}

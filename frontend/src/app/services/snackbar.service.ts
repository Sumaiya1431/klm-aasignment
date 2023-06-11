import { MatSnackBar } from '@angular/material/snack-bar';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass, 'login-snackbar'],
    });
  }
}

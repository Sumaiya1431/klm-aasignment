import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Holiday, Status} from "../modal/Holiday";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${this.apiServerUrl}/holidays`);
  }

  getEmployeeIds(): Observable<String[]> {
    return this.http.get<String[]>(`${this.apiServerUrl}/employees`);
  }

  getHolidaysForEmployee(employeeId: string): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${this.apiServerUrl}/holidays/${employeeId}`);
  }
  saveHoliday(holiday: Holiday) : Observable<Holiday>{
    return this.http.post<Holiday>(`${this.apiServerUrl}/holiday`,holiday);
  }

  deleteHoliday(id: String) {
    return this.http.delete(`${this.apiServerUrl}/holiday/${id}`);
  }

  updateHoliday(holiday: Holiday) : Observable<Holiday[]>{
    return this.http.put<Holiday[]>(`${this.apiServerUrl}/holiday`,holiday);
  }
}

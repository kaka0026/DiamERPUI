import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  EmployeeFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Employee/EmployeeFill', data);
  }
  DepartmentFillDrop(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Employee/DepartmentFillDrop', data);
  }
  DesignationFillDrop(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Employee/DesignationFillDrop', data);
  }
  EmployeeSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Employee/EmployeeSave', Data);
  }
  EmployeeDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Employee/EmployeeDelete', Data);
  }
  EmployeeCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Employee/EmployeeCheck', data);
  }
}

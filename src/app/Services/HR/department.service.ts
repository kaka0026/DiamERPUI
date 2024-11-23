import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  DepartmentFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Department/DepartmentFill', data);
  }
  DepartmentSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Department/DepartmentSave', Data);
  }
  DepartmentDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Department/DepartmentDelete', Data);
  }
  DepartmentCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Department/DepartmentCheck', data);
  }
}

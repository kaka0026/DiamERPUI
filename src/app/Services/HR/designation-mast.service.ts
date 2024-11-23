import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DesignationMastService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  DesignationFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Designation/DesignationFill', data);
  }
  DesignationSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Designation/DesignationSave', Data);
  }
  DesignationDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Designation/DesignationDelete', Data);
  }
  DesignationCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Designation/DesignationCheck', data);
  }
}

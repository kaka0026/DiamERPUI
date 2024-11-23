import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  Login(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Login/Login', Data);
  }
  OldPasswordCheck(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ChangePassword/OldPasswordCheck', Data);
  }
  ChangePassword(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ChangePassword/ChangePassword', Data);
  }
  SendOTPNumberEmail(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Login/SendOTPNumberEmail', data);
  }
  SendOTPNumber(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Login/SendOTPNumber', data);
  }
}

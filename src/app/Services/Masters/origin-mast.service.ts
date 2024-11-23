import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OriginMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  OriginFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Origin/OriginFill', data);
  }
  OriginSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Origin/OriginSave', Data);
  }
  OriginDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Origin/OriginDelete', Data);
  }
  OriginMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Origin/OriginMastCheck', data);
  }
}

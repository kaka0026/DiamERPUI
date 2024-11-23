import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OverToneService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  OverToneMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OverToneMast/OverToneMastFill', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
  OverToneMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OverToneMast/OverToneMastSave', Data);
  }
  OverToneMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OverToneMast/OverToneMastDelete', Data);
  }
  OverToneMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OverToneMast/OverToneMastCheck', data);
  }
}

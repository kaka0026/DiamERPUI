import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FluorescenceMastService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  FloMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'FluorescenceMast/FloMastFill', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
  FloMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'FluorescenceMast/FloMastSave', Data);
  }
  FloMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'FluorescenceMast/FloMastDelete', Data);
  }
  FloMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'FluorescenceMast/FloMastCheck', data);
  }
}

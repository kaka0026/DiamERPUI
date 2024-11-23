import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalrityMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  CalMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ClarityMast/CalMastFill', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
  CalMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ClarityMast/CalMastSave', Data);
  }
  CalMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ClarityMast/CalMastDelete', Data);
  }
  CalMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ClarityMast/CalMastCheck', data);
  }
}

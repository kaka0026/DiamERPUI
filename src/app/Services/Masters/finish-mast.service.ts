import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinishMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  FinishmastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'FinishMast/FinishmastFill', data);
  }
  FinishMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'FinishMast/FinishMastSave', Data);
  }
  FinishMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'FinishMast/FinishMastDelete', Data);
  }
  FinishMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'FinishMast/FinishMastCheck', data);
  }
}

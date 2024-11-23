import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KTMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  KTMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'KTMast/KTMastFill', data);
  }
  KTMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'KTMast/KTMastSave', Data);
  }
  KTMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'KTMast/KTMastDelete', Data);
  }
  KTMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'KTMast/KTMastCheck', data);
  }
}

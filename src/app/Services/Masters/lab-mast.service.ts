import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LabMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  LBMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'LabMast/LBMastFill', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
  LBMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'LabMast/LBMastSave', Data);
  }
  LBMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'LabMast/LBMastDelete', Data);
  }
  LBMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'LabMast/LBMastCheck', data);
  }
}

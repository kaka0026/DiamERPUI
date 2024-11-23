import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntensityService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  IntensityMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IntensityMast/IntensityMastFill', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
  IntensityMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IntensityMast/IntensityMastSave', Data);
  }
  IntensityMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IntensityMast/IntensityMastDelete', Data);
  }
  IntensityMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IntensityMast/IntensityMastCheck', data);
  }
}

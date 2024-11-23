import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  ColMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorMast/ColMastFill', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
  ColMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorMast/ColMastSave', Data);
  }
  ColMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorMast/ColMastDelete', Data);
  }
  ColMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorMast/ColMastCheck', data);
  }
}

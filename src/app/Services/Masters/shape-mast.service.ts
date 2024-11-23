import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShapeMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  ShapMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/ShapMastFill', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
  ShapMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/ShapMastSave', Data);
  }
  ShapMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/ShapMastDelete', Data);
  }
  ShapMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/ShapMastCheck', data);
  }
}

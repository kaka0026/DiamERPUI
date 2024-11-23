import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InclusionMastService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  IncMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'InclusionMast/IncMastFill', data);
  }
  IncCatFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IncCat/IncCatFill', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
  IncMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'InclusionMast/IncMastSave', Data);
  }
  IncMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'InclusionMast/IncMastDelete', Data);
  }

  IncMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'InclusionMast/IncMastCheck', data);
  }
}

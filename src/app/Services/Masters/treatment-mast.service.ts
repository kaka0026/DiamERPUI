import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TreatmentMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  TreatmentMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Treatment/TreatmentMastFill', data);
  }
  TreatmentMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Treatment/TreatmentMastSave', Data);
  }
  TreatmentMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Treatment/TreatmentMastDelete', Data);
  }
  TreatmentMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Treatment/TreatmentMastCheck', data);
  }
  MaterialMastDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ShapeMast/MaterialMastDDL', data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationMastService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  LocationFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Location/LocationFill', data);
  }
  LocationSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Location/LocationSave', Data);
  }
  LocationDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Location/LocationDelete', Data);
  }
  LocationCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Location/LocationCheck', data);
  }
}

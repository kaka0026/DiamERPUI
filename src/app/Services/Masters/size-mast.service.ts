import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SizeMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  SizeMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'SizeMast/SizeMastFill', data);
  }
  SizeMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'SizeMast/SizeMastSave', Data);
  }
  SizeMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'SizeMast/SizeMastDelete', Data);
  }
  SizeMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'SizeMast/SizeMastCheck', data);
  }
}

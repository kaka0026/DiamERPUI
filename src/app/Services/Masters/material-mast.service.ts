import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  MaterialFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Material/MaterialFill', data);
  }

  MaterialDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Material/MaterialDDL', data);
  }

  MaterialSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Material/MaterialSave', Data);
  }
  MaterialDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Material/MaterialMastDelete', Data);
  }
  MaterialMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Material/MaterialMastCheck', data);
  }
}

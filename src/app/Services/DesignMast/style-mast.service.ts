import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StyleMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  StyleMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'StyleMast/StyleMastFill', data);
  }
  CatagoryFillDrop(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'StyleMast/CatagoryFillDrop', data);
  }
  StyleMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'StyleMast/StyleMastSave', Data);
  }
  StyleMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'StyleMast/StyleMastDelete', Data);
  }
}

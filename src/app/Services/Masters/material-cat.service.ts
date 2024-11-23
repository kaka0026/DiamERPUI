import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialCatService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  MaterialMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MaterialCat/MaterialMastFill', data);
  }

  MaterialMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MaterialCat/MaterialMastSave', Data);
  }
  MaterialMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MaterialCat/MaterialMastDelete', Data);
  }
  MaterialMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MaterialCat/MaterialMastCheck?M_CAT_SortName', data);
  }
  TypeGoodFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MaterialCat/TypeGoodFill', data);
  }
  PurchaseTypeGoodFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MaterialCat/PurchaseTypeGoodFill', data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurmastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  PurchaseTypeFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'PurchaseType/PurchaseTypeFill', data);
  }
  PurchaseFillDrop(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'PurchaseType/PurchaseFillDrop', data);
  }
  PurchaseTypeSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'PurchaseType/PurchaseTypeSave', Data);
  }
  PurchaseTypeDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'PurchaseType/PurchaseTypeDelete', Data);
  }
  PurchaseTypeCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'PurchaseType/PurchaseTypeCheck', data);
  }
  GetMemoBySupplier(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'PurchaseType/GetMemoBySupplier', data);
  }
  GetMemoByProcess(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'PurchaseType/GetMemoByProcess', data);
  }
}

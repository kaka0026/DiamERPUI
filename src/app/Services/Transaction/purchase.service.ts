import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  PurchaseView(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/PurchaseView', data);
  }
  PurchaseHFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/PurchaseHFill', data);
  }
  PurchaseLFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/PurchaseLFill', data);
  }

  PurchaseHDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/PurchaseHDelete', data);
  }
  PurchaseLDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/PurchaseLDelete', data);
  }
  SupplierFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/SupplierFill', data);
  }
  BrokerFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/BrokerFill', data);
  }
  GetNewTrnNo(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/GetNewTrnNo', data);
  }
  PurchaseBillCalculation(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/PurchaseBillCalculation', data);
  }
  BillHSave(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/BillHSave', data);
  }
  BillLSave(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/BillLSave', data);
  }
  GETMEMODETAILBYPURCHASE(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'PurchaseType/GETMEMODETAILBYPURCHASE', data);
  }
  PurchaseLFillModel(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Purchase/PurchaseLFillModel', data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupllierServiceService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  SupplierFill(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierFill', Data);
  }
  SpplierAdd(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SpplierAdd', Data);
  }
  SpplierKey(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SpplierKey', Data);
  }
  SpplierBank(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SpplierBank', Data);
  }
  SupplierAddSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierAddSave', Data);
  }
  SupplierBankSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierBankSave', Data);
  }
  SupplierKeyPerSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierKeyPerSave', Data);
  }
  SupplierSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierSave', Data);
  }
  SupplierDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierDelete', data);
  }
  SupplierAddDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierAddDelete', data);
  }
  SupplierKeyDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierKeyDelete', data);
  }
  SupplierBankDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Supplier/SupplierBankDelete', data);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  ClientFill(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ClientFill', Data);
  }
  ContactSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ClientSave', Data);
  }
  ClientDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ClientDelete', data);
  }
  ClientContactDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ClientContactDelete', data);
  }
  getClientDetailGrid(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/getClientDetailGrid', data);
  }
  ContryExtnoFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ContryExtnoFill', data);
  }
  ContryFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ContryFill', data);
  }
  GetEaringStyle(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/GetEaringStyle', data);
  }
  GetNecklaceStyle(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/GetNecklaceStyle', data);
  }
  StateFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/StateFill', data);
  }
  CityFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/CityFill', data);
  }
  ZipCodeFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ZipCodeFill', data);
  }
  ZipCodeFillstart(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ZipCodeFillstart', data);
  }
  GetUserCode(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/GetUserCode', data);
  }
  FUllClientDetailSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/FUllClientDetailSave', Data);
  }
  ClientAddSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ClientAddSave', Data);
  }
  ClientAdd(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ClientAdd', Data);
  }
  ClientAddDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ClientAddDelete', data);
  }
  async VerifySupplier(Data: any) {
    return this.http.post<any>(this.BaseUrl + 'Supplier/VerifySupplier', Data).toPromise();
  }
}

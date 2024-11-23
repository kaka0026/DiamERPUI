import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderEntryService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  GetOderEntryFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OrderEntry/GetOderEntryFill', data);
  }
  OrderEntryDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OrderEntry/OrderEntryDelete', data);
  }
  GetOrderNo(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OrderEntry/GetOrderNo', data);
  }
  OrderEntrySaveUpdate(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OrderEntry/OrderEntrySaveUpdate', Data);
  }
  ClientFill(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/ClientFill', Data);
  }
  GetKTFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OrderEntry/GetKTFill', data);
  }
  GetColorDDLill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OrderEntry/GetColorDDLill', data);
  }
  GetClarityDDLill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'OrderEntry/GetClarityDDLill', data);
  }
}

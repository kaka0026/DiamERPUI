import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrokerServiceService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  BrokerFill(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Broker/BrokerFill', Data);
  }
  BrokerSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Broker/BrokerSave', Data);
  }
  BrokerDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Broker/BrokerDelete', data);
  }
  GetSupplierNameBrokerWiser(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Client/GetSupplierNameBrokerWiser', data);
  }
}

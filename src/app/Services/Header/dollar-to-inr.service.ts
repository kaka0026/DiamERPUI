import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DollarToINRService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  GetINR(): Observable<any> {
    return this.http.get<any>('https://api.exchangerate-api.com/v4/latest/USD');
  }
}

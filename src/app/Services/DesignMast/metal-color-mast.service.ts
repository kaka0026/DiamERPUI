import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetalColorMastService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  MetalColorFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MetalColor/MetalColorFill', data);
  }
  MetalColorSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MetalColor/MetalColorSave', Data);
  }
  MetalColorDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MetalColor/MetalColorDelete', Data);
  }
}

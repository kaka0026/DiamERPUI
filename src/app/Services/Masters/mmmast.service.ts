import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MMMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  MMMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MMMast/MMMastFill', data);
  }
  ShapeMastForMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MMMast/ShapeMastForMaterial', data);
  }
  MMMastSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MMMast/MMMastSave', Data);
  }
  MMMastDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MMMast/MMMastDelete', Data);
  }
  MMMastCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MMMast/MMMastCheck', data);
  }
}

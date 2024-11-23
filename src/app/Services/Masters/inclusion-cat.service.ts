import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InclusionCatService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  IncCatFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IncCat/IncCatFill', data);
  }
  IncCatSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IncCat/IncCatSave', Data);
  }
  IncCatDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IncCat/IncCatDelete', Data);
  }
  IncCatCheck(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'IncCat/IncCatCheck', data);
  }
}

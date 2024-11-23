import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryMastService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  CategoryFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Category/CategoryFill', data);
  }
  CategorySave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Category/CategorySave', Data);
  }
  CategoryDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Category/CategoryDelete', Data);
  }
}

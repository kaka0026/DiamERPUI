import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  SubCategoryFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'SubCategory/SubCategoryFill', data);
  }

  CategoryDDL(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'SubCategory/CategoryDDL', data);
  }

  SubCategorySave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'SubCategory/SubCategorySave', Data);
  }
  SubCategoryDelete(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'SubCategory/SubCategoryDelete', Data);
  }
}

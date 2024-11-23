import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  PermissionFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Permission/PermissionFill', data);
  }
  PageWisePermissionFill(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Permission/PageWisePermissionFill', Data);
  }
  ActivePageWisePermissionFill(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Permission/ActivePageWisePermissionFill', Data);
  }

  PermissionSave(Data: any): Observable<any> {
    let CallsAry = Data.per.map(item => this.http.post<any>(this.BaseUrl + 'Permission/PermissionSave', {
      USERID: item.USERID,
      CreatedBy: item.CreatedBy,
      PAGEID: item.PAGEID,
      ISACTIVE: item.ISACTIVE,
      ISEDIT: item.ISEDIT,
      ISDELETE: item.ISDELETE,
      ISPROCESS: item.ISPROCESS,
      ISVIEW: item.ISVIEW,
      ISNEWADD: item.ISNEWADD,
    }))
    return forkJoin(CallsAry);;
  }
}

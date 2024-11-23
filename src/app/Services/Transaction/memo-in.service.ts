import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemoInService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }
  MemoInView(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoInView', data);
  }
  MemoInProcess(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoInProcess', data);
  }
  GetNewTrnNo(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetNewTrnNo', data);
  }
  GetMemoFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetMemoFill', data);
  }

  MemoLDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoLDelete', data);
  }

  MemoHInView(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoHInView', data);
  }
  MemoHSave(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoHSave', data);
  }
  MemoHInViewById(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoHInView', data);
  }

  MemoCalculation(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoCalculation', data);
  }

  GetOrgRap(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetOrgRap', data);
  }

  UpdateMemoInProcess(Data: any): Observable<any> {
    let CallsAry = Data.per.map(item => this.http.post<any>(this.BaseUrl + 'MemoIn/UpdateMemoInProcess', {
      SrNo: item.SrNo,
      CVDFLAG: item.CVDFLAG,
      DOWNSIZEFLAG: item.DOWNSIZEFLAG,
      SHAPEFLAG: item.SHAPEFLAG,
      FLOFLAG: item.FLOFLAG,
      MAKEFLAG: item.MAKEFLAG,
      GUAGEFLAG: item.GUAGEFLAG,
      COLFLAG: item.COLFLAG,
      FINUSER: item.FINUSER

    }))
    return forkJoin(CallsAry);;
  }

  MemoSaveCSImm(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoSaveCSImm', Data);
  }

  GetTrnFlagDetail(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetTrnFlagDetail', Data);
  }

  GetTrnFlagSaveCarat(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetTrnFlagSaveCarat', Data);
  }

  OriginFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Origin/OriginFill', data);
  }
  GetShapebyMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetShapebyMaterial', data);
  }
  GetOriginbyMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetOriginbyMaterial', data);
  }
  GetClaritybyMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetClaritybyMaterial', data);
  }
  GetColorbyMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetColorbyMaterial', data);
  }
  GetOverTonebyMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetOverTonebyMaterial', data);
  }
  GetIntensitybyMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetIntensitybyMaterial', data);
  }
  GetSizebyMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/GetSizebyMaterial', data);
  }
  MemoHDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MemoHDelete', data);
  }
  AllMemoLFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/AllMemoLFill', data);
  }
  MaterialFillbyMemoName(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'MemoIn/MaterialFillbyMemoName', data);
  }
}

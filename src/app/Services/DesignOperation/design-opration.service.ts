import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DesignOprationService {
  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  BlackWhiteFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/BlackWhiteFill', data);
  }
  BlackWhiteFillById(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/BlackWhiteFillById', data);
  }
  BlackWhiteDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/BlackWhiteDelete', data);
  }
  BlackWhiteSave(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/BlackWhiteSave', Data);
  }
  DesignerFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/DesignerFill', data);
  }
  FillSubCategoryDrop(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/FillSubCategoryDrop', data);
  }
  GetNewDesignCode(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/GetNewDesignCode', data);
  }
  upload(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/upload', Data);
  }
  DesignerMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/DesignerMastFill', data);
  }
  CatagoryFillDrop(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'StyleMast/CatagoryFillDrop', data);
  }
  SubCategoryByCategoryIDFill(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/SubCategoryByCategoryIDFill', Data);
  }
  DesignCodeFill(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'BlackWhite/DesignCodeFill', Data);
  }
  ShapeByMaterialId(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorDesign/ShapeByMaterialId', data);
  }
  SaveDimMaterial(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorDesign/SaveDimMaterial', Data);
  }
  GetSubDesignCode(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorDesign/GetSubDesignCode', data);
  }
  FillDimMaterial(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorDesign/FillDimMaterial', data);
  }
  SaveDisignColorDesign(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorDesign/SaveDisignColorDesign', Data);
  }
  FillColorDesign(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorDesign/FillColorDesign', data);
  }
  RemoveImage(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorDesign/RemoveImage', data);
  }
  RemoveDesign(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'ColorDesign/RemoveDesign', data);
  }
  SettingCodeFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Link/SettingCodeFill', data);
  }
  GetSaveDesignFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Link/GetSaveDesignFill', data);
  }
  GetColorDatabySubCode(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Link/GetColorDatabySubCode', Data);
  }
  SaveLinkDesigne(Data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Link/SaveLinkDesigne', Data);
  }
  LinktDelete(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Link/LinktDelete', data);
  }
  GETSettingCodeNew(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'Link/GETSettingCodeNew', data);
  }
}

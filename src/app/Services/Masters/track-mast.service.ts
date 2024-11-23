import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackMastService {

  private BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) { }

  TrackMastFill(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'TrackMast/TrackMastFill', data);
  }
}

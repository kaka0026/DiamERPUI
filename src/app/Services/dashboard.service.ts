import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private sharedData: Subject<any> = new Subject<any>();
  sharedData$: Observable<any> = this.sharedData.asObservable();

  private sharedPageName: Subject<any> = new Subject<any>();
  sharedPageName$: Observable<any> = this.sharedPageName.asObservable();

  constructor() { }

  setData(updatedData) {
    this.sharedData.next(updatedData);
  }

  SetPageTitle(PageName){
    this.sharedPageName.next(PageName);
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowsService {

  constructor() { }

  get windowRef() {
    return window
  }
}

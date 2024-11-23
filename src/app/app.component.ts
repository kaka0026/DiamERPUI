import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DimERP';


  ngOnInit(): void {

    if (environment.production) {
      // if (location.protocol === 'http:') {
      //   // window.location.href = location.href.replace('http', 'https');
      //   window.location.replace("https://bggems.in");
      // }
    }
  }
}
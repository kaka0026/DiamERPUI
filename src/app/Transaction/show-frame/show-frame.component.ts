import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-frame',
  templateUrl: './show-frame.component.html',
  styleUrls: ['./show-frame.component.css']
})
export class ShowFrameComponent implements OnInit {
  fileURLframe:string = "";
  constructor(
    public sanitizer: DomSanitizer,
    private _mdr: MatDialogRef<ShowFrameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.fileURLframe = data.Url;
     }

  ngOnInit(): void {
  }
  
}

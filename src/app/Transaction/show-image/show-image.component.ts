import { Component, OnInit ,ViewChild, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-show-image',
  templateUrl: './show-image.component.html',
  styleUrls: ['./show-image.component.css']
})
export class ShowImageComponent implements OnInit {

  fileURL : string = "";

  constructor(
    private _mdr: MatDialogRef<ShowImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
    this.fileURL = data.Url;
  }

  ngOnInit(): void {
  }

  setDefaultPic2() { this.fileURL = "./../../../assets/images/No-Image.jpg"; }

}

import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemoInService } from 'src/app/Services/Transaction/memo-in.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-memo-process-form',
  templateUrl: './memo-process-form.component.html',
  styleUrls: ['./memo-process-form.component.css']
})
export class MemoProcessFormComponent implements OnInit {
  TrNo: any = "";
  SrNo: any = "";
  Name: any = "";
  DATE: any = "";
  TIME: any = "";
  CARAT: any = "";
  USER: any = "";
  constructor(
    private _mdr: MatDialogRef<MemoProcessFormComponent>,
    private MemoInSer: MemoInService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.TrNo = data.TrnNo
      this.SrNo = data.Srno
      this.Name = data.Name
      let resultobj = {
        TrNo: data.TrnNo,
        SrNo: data.Srno,
        Name: data.Name
      };
      this.MemoInSer.GetTrnFlagDetail(resultobj).subscribe(Result => {
        try {
          if (Result.Success == 1) {
              this.DATE = Result.Data[0].DATE;
              this.TIME = Result.Data[0].TIME;
              this.CARAT = Result.Data[0].CARAT;
              this.USER = Result.Data[0].USER;
          } else {
            this.toastr.error("Something went Wrong!!");
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
     
     }

  ngOnInit(): void {
  }
  Save(){
    if(this.CARAT.length == 0)
    {
      this.toastr.warning("Enter Carat....");
    }
    let resultobj = {
      TrNo: this.TrNo,
      SrNo: this.SrNo,
      Name: this.Name,
      CARAT: this.CARAT
    };
    this.MemoInSer.GetTrnFlagSaveCarat(resultobj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.success("Save Succesfully");
        } else {
          this.toastr.error("Something went Wrong!!");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }
  Close(){
    this._mdr.close();
  }
}

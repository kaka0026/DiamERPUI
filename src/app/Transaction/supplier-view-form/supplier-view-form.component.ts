import { Component, OnInit, Inject } from '@angular/core';
import { SupllierServiceService } from "../../Services/Transaction/supllier-service.service";
import { ToastrService } from "ngx-toastr";
import * as $ from 'jquery';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-supplier-view-form',
  templateUrl: './supplier-view-form.component.html',
  styleUrls: ['./supplier-view-form.component.css']
})
export class SupplierViewFormComponent implements OnInit {

  ImageUrl = environment.ImageUrl;

  profileImage: any = "";
  gstImage: any = "";
  panImage: any = "";
  SupplierInfo: any = "";
  SupplierBankDetail = [];
  SupplierKeyPerDetail = [];
  SupplierAddDetail = [];
  panFileImage: any = "";
  VERIFY2: boolean = false;
  WHATSAPP2: boolean = false;
  WHATSAPP1: boolean = false;
  VERIFY1: boolean = false;

  constructor(
    public dialog: MatDialog,
    private SupllierServiceSer: SupllierServiceService,
    private toastr: ToastrService,
    private _mdr: MatDialogRef<SupplierViewFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    let ResObj = {
      ClientID: data.CLIENTID,
      Name: data.NAME,
      C_Type: "S"
    };
    this.SupllierServiceSer.SupplierFill(ResObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SupplierInfo = Result.Data[0];
          let ProfilrImage = this.SupplierInfo.ProfileImage
          let ProfExt = ProfilrImage.substring(ProfilrImage.lastIndexOf('.') + 1);
          if (ProfilrImage != "") {
            if (ProfExt == "PDF" || ProfExt == "pdf") {
              this.profileImage = this.ImageUrl + ProfilrImage;
            } else {
              this.profileImage = this.ImageUrl + ProfilrImage;
            }
          }
          let panfilrImage = this.SupplierInfo.PAN_PHOTO
          let panfExt = panfilrImage.substring(panfilrImage.lastIndexOf('.') + 1);
          if (panfilrImage != "") {
            if (panfExt == "PDF" || panfExt == "pdf") {
              this.panImage = this.ImageUrl + panfilrImage;
            } else {
              this.panImage = this.ImageUrl + panfilrImage;
            }
          }
          let gstfilrImage = this.SupplierInfo.GST_PHOTO
          let gstfExt = gstfilrImage.substring(gstfilrImage.lastIndexOf('.') + 1);
          if (gstfilrImage != "") {
            if (gstfExt == "PDF" || gstfExt == "pdf") {
              this.gstImage = this.ImageUrl + gstfilrImage;
            } else {
              this.gstImage = this.ImageUrl + gstfilrImage;
            }
          }
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    this.SupllierServiceSer.SpplierBank({
      BID: "",
      SupplierId: data.CLIENTID
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SupplierBankDetail = Result.Data;
        } else if (Result.Success == 0) {
          this.SupplierBankDetail = [];
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.SupllierServiceSer.SpplierKey({
      KPID: "",
      SupplierId: data.CLIENTID
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SupplierKeyPerDetail = Result.Data;
        } else if (Result.Success == 0) {
          this.SupplierKeyPerDetail = [];
        }
        else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.SupllierServiceSer.SpplierAdd({
      ID: "",
      SupplierId: data.CLIENTID
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.SupplierAddDetail = Result.Data;
        } else if (Result.Success == 0) {
          this.SupplierAddDetail = [];
        }
        else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }

  ngOnInit(): void {
  }
  Close() {
    this._mdr.close();
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ClientServiceService } from '../../Services/Transaction/client-service.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from "jquery";

@Component({
  selector: 'app-client-view-form',
  templateUrl: './client-view-form.component.html',
  styleUrls: ['./client-view-form.component.css']
})
export class ClientViewFormComponent implements OnInit {

  private ImageUrl = environment.ImageUrl;

  PHOTOID: any = '';
  PHOTOIDframe: any = '';
  ClientInfo: any = "";
  GSTImage: any = '';
  GSTImageframe: any = '';
  gender: any = "";
  PanImage: any = '';
  AdharImageframe: any = '';
  PanImageframe: any = '';
  profileImage: any = "";
  ClientID: any = "";
  ClientContactDetail = [];
  AdharImage: any = '';
  primaryaddress: any = "";
  otheraddresslist = [];
  PhotoState: any = "";

  constructor(
    private ClientServiceSer: ClientServiceService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<ClientViewFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer,
  ) {
    this.ClientID = data.CLIENTID;
    let addressprmaryobj = {
      ClientID: this.ClientID,
      ID: 0,
      primary: 1
    };
    this.ClientServiceSer.ClientAdd(addressprmaryobj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.primaryaddress = Result.Data[0];
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    let addressobj = {
      ClientID: this.ClientID,
      ID: 0,
      primary: 0
    };
    this.ClientServiceSer.ClientAdd(addressobj).subscribe(Result => {
      try {

        if (Result.Success == 1) {
          this.otheraddresslist = Result.Data;
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    let ResObj = {
      ClientID: data.CLIENTID,
      Name: data.NAME,
      C_Type: "C"
    };
    this.ClientServiceSer.ClientFill(ResObj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ClientInfo = Result.Data[0];
          this.PhotoState = this.ClientInfo.GST_NO.substring(0, 2);
          if (this.ClientInfo.Gender == "M") {
            this.gender = "Male";
          }
          else if (this.ClientInfo.Gender == "M") {
            this.gender = "FeMale";
          }
          let ProfilrImage = this.ClientInfo.ProfileImage
          let ProfExt = ProfilrImage.substring(ProfilrImage.lastIndexOf('.') + 1);
          if (ProfilrImage != "") {
            if (ProfExt == "PDF" || ProfExt == "pdf") {
              this.profileImage = this.ImageUrl + ProfilrImage;
            } else {
              this.profileImage = this.ImageUrl + ProfilrImage;
            }
          }
          let PanImageName = this.ClientInfo.PAN_PHOTO
          let PanExt = PanImageName.substring(PanImageName.lastIndexOf('.') + 1);
          if (PanImageName != "") {
            if (PanExt == "PDF" || PanExt == "pdf") {
              $("#panimg").css("display", "none");
              $("#panfrm").css("display", "block");
              this.PanImageframe = this.ImageUrl + PanImageName;
            } else {
              this.PanImage = this.ImageUrl + PanImageName;
            }
          }
          let GSTImageName = this.ClientInfo.GST_PHOTO
          let GSTExt = GSTImageName.substring(GSTImageName.lastIndexOf('.') + 1);
          if (GSTImageName != "") {
            if (GSTExt == "PDF" || GSTExt == "pdf") {
              $("#gstimg").css("display", "none");
              $("#gstfrm").css("display", "block");
              this.GSTImageframe = this.ImageUrl + GSTImageName;
            } else {
              this.GSTImage = this.ImageUrl + GSTImageName;
            }
          }
          let AdharImageName = this.ClientInfo.ADHAR_ID_PHOTO
          let AdharExt = AdharImageName.substring(AdharImageName.lastIndexOf('.') + 1);
          if (AdharImageName != "") {
            if (AdharExt == "PDF" || AdharExt == "pdf") {
              $("#adharimg").css("display", "none");
              $("#adharfrm").css("display", "block");
              this.AdharImageframe = this.ImageUrl + AdharImageName;
            } else {
              this.AdharImage = this.ImageUrl + AdharImageName;
            }
          }
          let PhotoIdImageName = this.ClientInfo.PHOTO_ID_PHOTO
          let PhotoIdExt = PhotoIdImageName.substring(PhotoIdImageName.lastIndexOf('.') + 1);
          if (PhotoIdImageName != "") {
            if (PhotoIdExt == "PDF" || PhotoIdExt == "pdf") {
              $("#photoidimg").css("display", "none");
              $("#photoidfrm").css("display", "block");
              this.PHOTOIDframe = this.ImageUrl + PhotoIdImageName;
            } else {
              this.PHOTOID = this.ImageUrl + PhotoIdImageName;
            }
          }
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }

  ngOnInit(): void {
    this.ClientServiceSer.getClientDetailGrid({ ClientID: this.ClientID }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ClientContactDetail = Result.Data

        } else {
        }
      } catch (err) {

        this.toastr.error(err);
      }
    });
  }
  Close() {
    this._mdr.close();
  }
}

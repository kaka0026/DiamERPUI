import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BrokerServiceService } from '../../Services/Transaction/broker-service.service';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-broker-view-form',
  templateUrl: './broker-view-form.component.html',
  styleUrls: ['./broker-view-form.component.css']
})
export class BrokerViewFormComponent implements OnInit {

  private ImageUrl = environment.ImageUrl;

  PHOTOID: any = "";
  ClientInfo: any = "";
  GSTImage: any = "";

  PanImage: any = "";
  profileImage: any = "";
  MAPLINK: any = "";
  OFFMAPLINK: any = "";

  constructor(
    private BrokerServiceSer: BrokerServiceService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<BrokerViewFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
  ) {
    let ResObj = {
      ClientID: data.CLIENTID,
      Name: data.NAME,
      C_Type: "B"
    };
    this.BrokerServiceSer.BrokerFill(ResObj).subscribe(Result => {

      try {
        if (Result.Success == 1) {
          this.ClientInfo = Result.Data[0];
          this.MAPLINK = this.sanitizer.bypassSecurityTrustUrl(this.ClientInfo.Residence_Map_Link);
          this.OFFMAPLINK = this.sanitizer.bypassSecurityTrustUrl(this.ClientInfo.Office_Map_Link);
          let ProfilrImage = this.ClientInfo.ProfileImage
          let ProfExt = ProfilrImage.substring(ProfilrImage.lastIndexOf('.') + 1);
          if (ProfilrImage != "") {
            if (ProfExt == "PDF" || ProfExt == "pdf") {
              this.profileImage = this.sanitizer.bypassSecurityTrustUrl(this.ImageUrl + ProfilrImage);
            } else {
              this.profileImage = this.sanitizer.bypassSecurityTrustUrl(this.ImageUrl + ProfilrImage);
            }
          }
          let PanImageName = this.ClientInfo.PAN_PHOTO
          let PanExt = PanImageName.substring(PanImageName.lastIndexOf('.') + 1);
          if (PanImageName != "") {
            if (PanExt == "PDF" || PanExt == "pdf") {
              this.PanImage = this.sanitizer.bypassSecurityTrustUrl(this.ImageUrl + PanImageName);
            } else {
              this.PanImage = this.sanitizer.bypassSecurityTrustUrl(this.ImageUrl + PanImageName);
            }
            let GSTImageName = this.ClientInfo.GST_PHOTO
            let GSTExt = GSTImageName.substring(GSTImageName.lastIndexOf('.') + 1);
            if (GSTImageName != "") {
              if (GSTExt == "PDF" || GSTExt == "pdf") {
                this.GSTImage = this.sanitizer.bypassSecurityTrustUrl(this.ImageUrl + GSTImageName);
              } else {
                this.GSTImage = this.sanitizer.bypassSecurityTrustUrl(this.ImageUrl + GSTImageName);
              }
            }
          }
          let PhotoIdImageName = this.ClientInfo.PHOTO_ID_PHOTO
          let PhotoIdExt = PhotoIdImageName.substring(PhotoIdImageName.lastIndexOf('.') + 1);
          if (PhotoIdImageName != "") {
            if (PhotoIdExt == "PDF" || PhotoIdExt == "pdf") {
              this.PHOTOID = this.sanitizer.bypassSecurityTrustUrl(this.ImageUrl + PhotoIdImageName);
            } else {
              this.PHOTOID = this.sanitizer.bypassSecurityTrustUrl(this.ImageUrl + PhotoIdImageName);
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
  }

  Close() {
    this._mdr.close();
  }

}

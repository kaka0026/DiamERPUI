import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ClientServiceService } from "../../Services/Transaction/client-service.service";
import { BrokerServiceService } from "../../Services/Transaction/broker-service.service";
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { LivelocationComponent } from "../livelocation/livelocation.component";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../../../environments/environment';
import { PermissionService } from 'src/app/Services/Access/permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as $ from "jquery";

@Component({
  selector: 'app-save-update-broker',
  templateUrl: './save-update-broker.component.html',
  styleUrls: ['./save-update-broker.component.css']
})
export class SaveUpdateBrokerComponent implements OnInit {
  @ViewChild('CMPANYID') CompnyIdElement: ElementRef;

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  private ImageUrl = environment.ImageUrl;

  ID: number = 0;
  PhotoIdName: any = "";
  ProfilevalidPicName = null;
  SupplierList = [];
  ProfileImageName: any = "";
  ProfileUplaodURL: any = "";
  ProfilePicBlob: File = null;
  profilrname: any = "";
  NAME: any = "";
  CLIENTID: any = "";
  profileextention: any = "";
  mobile1List = [];
  mobile2List = [];
  MOB1: any = "";
  MOB1VAL: any = "";
  MOB2: any = "";
  MOB2VAL: any = "";
  EMAIL2: any = "";
  EMAIL1: any = "";
  EmailId: any = "";
  Name: any = "";
  GST: any = "";
  PAN: any = "";
  PHOTOID: any = "";
  GstfileUplaodURL: any = "";
  GstfilePicBlob: File = null;
  GstfilevalidPicName = null;
  GstfileImageName: any = "";
  PhotoIdfileUplaodURL: any = "";
  PhotoIdfilePicBlob: File = null;
  PhotoIdfilevalidPicName = null;
  PhotoIdfileImageName: any = "";
  PanfileUplaodURL: any = "";
  PanfilePicBlob: File = null;
  PanfilevalidPicName = null;
  PanfileImageName: any = "";
  photoidextention: any = "";
  gstextention: any = "";
  panextention: any = "";
  PLOTNO: any = "";
  OFFSOS: any = "";
  OFFROAD: any = "";
  OFFAREA: any = "";
  OFFCOUNTRY: any = "";
  OFFSTATE: any = "";
  OFFCITY: any = "";
  OFFZIP: any = "";
  OFFLiveLoc: any = "";
  OFFPHONECODE: any = "";
  OFFPHONE: any = "";
  FLATNO: any = "";
  RESSOS: any = "";
  RESROAD: any = "";
  RESAREA: any = "";
  RESCOUNTRY: any = "";
  RESSTATE: any = "";
  RESCITY: any = "";
  RESZIP: any = "";
  RESLiveLoc: any = "";
  RESPHONE: any = "";
  OFFLiveLoc1: any = "";
  RESLiveLoc1: any = "";
  ResZIPFill = [];
  ResCityFill = [];
  ResStateFill = [];
  ResCountryFill = [];
  OffCountryList = [];
  OffZIPFill = [];
  OffCityFill = [];
  OffStateFill = [];
  OffCountryFill = [];
  WHATSAPP2: boolean = false;
  WHATSAPP1: boolean = false;
  ResCountryName: any = "";
  ResStateName: any = "";
  ResCityName: any = "";
  OffCountryName: any = "";
  OffStateName: any = "";
  OffCityName: any = "";
  GstName: any = "";
  PanName: any = "";
  Mob1CODE = new FormControl();
  Mob2CODE = new FormControl();
  EDIT: boolean = false;
  ModelImage: any = "";
  UPDATESUP: boolean = false;

  constructor(
    private ClientServiceSer: ClientServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    public BrokerServiceSer: BrokerServiceService,
    private DesignOprationSer: DesignOprationService,
    private PermissionSer: PermissionService
  ) {
    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "BrokerList.aspx"
    }
    this.PermissionSer.PageWisePermissionFill(ObjResult25).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          if (Result.Data[0].ISEDIT == "False") {
            this.EDIT = false;
          } else {
            this.EDIT = true;
          }
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });

    this.ClientServiceSer.ContryExtnoFill({}).subscribe(Result => {
      try {

        if (Result.Success == 1) {
          this.mobile1List = Result.Data.map(item => {
            return {
              CON_NAME: item.CON_NAME,
              CON_EXTNO: item.CON_EXTNO,
              ConCodeName: item.ConCodeName
            }
          });
          this.mobile2List = Result.Data.map(item => {
            return {
              CON_NAME: item.CON_NAME,
              CON_EXTNO: item.CON_EXTNO,
              ConCodeName: item.ConCodeName
            }
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.ClientServiceSer.ContryFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ResCountryFill = Result.Data.map(item => {
            return {
              CON_NAME: item.CON_NAME,
              CON_CODE: item.CON_CODE
            }
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.ClientServiceSer.ContryFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.OffCountryFill = Result.Data.map(item => {
            return {
              CON_NAME: item.CON_NAME,
              CON_CODE: item.CON_CODE
            }
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }

  ngOnInit(): void {

    if (localStorage.getItem("BrokerClientID")) {
      this.spinner.show();
      let ResObj = {
        ClientID: localStorage.getItem("BrokerClientID"),
        Name: "",
        C_Type: "B"
      };
      this.BrokerServiceSer.BrokerFill(ResObj).subscribe(FillRes => {
        localStorage.removeItem("BrokerClientID");
        try {
          if (FillRes.Success == 1) {
            $("#clear").hide();
            this.ID = FillRes.Data[0].ID;
            this.NAME = FillRes.Data[0].Name;
            this.CLIENTID = FillRes.Data[0].ClientID;
            this.UPDATESUP = true;
            this.Name = FillRes.Data[0].Name;
            this.EmailId = FillRes.Data[0].Email1;
            this.MOB2VAL = FillRes.Data[0].Mobile_2_NO;
            this.EMAIL1 = FillRes.Data[0].Email1;
            this.EMAIL2 = FillRes.Data[0].Email2;
            this.PAN = FillRes.Data[0].PAN_NO;
            this.GST = FillRes.Data[0].GST_NO;
            this.PHOTOID = FillRes.Data[0].PHOTO_ID_NO;
            this.PanfileUplaodURL = this.ImageUrl + FillRes.Data[0].PAN_PHOTO;
            this.GstfileUplaodURL = this.ImageUrl + FillRes.Data[0].GST_PHOTO;
            this.ProfileUplaodURL = this.ImageUrl + FillRes.Data[0].ProfileImage;
            this.PhotoIdfileUplaodURL = this.ImageUrl + FillRes.Data[0].PHOTO_ID_PHOTO;
            this.profilrname = FillRes.Data[0].ProfileImage;
            this.GstName = FillRes.Data[0].GST_PHOTO;
            this.PanName = FillRes.Data[0].PAN_PHOTO;
            this.PhotoIdName = FillRes.Data[0].PHOTO_ID_PHOTO;
            this.FLATNO = FillRes.Data[0].Residence_Flat_No;
            this.RESSOS = FillRes.Data[0].Residence_Society;
            this.RESROAD = FillRes.Data[0].Residence_Road;
            this.RESAREA = FillRes.Data[0].Residence_Area;

            this.RESLiveLoc = FillRes.Data[0].Residence_Map_Link;
            this.RESLiveLoc1 = FillRes.Data[0].Residence_Map_Link;
            this.OFFLiveLoc1 = FillRes.Data[0].Office_Map_Link;
            this.OFFLiveLoc = FillRes.Data[0].Office_Map_Link;
            this.RESPHONE = FillRes.Data[0].Residence_Phone;
            this.OFFPHONE = FillRes.Data[0].Office_Phone;
            this.PLOTNO = FillRes.Data[0].Office_plot_Or_Office_No;
            this.OFFSOS = FillRes.Data[0].Office_Society_Or_Apartment;
            this.OFFROAD = FillRes.Data[0].Office_Road;
            this.OFFAREA = FillRes.Data[0].Office_Area;
            this.spinner.show();
            if (FillRes.Data[0].Office_Country != 0) {
              this.OFFCOUNTRY = FillRes.Data[0].Office_Country;
              this.OffCountryName = FillRes.Data[0].Office_Country_Name;
              this.OffcountryChanged();
            }
            if (FillRes.Data.Office_State != 0) {
              this.OFFSTATE = FillRes.Data[0].Office_State;
              this.OffStateName = FillRes.Data[0].Office_State_Name;
              this.OffstateChanged();
            }
            if (FillRes.Data[0].Office_City != 0) {
              this.OFFCITY = FillRes.Data[0].Office_City;
              this.OffCityName = FillRes.Data[0].Office_City_Name;
              this.OffCityChanged();
            }
            if (FillRes.Data[0].Office_Zip != 0) {
              this.OFFZIP = FillRes.Data[0].Office_Zip;
              this.spinner.hide();
            }
            if (FillRes.Data[0].Residence_Country != 0) {
              this.RESCOUNTRY = FillRes.Data[0].Residence_Country;
              this.ResCountryName = FillRes.Data[0].Residence_Country_Name;
              this.RescountryChanged();
            }
            if (FillRes.Data[0].Residence_State != 0) {
              this.RESSTATE = FillRes.Data[0].Residence_State;
              this.ResStateName = FillRes.Data[0].Residence_State_Name;
              this.ResstateChanged();
            }
            if (FillRes.Data[0].Residence_City != 0) {
              this.RESCITY = FillRes.Data[0].Residence_City;
              this.ResCityName = FillRes.Data[0].Residence_City_Name;
              this.ResCityChanged();
            }
            if (FillRes.Data[0].Residence_Zip != 0) {
              this.RESZIP = FillRes.Data[0].Residence_Zip;
            }
            if (FillRes.Data[0].IsWhatsApp1 == true) {
              this.WHATSAPP1 = true;
            } else if (FillRes.Data[0].IsWhatsApp1 == false) {
              this.WHATSAPP1 = false;
            }
            if (FillRes.Data[0].IsWhatsApp2 == true) {
              this.WHATSAPP2 = true;
            } else if (FillRes.Data[0].IsWhatsApp2 == false) {
              this.WHATSAPP2 = false;
            }
            this.MOB1VAL = FillRes.Data[0].Mobile_1_NO;
            if (FillRes.Data[0].Mobile_1_CC_Code != 0) {
              setTimeout(() => {
                const toSelect1 = this.mobile1List.find(c => c.CON_EXTNO == FillRes.Data[0].Mobile_1_CC_Code);
                setTimeout(() => {
                  this.spinner.hide();
                  this.MOB1 = toSelect1.ConCodeName;
                }, 1000);
              }, 1000);
            }
            if (FillRes.Data[0].Mobile_2_CC_Code != 0) {
              setTimeout(() => {
                const toSelect2 = this.mobile2List.find(c => c.CON_EXTNO == FillRes.Data[0].Mobile_2_CC_Code);
                setTimeout(() => {
                  this.MOB2 = toSelect2.ConCodeName;
                }, 1000);
              }, 1000);
            }
            this.setSupplierlist(FillRes.Data[0].Name);
          } else {
            this.spinner.hide();
            this.toastr.info("New party code not found.");
          }
        } catch (err) {
          this.toastr.error(err);
          this.spinner.hide();
        }
      });
    }
    this.spinner.hide();
  }
  ProPicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {

      let ProfilePicExt = fileList[0].name.split('.').pop().toUpperCase();
      this.profileextention = fileList[0].name.split('.').pop();
      if (ProfilePicExt == 'PNG' || ProfilePicExt == 'JPG' || ProfilePicExt == 'JPEG' || ProfilePicExt == 'MP4' || ProfilePicExt == 'MOV') {
        this.ProfilevalidPicName = fileList[0].name;
        this.ProfilePicBlob = fileList[0];
        this.ProfileImageName = fileList[0].name;
      }
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.ProfileUplaodURL = reader.result;

        reader.readAsDataURL(file);
      }
      return;
    }
  }
  setSupplierlist(e: any) {
    this.BrokerServiceSer.GetSupplierNameBrokerWiser({ BrokerName: e }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          if (Result.Data) {
            this.SupplierList = Result.Data.map(item => {
              return {
                Name: item.NAME,
              }
            });
          }
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  GstPicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.gstextention = fileList[0].name.split('.').pop();
      let GstPicExt = fileList[0].name.split('.').pop().toUpperCase();

      if (GstPicExt == 'PNG' || GstPicExt == 'JPG' || GstPicExt == 'JPEG' || GstPicExt == 'MP4' || GstPicExt == 'MOV') {
        this.GstfilevalidPicName = fileList[0].name;
        this.GstfilePicBlob = fileList[0];
        this.GstfileImageName = fileList[0].name;
      }
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.GstfileUplaodURL = reader.result;

        reader.readAsDataURL(file);
      }
      return;
    }
  }
  PhotoIdPicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.photoidextention = fileList[0].name.split('.').pop();
      let PhotoIdPicExt = fileList[0].name.split('.').pop().toUpperCase();

      if (PhotoIdPicExt == 'PNG' || PhotoIdPicExt == 'JPG' || PhotoIdPicExt == 'JPEG' || PhotoIdPicExt == 'MP4' || PhotoIdPicExt == 'MOV') {
        this.PhotoIdfilevalidPicName = fileList[0].name;
        this.PhotoIdfilePicBlob = fileList[0];
        this.PhotoIdfileImageName = fileList[0].name;
      }
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.PhotoIdfileUplaodURL = reader.result;

        reader.readAsDataURL(file);
      }
      return;
    }
  }
  PanPicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.panextention = fileList[0].name.split('.').pop();
      let PanPicExt = fileList[0].name.split('.').pop().toUpperCase();

      if (PanPicExt == 'PNG' || PanPicExt == 'JPG' || PanPicExt == 'JPEG' || PanPicExt == 'MP4' || PanPicExt == 'MOV') {
        this.PanfilevalidPicName = fileList[0].name;
        this.PanfilePicBlob = fileList[0];
        this.PanfileImageName = fileList[0].name;
      }
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.PanfileUplaodURL = reader.result;

        reader.readAsDataURL(file);
      }
      return;
    }
  }
  GetClientId() {
    if (this.UPDATESUP == false) {
      if (this.NAME.trim() != "") {
        this.spinner.show();
        this.ClientServiceSer.VerifySupplier({ NAME: this.NAME, Type: "B" }).then((Res) => {
          try {
            if (Res.data == 'TRUE') {
              this.ClientServiceSer.GetUserCode({ name: this.NAME, Type: "B" }).subscribe(Result => {
                try {
                  if (Result.Success == 1) {
                    this.spinner.hide();
                    this.CLIENTID = Result.Data[0].Code;
                  } else {
                    this.spinner.hide();
                  }
                } catch (err) {
                  this.spinner.hide();
                  this.toastr.error(err);
                }
              });
            } else {
              this.toastr.warning(Res.data)
              this.CompnyIdElement.nativeElement.focus();
            }
          } catch (error) {
            this.toastr.error(error)
          }
        })
        this.spinner.hide();
      }
    }
  }
  delete(E: any, Element) {
    if (E == "gst") {
      this.GstfileUplaodURL = "";
      this.GstfilePicBlob = null;
      this.GstfilevalidPicName = null;
      this.GstfileImageName = "";
      Element.value = "";
    }
    if (E == "pan") {
      this.PanfileUplaodURL = "";
      this.PanfilePicBlob = null;
      this.PanfilevalidPicName = null;
      this.PanfileImageName = "";
      Element.value = "";
    }
    if (E == "PhotoId") {
      this.PhotoIdfileUplaodURL = "";
      this.PhotoIdfilePicBlob = null;
      this.PhotoIdfilevalidPicName = null;
      this.PhotoIdfileImageName = "";
      Element.value = "";
    }
  }
  RegSetLocation(E) {
    let a = "";
    let lag = "";
    let lat = "";
    if (E == "RES") {
      if (this.RESLiveLoc) {
        a = this.RESLiveLoc;
        let x = a.split('=');
        let m = x[2].split(',');
        lag = m[0];
        lat = m[1];
      } else if (this.RESLiveLoc1) {
        a = this.RESLiveLoc1;
        let x = a.split('=');
        let m = x[2].split(',');
        lag = m[0];
        lat = m[1];
      }
    } if (E == "OFF") {
      if (this.OFFLiveLoc) {
        a = this.OFFLiveLoc;
        let x = a.split('=');
        let m = x[2].split(',');
        lag = m[0];
        lat = m[1];
      } else if (this.OFFLiveLoc1) {
        a = this.OFFLiveLoc1;
        let x = a.split('=');
        let m = x[2].split(',');
        lag = m[0];
        lat = m[1];
      }
    }
    const PRF = this.dialog.open(LivelocationComponent, {
      width: "80%",
      data: {
        langitude: lag,
        latitude: lat
      }
    });
    PRF.afterClosed().subscribe(result => {
      if (E == "RES") {
        this.RESLiveLoc = result == undefined ? this.RESLiveLoc : result;
        this.RESLiveLoc1 = "";
      } else if (E == "OFF") {
        this.OFFLiveLoc = result == undefined ? this.OFFLiveLoc : result;
        this.OFFLiveLoc1 = "";
      }
    });
  }
  getrescountry(e) {
    this.ResCountryName = e;
  }
  RescountryChanged() {
    this.spinner.show();
    this.RESCITY = "";
    this.RESSTATE = "";
    this.ResCityFill = [];
    this.ResStateFill = [];
    this.RESZIP = "";
    this.ResZIPFill = [];
    this.ClientServiceSer.StateFill({ CON_NAME: this.RESCOUNTRY }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ResStateFill = Result.Data.map(item => {
            return {
              REG_NAME: item.REG_NAME,
              REG_CODE: item.REG_CODE
            }

          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  getresstate(e) {
    this.ResStateName = e;
  }
  ResstateChanged() {
    this.spinner.show();
    this.RESCITY = "";
    this.ResCityFill = [];
    this.RESZIP = "";
    this.ResZIPFill = [];
    this.ClientServiceSer.CityFill({ CONNAME: this.RESCOUNTRY, REGCODE: this.RESSTATE }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ResCityFill = Result.Data.map(item => {
            return {
              CITY_NAME: item.CITY_NAME,
              CITY_CODE: item.CITY_CODE
            }

          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  getrescity(e) {
    this.ResCityName = e;
  }
  ResCityChanged() {
    this.spinner.show();
    this.RESZIP = "";
    this.ResZIPFill = [];
    this.ClientServiceSer.ZipCodeFill({ CITY_CODE: this.RESCITY }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ResZIPFill = Result.Data.map(item => {
            return {
              ZIP_CODE: item.ZIP_CODE.toString()
            }

          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  getoffcountry(e) {
    this.OffCountryName = e;
  }
  OffcountryChanged() {
    this.spinner.show();
    this.OFFCITY = "";
    this.OFFSTATE = "";
    this.OffCityFill = [];
    this.OffStateFill = [];
    this.OFFZIP = "";
    this.OffZIPFill = [];
    this.ClientServiceSer.StateFill({ CON_NAME: this.OFFCOUNTRY }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.OffStateFill = Result.Data.map(item => {
            return {
              REG_NAME: item.REG_NAME,
              REG_CODE: item.REG_CODE
            }

          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  getoffstate(e) {
    this.OffStateName = e;
  }
  OffstateChanged() {
    this.spinner.show();
    this.OFFCITY = "";
    this.OffCityFill = [];
    this.OFFZIP = "";
    this.OffZIPFill = [];
    this.ClientServiceSer.CityFill({ CONNAME: this.OFFCOUNTRY, REGCODE: this.OFFSTATE }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.OffCityFill = Result.Data.map(item => {
            return {
              CITY_NAME: item.CITY_NAME,
              CITY_CODE: item.CITY_CODE
            }

          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  getoffcity(e) {
    this.OffCityName = e;
  }
  OffCityChanged() {
    this.spinner.show();
    this.OFFZIP = "";
    this.OffZIPFill = [];
    this.ClientServiceSer.ZipCodeFill({ CITY_CODE: this.OFFCITY }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.OffZIPFill = Result.Data.map(item => {
            return {
              ZIP_CODE: item.ZIP_CODE.toString()
            }

          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }

  validEmailcheck(e) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.toastr.clear();
    if (e == "EMAIL1") {

      if (re.test(this.EMAIL1)) {

      } else {

        this.spinner.hide();
        this.toastr.warning("Enter Valid Email Address", "E-maill");
        this.EMAIL1 = "";
      }
    }
    if (e == "EMAIL2") {
      if (re.test(this.EMAIL2)) {

      } else {

        this.spinner.hide();
        this.toastr.warning("Enter Valid Email Address", "E-maill");
        this.EMAIL2 = "";
      }
    }
  }

  Clear() {
    this.ID = 0;
    this.NAME = "";
    this.CLIENTID = "";
    this.MOB1 = "";
    this.MOB1VAL = "";
    this.WHATSAPP1 = false;
    this.WHATSAPP2 = false;
    this.MOB2 = "";
    this.MOB2VAL = "";
    this.EMAIL1 = "";
    this.EMAIL2 = "";
    this.PAN = "";
    this.PanfileUplaodURL = ""
    this.GST = "";
    this.GstfileUplaodURL = "";
    this.PHOTOID = "";
    this.PhotoIdfileUplaodURL = "";
    this.FLATNO = "";
    this.RESSOS = "";
    this.RESROAD = "";
    this.RESAREA = "";
    this.RESCOUNTRY = "";
    this.RESSTATE = "";
    this.RESCITY = "";
    this.RESZIP = "";
    this.RESLiveLoc = "";
    this.RESPHONE = "";
    this.PLOTNO = "";
    this.OFFSOS = "";
    this.OFFROAD = "";
    this.OFFAREA = "";
    this.OFFCOUNTRY = "";
    this.OFFSTATE = "";
    this.OFFCITY = "";
    this.OFFZIP = "";
    this.OFFLiveLoc = "";
    this.OFFPHONECODE = "";
    this.OFFPHONE = "";
    this.ProfileUplaodURL = "";
    this.ResCityName = "";
    this.ResCountryName = "";
    this.ResStateName = "";
    this.OffCityName = "";
    this.OffCountryName = "";
    this.OffStateName = "";
  }
  Save() {
    if (this.NAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Name", "Name");

      return;
    }
    if (this.MOB1 == "" || this.Mob1CODE.value.toString() == "" || this.Mob1CODE.value == null) {
      this.toastr.clear()
      this.toastr.warning("Select Mobile CC Code", "Mobile 1");
      return;
    }
    if (this.MOB1VAL == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Mobile No.", "Mobile 1");
      return;
    }
    if (this.EMAIL1 == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Email Address", "Email 1");
      return;
    }
    this.spinner.show();
    let DateFOrmate = formatDate(new Date(), 'dd_MM_yyyy_hh_mm_ss', 'en_US')
    let profilefilename
    let panfilename
    let photoidfilename
    let gstfilename
    if (this.ProfilePicBlob) {
      profilefilename = "Profile_" + DateFOrmate + '.' + this.profileextention;
    } else {
      profilefilename = this.profilrname;
    }
    if (this.PanfilePicBlob) {
      panfilename = "PAN_" + DateFOrmate + '.' + this.panextention;
    } else {
      panfilename = this.PanName;
    }
    if (this.GstfilePicBlob) {
      gstfilename = "GST_" + DateFOrmate + '.' + this.gstextention;
    } else {
      gstfilename = this.GstName;
    }
    if (this.PhotoIdfilePicBlob) {
      photoidfilename = "PHOTO_PROOF_" + DateFOrmate + '.' + this.photoidextention;
    } else {
      photoidfilename = this.PhotoIdName;
    }
    let ObjRes;
    ObjRes = {
      "ID": this.ID,
      "ClientID": this.CLIENTID,
      "Name": this.NAME,
      "Mobile_1_CC_Code_Name": this.MOB1,
      "Mobile_1_NO": this.MOB1VAL,
      "Mobile_2_CC_Code_Name": this.MOB2,
      "Mobile_2_NO": this.MOB2VAL,
      "Email1": this.EMAIL1,
      "Email2": this.EMAIL2,
      "PAN_NO": this.PAN,
      "PAN_PHOTO": panfilename,
      "GST_NO": this.GST,
      "GST_PHOTO": gstfilename,
      "PHOTO_ID_NO": this.PHOTOID,
      "PHOTO_ID_PHOTO": photoidfilename,
      "Office_plot_Or_Office_No": this.PLOTNO,
      "Office_Society_Or_Apartment": this.OFFSOS,
      "Office_Area": this.OFFAREA,
      "Office_Road": this.OFFROAD,
      "Office_Country_Name": this.OffCountryName,
      "Office_State_Name": this.OffStateName,
      "Office_City_Name": this.OffCityName,
      "Office_Zip": this.OFFZIP,
      "Office_Map_Link": this.OFFLiveLoc,
      "Office_Phone": this.OFFPHONE,
      "Residence_Flat_No": this.FLATNO,
      "Residence_Society": this.RESSOS,
      "Residence_Road": this.RESROAD,
      "Residence_Area": this.RESAREA,
      "Residence_Country_Name": this.ResCountryName,
      "Residence_State_Name": this.ResStateName,
      "Residence_City_Name": this.ResCityName,
      "Residence_Zip": this.RESZIP,
      "Residence_Map_Link": this.RESLiveLoc,
      "Residence_Phone": this.RESPHONE,
      "ProfileImage": profilefilename,
      "EntryBy": this.decodedTkn.UserId,
      "C_Type": "B",
      "IsWhatsApp1": this.WHATSAPP1 == true ? 1 : 0,
      "IsWhatsApp2": this.WHATSAPP2 == true ? 1 : 0,
    };
    this.BrokerServiceSer.BrokerSave(ObjRes).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.uploadimage(this.ProfilePicBlob, profilefilename);
          this.uploadimage(this.PanfilePicBlob, panfilename);
          this.uploadimage(this.GstfilePicBlob, gstfilename);
          this.uploadimage(this.PhotoIdfilePicBlob, photoidfilename);
          this.toastr.success("Saved SuccessFully!!!!!");
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  uploadimage(blob, filename) {
    let formData: FormData = new FormData();
    if (blob) {
      formData.append('files', blob, filename)
    }
    this.DesignOprationSer.upload(formData).subscribe(
      FillUplodRes => {
        this.spinner.hide();
      }
    );
  }
  OPENIMAGE(content, e) {
    if (e == "PAN") {
      this.ModelImage = this.PanfileUplaodURL;
    } else if (e == "GST") {
      this.ModelImage = this.GstfileUplaodURL;
    } else if (e == "PHOTOID") {
      this.ModelImage = this.PhotoIdfileUplaodURL;
    }
    if (this.ModelImage == "") {
      this.toastr.clear();
      this.toastr.info("Select an Image First");
      return
    } else {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      }, (reason) => {
      });
    }
  }
  setDefaultPic() {
    this.ModelImage = "./../../../assets/images/No-Image.jpg";
  }
  setDefaultPic1() {
    this.PhotoIdfileUplaodURL = "./../../../assets/images/No-Image.jpg";
  }
  setDefaultPic2() {
    this.GstfileUplaodURL = "./../../../assets/images/No-Image.jpg";
  }
  setDefaultPic3() {
    this.PanfileUplaodURL = "./../../../assets/images/No-Image.jpg";
  }
  setDefaultPic4() {
    this.ProfileUplaodURL = "./../../../assets/images/No-Image.jpg";
  }
}

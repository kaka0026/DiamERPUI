import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ClientServiceService } from "../../Services/Transaction/client-service.service";
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { SupllierServiceService } from "../../Services/Transaction/supllier-service.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { formatDate } from "@angular/common";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { LivelocationComponent } from "../livelocation/livelocation.component";
import PerfectScrollbar from "perfect-scrollbar";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../../../environments/environment';
import { PermissionService } from 'src/app/Services/Access/permission.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PurchaseService } from 'src/app/Services/Transaction/purchase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as $ from "jquery";

export interface Lot1 {
  name: string;
  code: string;
}

@Component({
  selector: 'app-save-update-supplier',
  templateUrl: './save-update-supplier.component.html',
  styleUrls: ['./save-update-supplier.component.css']
})
export class SaveUpdateSupplierComponent implements OnInit {
  @ViewChild('CMPANYID') CompnyIdElement: ElementRef;
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  public columnDefsAdd;
  public gridApiAdd;
  public gridColumnApiAdd;
  public defaultColDefAdd;
  public AddnoRowsTemplate;
  public AddloadingTemplate;
  public columnDefsKey;
  public gridApiKey;
  public gridColumnApiKey;
  public defaultColDefKey;
  public KeynoRowsTemplate;
  public KeyloadingTemplate;
  public columnDefsBank;
  public gridApiBank;
  public gridColumnApiBank;
  public defaultColDefBank;
  public BanknoRowsTemplate;
  public BankloadingTemplate;
  private ImageUrl = environment.ImageUrl;

  Broker: FormControl;
  filteredBroker: Observable<any[]>;
  BrokerCode: any = "";
  BrokerArr: Lot1[] = [];
  BrokerName: any = '';

  GRID: boolean = false;

  Name: any = "";
  COMPANYNAME: any = "";
  CLIENTID: any = "";
  LiveLoc1: any = "";
  LiveLoc: any = "";
  PanfileUplaodURL: any = "";
  PAN: any = "";
  GST: any = "";
  PanfilePicBlob: File = null;
  PanfilevalidPicName = null;
  PanfileImageName: any = "";
  ProfilevalidPicName = null;
  ProfileImageName: any = "";
  GstfileUplaodURL: any = "";
  GstfilePicBlob: File = null;
  GstfilevalidPicName = null;
  GstfileImageName: any = "";
  PanKeyfileUplaodURL: any = "";
  PanKeyPicBlob: File = null;
  PanKeyvalidPicName = null;
  PanKeyImageName: any = "";
  ProfileUplaodURL: any = "";
  ProfilePicBlob: File = null;
  profilrname: any = "";
  pankeyname: any = "";
  GstName: any = "";
  PanName: any = "";
  gstextention: any = "";
  panextention: any = "";
  profileextention: any = "";
  PanKeyextention: any = "";
  ZIPFill = [];
  ZIP: any = "";
  CITY: any = "";
  CityFill = [];
  STATE: any = "";
  COUNTRY: any = "";
  CountryFill = [];
  StateFill = [];
  CityName: any = "";
  StateName: any = "";
  CountryName: any = "";
  AREA: any = "";
  ROAD: any = "";
  BUILDNO: any = "";
  TYOADD: any = "";
  OFFNO: any = "";
  SourceListAdd = [];
  SourceListKey = [];
  SourceListBank = [];
  DESIGNATION: any = "";
  DEPARTMENT: any = "";
  FIRSTNAME: any = "";
  LASTNAME: any = "";
  EMAIL1TYPE: any = "";
  EMAIL2TYPE: any = "";
  EMAIL1: any = "";
  EMAIL2: any = "";
  Mob1: any = "";
  Mob2: any = "";
  MOB1VIA: any = "";
  WHATSAPP1: boolean = false;
  VERIFY1: boolean = false;
  MOB2VIA: any = "";
  MOB1TYPE: any = "";
  MOB2TYPE: any = "";
  WHATSAPP2: boolean = false;
  VERIFY2: boolean = false;
  PANKEYPERSONE: any = "";
  BANKNAME: any = "";
  ACTTYPE: any = "";
  ActNo: any = "";
  IFSCCODE: any = "";
  BRANCHNAME: any = "";
  BRANCHADD: any = "";
  ID: number = 0;
  KPID: number = 0;
  BID: number = 0;
  SUPID: number = 0;
  EDIT: boolean = false;
  ModelImage: any = "";
  UPDATESUP: boolean = false;

  constructor(
    private ClientServiceSer: ClientServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    public dialog: MatDialog,
    private PurchaseSer: PurchaseService,
    private DesignOprationSer: DesignOprationService,
    private SupllierServiceSer: SupllierServiceService,
    private PermissionSer: PermissionService,
    private modalService: NgbModal
  ) {
    this.AddloadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.AddnoRowsTemplate =
      `<span>no rows to show</span>`;

    this.KeyloadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.KeynoRowsTemplate =
      `<span>no rows to show</span>`;

    this.BankloadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.BanknoRowsTemplate =
      `<span>no rows to show</span>`;

    this.Broker = new FormControl();

    this.PurchaseSer.BrokerFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.BrokerArr = Result.Data.map(item => {
            return {
              code: item.Name,
              name: item.Name,
              sortname: item.ClientID
            };
          });
          this.filteredBroker = this.Broker.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredBrokers(lot) : this.BrokerArr.slice()))
          );
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "SupplierList.aspx"
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
    let Url = this.ImageUrl;
    this.ClientServiceSer.ContryFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.CountryFill = Result.Data.map(item => {
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
    this.columnDefsAdd = [
      {
        headerName: "Action",
        field: "ClientID",
        cellStyle: { "text-align": "center" },
        width: 100,
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">'
          html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>'
          html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'

          return html + '</div>';
        }
      },
      {
        headerName: "Type Of Address",
        field: "AddressType",
        cellStyle: { "text-align": "center" },
        width: 126
      },
      {
        headerName: "Office No",
        field: "OfficeNumber",
        cellStyle: { "text-align": "center" },
        width: 110
      },
      {
        headerName: "Building No",
        field: "BuildingName",
        cellStyle: { "text-align": "center" },
        width: 115
      },
      {
        headerName: "Road",
        field: "Road",
        cellStyle: { "text-align": "center" },
        width: 126
      },
      {
        headerName: "Area",
        field: "Area",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Country",
        field: "Country_Name",
        cellStyle: { "text-align": "center" },
        width: 105
      },
      {
        headerName: "State",
        field: "State_Name",
        cellStyle: { "text-align": "center" },
        width: 105
      },
      {
        headerName: "City",
        field: "City_Name",
        cellStyle: { "text-align": "center" },
        width: 105
      },
      {
        headerName: "Zip-Code",
        field: "Zip",
        cellStyle: { "text-align": "center" },
        width: 105
      },
    ];
    this.defaultColDefAdd = {
      resizable: true,
      filter: true,
      sortable: true
    };
    this.columnDefsKey = [
      {
        headerName: "Action",
        field: "ClientID",
        cellStyle: { "text-align": "center" },
        width: 80,
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">'
          html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>'
          html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'

          return html + '</div>';
        }
      },
      {
        headerName: "Designation",
        field: "Designation",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "Department",
        field: "Department",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "First Name",
        field: "FirstName",
        cellStyle: { "text-align": "center" },
        width: 110
      },
      {
        headerName: "Last Name",
        field: "LastName",
        cellStyle: { "text-align": "center" },
        width: 110
      },
      {
        headerName: "Email-1 Type",
        field: "Email_Type_1",
        cellStyle: { "text-align": "center" },
        width: 130
      },
      {
        headerName: "Email 1",
        field: "Email_1",
        cellStyle: { "text-align": "center" },
        width: 126
      },
      {
        headerName: "Email-2 Type",
        field: "Email_Type_2",
        cellStyle: { "text-align": "center" },
        width: 130
      },
      {
        headerName: "Email 2",
        field: "Email_2",
        cellStyle: { "text-align": "center" },
        width: 126
      },
      {
        headerName: "Mobile1 Via",
        field: "Contact_Via_1",
        cellStyle: { "text-align": "center" },
        width: 130
      },
      {
        headerName: "Mobile-1 Type",
        field: "Contact_Type_1",
        cellStyle: { "text-align": "center" },
        width: 130
      },
      {
        headerName: "Mobile 1",
        field: "Contact_1",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "IsWhatsapp1",
        field: "IsWhatsApp_1",
        cellStyle: { "text-align": "center" },
        width: 120,
        cellRenderer: function (params) {
          if (params.data.IsWhatsApp_1 == true) {
            return '<input type="checkbox" checked disabled>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        headerName: "Verify1",
        field: "IsVerified_1",
        cellStyle: { "text-align": "center" },
        width: 110,
        cellRenderer: function (params) {
          if (params.data.IsVerified_1 == true) {
            return '<input type="checkbox" checked disabled>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        headerName: "Mobile2 Via",
        field: "Contact_Via_2",
        cellStyle: { "text-align": "center" },
        width: 130
      },
      {
        headerName: "Mobile-2 Type",
        field: "Contact_Type_2",
        cellStyle: { "text-align": "center" },
        width: 130
      },
      {
        headerName: "Mobile 2",
        field: "Contact_2",
        cellStyle: { "text-align": "center" },
        width: 120
      },
      {
        headerName: "IsWhatsapp2",
        field: "IsWhatsApp_2",
        cellStyle: { "text-align": "center" },
        width: 120,
        cellRenderer: function (params) {
          if (params.data.IsWhatsApp_2 == true) {
            return '<input type="checkbox" checked disabled>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        headerName: "Verify2",
        field: "IsVerified_2",
        cellStyle: { "text-align": "center" },
        width: 110,
        cellRenderer: function (params) {
          if (params.data.IsVerified_2 == true) {
            return '<input type="checkbox" checked disabled>';
          } else {
            return '<input type="checkbox" disabled>';
          }
        }
      },
      {
        headerName: "Pan",
        field: "Pan_No_KP",
        cellStyle: { "text-align": "center" },
        width: 100
      },
      {
        headerName: "Pan Image",
        field: "Pan_Photo_KP",
        cellStyle: { "text-align": "center" },
        width: 110,
        cellRenderer: function (params) {
          var html =
            '<div style="display:flex !important; " class="grid-btn-group">';
          if (params.data.Pan_Photo_KP) {
            html +=
              '<img id="image" style="width:30px; height:30px;" src="' + Url +
              params.data.Pan_Photo_KP +
              '"/>';
          }
          else {
            html +=
              '<img id="image" style="width:30px; height:30px;" src="./../../../assets/images/No-Image.jpg"/>';
          }
          return html + "</div>";
        }
      },
    ];
    this.defaultColDefKey = {
      resizable: true,
      filter: true,
      sortable: true
    };
    this.columnDefsBank = [
      {
        headerName: "Action",
        field: "ClientID",
        cellStyle: { "text-align": "center" },
        width: 90,
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">'
          html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>'
          html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'
          return html + '</div>';
        }
      },
      {
        headerName: "Bank Name",
        field: "BankName",
        cellStyle: { "text-align": "center" },
        width: 175
      },
      {
        headerName: "Account Type",
        field: "AccountType",
        cellStyle: { "text-align": "center" },
        width: 150
      },
      {
        headerName: "Account Number",
        field: "AccountNumber",
        cellStyle: { "text-align": "center" },
        width: 175
      },
      {
        headerName: "IFSC Code",
        field: "IFSCCode",
        cellStyle: { "text-align": "center" },
        width: 175
      },
      {
        headerName: "Branch Name",
        field: "BranchName",
        cellStyle: { "text-align": "center" },
        width: 175
      },
      {
        headerName: "Branch Address",
        field: "BranchAddress",
        cellStyle: { "text-align": "center" },
        width: 175
      },
    ];
    this.defaultColDefBank = {
      resizable: true,
      filter: true,
      sortable: true
    };
  }
  ngOnInit(): void {

    if (localStorage.getItem("SupplierClientID")) {
      this.spinner.show();
      let ResObj = {
        ClientID: localStorage.getItem("SupplierClientID"),
        Name: "",
        C_Type: "S"
      };
      this.SupllierServiceSer.SupplierFill(ResObj).subscribe(FillRes => {
        localStorage.removeItem("SupplierClientID");
        try {
          if (FillRes.Success == 1) {
            $("#clear").hide();
            this.UPDATESUP = true;
            this.Name = FillRes.Data[0].Name;
            this.SUPID = FillRes.Data[0].ID;
            this.COMPANYNAME = FillRes.Data[0].Name;
            this.CLIENTID = FillRes.Data[0].ClientID;
            this.PAN = FillRes.Data[0].PAN_NO;
            this.BrokerCode = FillRes.Data[0].BrokerName;
            this.PanfileUplaodURL = this.ImageUrl + FillRes.Data[0].PAN_PHOTO;
            this.GstfileUplaodURL = this.ImageUrl + FillRes.Data[0].GST_PHOTO;
            this.ProfileUplaodURL = this.ImageUrl + FillRes.Data[0].ProfileImage;
            this.PanName = FillRes.Data[0].PAN_PHOTO;
            this.GstName = FillRes.Data[0].GST_PHOTO;
            this.profilrname = FillRes.Data[0].ProfileImage;
            this.GST = FillRes.Data[0].GST_NO;
            this.GRID = true;
            this.LoadGridAdd();
            this.LoadGridBank();
            this.LoadGridKeyPer();
            this.spinner.hide();
          } else {
            this.toastr.info("New party code not found.");
            this.spinner.hide();
          }
        } catch (err) {
          this.toastr.error(err);
          this.spinner.hide();
        }
      });
      this.spinner.hide();
    }
    this.spinner.hide();
  }
  filteredBrokers(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.BrokerArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  GetClientId() {
    if (this.UPDATESUP == false) {
      if (this.COMPANYNAME.trim() != "") {
        this.spinner.show();
        this.ClientServiceSer.VerifySupplier({ NAME: this.COMPANYNAME, Type: "S" }).then((Res) => {
          try {
            if (Res.data == 'TRUE') {
              this.ClientServiceSer.GetUserCode({ name: this.COMPANYNAME, Type: "S" }).subscribe(Result => {
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
  RegSetLocation() {
    let a = "";
    let lag = "";
    let lat = "";
    if (this.LiveLoc) {
      a = this.LiveLoc;
      let x = a.split('=');
      let m = x[2].split(',');
      lag = m[0];
      lat = m[1];
    } else if (this.LiveLoc1) {
      a = this.LiveLoc1;
      let x = a.split('=');
      let m = x[2].split(',');
      lag = m[0];
      lat = m[1];
    }

    const PRF = this.dialog.open(LivelocationComponent, {
      width: "80%",
      data: {
        langitude: lag,
        latitude: lat
      }
    });
    PRF.afterClosed().subscribe(result => {
      this.LiveLoc = result == undefined ? this.LiveLoc : result;
      this.LiveLoc1 = "";
    });
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
    if (E == "PanKey") {
      this.PanKeyfileUplaodURL = "";
      this.PanKeyPicBlob = null;
      this.PanKeyvalidPicName = null;
      this.PanKeyImageName = "";
      Element.value = "";
    }
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
  PanKeyPicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {

      let PanKeyPicExt = fileList[0].name.split('.').pop().toUpperCase();
      this.PanKeyextention = fileList[0].name.split('.').pop();
      if (PanKeyPicExt == 'PNG' || PanKeyPicExt == 'JPG' || PanKeyPicExt == 'JPEG' || PanKeyPicExt == 'MP4' || PanKeyPicExt == 'MOV') {
        this.PanKeyvalidPicName = fileList[0].name;
        this.PanKeyPicBlob = fileList[0];
        this.PanKeyImageName = fileList[0].name;
      }
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.PanKeyfileUplaodURL = reader.result;

        reader.readAsDataURL(file);
      }
      return;
    }
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
  getcountry(e) {
    this.CountryName = e;
  }
  countryChanged() {
    this.spinner.show();
    this.CITY = "";
    this.STATE = "";
    this.CityFill = [];
    this.StateFill = [];
    this.ZIP = "";
    this.ZIPFill = [];
    this.ClientServiceSer.StateFill({ CON_NAME: this.COUNTRY }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.StateFill = Result.Data.map(item => {
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
  getstate(e) {
    this.StateName = e;
  }
  stateChanged() {
    this.spinner.show();
    this.CITY = "";
    this.CityFill = [];
    this.ZIP = "";
    this.ZIPFill = [];
    this.ClientServiceSer.CityFill({ CONNAME: this.COUNTRY, REGCODE: this.STATE }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.CityFill = Result.Data.map(item => {
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
  getcity(e) {
    this.CityName = e;
  }
  CityChanged() {
    this.spinner.show();
    this.ZIP = "";
    this.ZIPFill = [];
    this.ClientServiceSer.ZipCodeFill({ CITY_CODE: this.CITY }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ZIPFill = Result.Data.map(item => {
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
  uploadimage(blob, filename) {
    this.spinner.show();
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
  onGridReadyAdd(params) {
    this.gridApiAdd = params.api;
    this.gridColumnApiAdd = params.columnApi;
    this.LoadGridAdd();

    const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-viewport');
    const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-horizontal-scroll-viewport');
    if (agBodyViewport) {
      const ps = new PerfectScrollbar(agBodyViewport);
      ps.update();
    }
    if (agBodyHorizontalViewport) {
      const ps = new PerfectScrollbar(agBodyHorizontalViewport);
      ps.update();
    }
  }
  LoadGridAdd() {
    this.spinner.show();
    if (this.GRID == false) {
      this.gridColumnApiAdd.setColumnVisible('ClientID', false);
    } else {
      this.gridColumnApiAdd.setColumnVisible('ClientID', true);
    }
    this.SupllierServiceSer.SpplierAdd({
      ID: "",
      SupplierId: this.CLIENTID
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApiAdd.setRowData(Result.Data);
          this.spinner.hide();
        } else if (Result.Success == 0) {
          this.gridApiAdd.setRowData();
          this.spinner.hide();
        }
        else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  Addressadd() {
    if (this.COMPANYNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Company Name", "Company Name");
      return;
    }
    if (this.TYOADD == "") {
      this.toastr.clear()
      this.toastr.warning("Select Type Of Address", "Type Of Address");
      return;
    }
    if (this.OFFNO.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Office Number", "Office No.");
      return;
    }
    this.spinner.show();
    this.SupllierServiceSer.SupplierAddSave({
      ID: this.ID == 0 ? 0 : this.ID,
      SupplierId: this.CLIENTID,
      AddressType: this.TYOADD,
      BuildingName: this.BUILDNO,
      OfficeNumber: this.OFFNO,
      Road: this.ROAD,
      Area: this.AREA,
      Country_Name: this.CountryName,
      State_Name: this.StateName,
      City_Name: this.CityName,
      Zip: this.ZIP,
      Map_Link: this.LiveLoc == "" ? this.LiveLoc1 : this.LiveLoc
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.success("Saved Successfully!!!!!!!!")
          this.LoadGridAdd();
          this.ID = 0;
          this.TYOADD = "";
          this.BUILDNO = "";
          this.OFFNO = "";
          this.ROAD = "";
          this.AREA = "";
          this.COUNTRY = "";
          this.STATE = "";
          this.CITY = "";
          this.ZIP = "";
          this.LiveLoc = "";
          this.CountryName = "";
          this.StateName = "";
          this.CityName = "";
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  onGridRowClickedAdd(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      this.ID = eve.data.ID;
      this.CLIENTID = eve.data.SupplierId;
      this.TYOADD = eve.data.AddressType;
      this.BUILDNO = eve.data.BuildingName;
      this.OFFNO = eve.data.OfficeNumber;
      this.ROAD = eve.data.Road;
      this.AREA = eve.data.Area;
      this.COUNTRY = eve.data.Country;
      this.CountryName = eve.data.Country_Name;
      this.countryChanged();
      this.STATE = eve.data.State;
      this.StateName = eve.data.State_Name;
      this.stateChanged();
      this.CITY = eve.data.City;
      this.CityName = eve.data.City_Name;
      this.CityChanged();
      this.ZIP = eve.data.Zip;
      this.LiveLoc = eve.data.Map_Link;
      this.LiveLoc1 = eve.data.Map_Link;
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.SupplierId + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.SupllierServiceSer.SupplierAddDelete({ SupplierAddDelete: eve.data.SupplierId, ID: eve.data.ID }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.LoadGridAdd();
                this.toastr.success("Deleted Successfully", "SUCCESS");
              } else {
                this.spinner.hide();
                this.toastr.clear();
              }
            } catch (err) {
              this.spinner.hide();
              this.toastr.clear();
              this.toastr.error(err);
            }
          });
        } else {
          this.LoadGridBank();
        }
      });
    }
  }
  onGridReadyKey(params) {
    this.gridApiKey = params.api;
    this.gridColumnApiKey = params.columnApi;
    this.LoadGridKeyPer();
    const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-viewport');
    const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-horizontal-scroll-viewport');
    if (agBodyViewport) {
      const ps = new PerfectScrollbar(agBodyViewport);
      ps.update();
    }
    if (agBodyHorizontalViewport) {
      const ps = new PerfectScrollbar(agBodyHorizontalViewport);
      ps.update();
    }
  }
  KeyPeradd() {
    if (this.COMPANYNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Company Name", "Company Name");
      return;
    }
    if (this.DEPARTMENT.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Department", "Department");
      return;
    }
    if (this.DESIGNATION.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Designation", "Designation");
      return;
    }
    if (this.FIRSTNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter First Name", "First Name");
      return;
    }
    if (this.LASTNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Last Name", "Last Name");
      return;
    }
    if (this.EMAIL1.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Email Address", "Email 1");
      return;
    }
    this.spinner.show();
    let PanKeyFileName = "";
    let DateFOrmate = formatDate(new Date(), 'dd_MM_yyyy_hh_mm_ss', 'en_US')
    if (this.PanKeyPicBlob) {
      PanKeyFileName = "PanKey_" + this.CLIENTID + DateFOrmate + '.' + this.PanKeyextention;
    } else {
      PanKeyFileName = this.pankeyname;
    }
    this.SupllierServiceSer.SupplierKeyPerSave({
      KPID: this.KPID == 0 ? 0 : this.KPID,
      SupplierId: this.CLIENTID,
      Designation: this.DESIGNATION,
      Department: this.DEPARTMENT,
      FirstName: this.FIRSTNAME,
      LastName: this.LASTNAME,
      Email_Type_1: this.EMAIL1TYPE,
      Email_1: this.EMAIL1,
      Email_Type_2: this.EMAIL2TYPE,
      Email_2: this.EMAIL2,
      Contact_Via_1: this.MOB1VIA,
      Contact_Type_1: this.MOB1TYPE,
      Contact_1: this.Mob1,
      IsWhatsApp_1: this.WHATSAPP1 == true ? 1 : 0,
      IsVerified_1: this.VERIFY1 == true ? 1 : 0,
      Contact_Via_2: this.MOB2VIA,
      Contact_Type_2: this.MOB2TYPE,
      Contact_2: this.Mob2,
      IsWhatsApp_2: this.WHATSAPP2 == true ? 1 : 0,
      IsVerified_2: this.VERIFY2 == true ? 1 : 0,
      Pan_No_KP: this.PANKEYPERSONE,
      Pan_Photo_KP: PanKeyFileName,
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.success("Saved Successfully!!!!!!!!")
          this.uploadimage(this.PanKeyPicBlob, PanKeyFileName);
          this.LoadGridKeyPer();
          this.KPID = 0;
          this.DESIGNATION = "";
          this.DEPARTMENT = "";
          this.FIRSTNAME = "";
          this.LASTNAME = "";
          this.EMAIL1TYPE = "";
          this.EMAIL1 = "";
          this.EMAIL2TYPE = "";
          this.EMAIL2 = "";
          this.MOB1VIA = "";
          this.MOB1TYPE = "";
          this.Mob1 = "";
          this.PANKEYPERSONE = "";
          this.MOB2VIA = "";
          this.MOB2TYPE = "";
          this.Mob2 = "";
          this.PanKeyfileUplaodURL = "";
          this.WHATSAPP1 = false;
          this.VERIFY1 = false;
          this.WHATSAPP2 = false;
          this.VERIFY2 = false;
          this.pankeyname = "";
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  LoadGridKeyPer() {
    this.spinner.show();
    if (this.GRID == false) {
      this.gridColumnApiKey.setColumnVisible('ClientID', false);
    } else {
      this.gridColumnApiKey.setColumnVisible('ClientID', true);
    }
    this.SupllierServiceSer.SpplierKey({
      KPID: "",
      SupplierId: this.CLIENTID
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApiKey.setRowData(Result.Data);
          this.spinner.hide();
        } else if (Result.Success == 0) {
          this.gridApiKey.setRowData();
          this.spinner.hide();
        }
        else {

          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  onGridRowClickedKey(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      this.KPID = eve.data.KPID;
      this.CLIENTID = eve.data.SupplierId;
      this.DESIGNATION = eve.data.Designation;
      this.DEPARTMENT = eve.data.Department;
      this.FIRSTNAME = eve.data.FirstName;
      this.LASTNAME = eve.data.LastName;
      this.EMAIL1TYPE = eve.data.Email_Type_1;
      this.EMAIL1 = eve.data.Email_1;
      this.EMAIL2TYPE = eve.data.Email_Type_2;
      this.EMAIL2 = eve.data.Email_2;
      this.MOB1VIA = eve.data.Contact_Via_1;
      this.MOB1TYPE = eve.data.Contact_Type_1;
      this.Mob1 = eve.data.Contact_1;
      this.WHATSAPP1 = eve.data.IsWhatsApp_1 == 1 ? true : false;
      this.VERIFY1 = eve.data.IsVerified_1 == 1 ? true : false;
      this.MOB2VIA = eve.data.Contact_Via_2;
      this.MOB2TYPE = eve.data.Contact_Type_2;
      this.Mob2 = eve.data.Contact_2;
      this.WHATSAPP2 = eve.data.IsWhatsApp_2 == 1 ? true : false;
      this.VERIFY2 = eve.data.IsVerified_2 == 1 ? true : false;
      this.PANKEYPERSONE = eve.data.Pan_No_KP;
      this.PanKeyfileUplaodURL = this.ImageUrl + eve.data.Pan_Photo_KP;
      this.pankeyname = eve.data.Pan_Photo_KP;
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.SupplierId + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.SupllierServiceSer.SupplierKeyDelete({ SupplierId: eve.data.SupplierId, KPID: eve.data.KPID }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.LoadGridKeyPer();
                this.toastr.success("Deleted Successfully", "SUCCESS");
              } else {
                this.spinner.hide();
                this.toastr.clear();
              }
            } catch (err) {
              this.spinner.hide();
              this.toastr.clear();
              this.toastr.error(err);
            }
          });
        } else {
          this.LoadGridBank();
        }
      });
    }
  }
  onGridReadyBank(params) {
    this.gridApiBank = params.api;
    this.gridColumnApiBank = params.columnApi;
    this.LoadGridBank();
    const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-viewport');
    const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-horizontal-scroll-viewport');
    if (agBodyViewport) {
      const ps = new PerfectScrollbar(agBodyViewport);
      ps.update();
    }
    if (agBodyHorizontalViewport) {
      const ps = new PerfectScrollbar(agBodyHorizontalViewport);
      ps.update();
    }
  }
  LoadGridBank() {
    this.spinner.show();
    if (this.GRID == false) {
      this.gridColumnApiBank.setColumnVisible('ClientID', false);
    } else {
      this.gridColumnApiBank.setColumnVisible('ClientID', true);
    }
    this.SupllierServiceSer.SpplierBank({
      BID: "",
      SupplierId: this.CLIENTID
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApiBank.setRowData(Result.Data);
          this.spinner.hide();
        } else if (Result.Success == 0) {
          this.gridApiBank.setRowData();
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
  Bankadd() {
    if (this.COMPANYNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Company Name", "Company Name");
      return;
    }
    if (this.BANKNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Bank Name", "Bank Name");
      return;
    }
    if (this.ACTTYPE == "") {
      this.toastr.clear()
      this.toastr.warning("Select Account Type", "Type Of Account");
      return;
    }
    if (this.ActNo.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Account No.", "Account No.");
      return;
    }
    if (this.IFSCCODE.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter IFSC Code", "IFSC Code");
      return;
    }
    this.spinner.show();
    this.SupllierServiceSer.SupplierBankSave({
      BID: this.BID == 0 ? 0 : this.BID,
      SupplierId: this.CLIENTID,
      BankName: this.BANKNAME,
      AccountType: this.ACTTYPE == "Current" ? "C" : "S",
      AccountNumber: this.ActNo,
      IFSCCode: this.IFSCCODE,
      BranchName: this.BRANCHNAME,
      BranchAddress: this.BRANCHADD,
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.success("Saved Successfully!!!!!!!!")
          this.LoadGridBank();
          this.BID = 0;
          this.BANKNAME = "";
          this.ACTTYPE = "";
          this.ActNo = "";
          this.IFSCCODE = "";
          this.BRANCHNAME = "";
          this.BRANCHADD = "";
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  onGridRowClickedBank(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      this.BID = eve.data.BID;
      this.CLIENTID = eve.data.SupplierId;
      this.BANKNAME = eve.data.BankName;
      if (eve.data.AccountType == "C") {
        this.ACTTYPE = "Current";
      } else {
        this.ACTTYPE = "Saving";
      }
      this.ActNo = eve.data.AccountNumber;
      this.IFSCCODE = eve.data.IFSCCode;
      this.BRANCHNAME = eve.data.BranchName;
      this.BRANCHADD = eve.data.BranchAddress;
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.SupplierId + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.SupllierServiceSer.SupplierBankDelete({ SupplierId: eve.data.SupplierId, BID: eve.data.BID }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.LoadGridBank();
                this.toastr.success("Deleted Successfully", "SUCCESS");
              } else {
                this.spinner.hide();
                this.toastr.clear();
              }
            } catch (err) {
              this.spinner.hide();
              this.toastr.clear();
              this.toastr.error(err);
            }
          });
        } else {
          this.LoadGridBank();
        }
      });
    }
  }
  Save() {
    if (this.COMPANYNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Company Name", "Company Name");
      return;
    }
    if (this.CLIENTID == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Supplier Id", "Supplier Id");
      return;
    }
    this.spinner.show();
    let PanFileName = "";
    let Profilename = "";
    let gstfilename = "";
    let DateFOrmate = formatDate(new Date(), 'dd_MM_yyyy_hh_mm_ss', 'en_US')
    if (this.PanfilePicBlob) {
      PanFileName = "Pan_" + this.CLIENTID + DateFOrmate + '.' + this.panextention;
    } else {
      PanFileName = this.PanName;
    }
    if (this.ProfilePicBlob) {
      Profilename = "Profile_" + this.CLIENTID + DateFOrmate + '.' + this.profileextention;
    } else {
      Profilename = this.profilrname;
    }
    if (this.GstfilePicBlob) {
      gstfilename = "Gst_" + this.CLIENTID + DateFOrmate + '.' + this.gstextention;
    } else {
      gstfilename = this.GstName;
    }
    this.SupllierServiceSer.SupplierSave({
      ID: this.SUPID,
      ClientID: this.CLIENTID,
      Name: this.COMPANYNAME,
      Mobile_1_CC_Code: "",
      Mobile_2_CC_Code: "",
      Mobile_1_NO: "",
      Mobile_2_NO: "",
      Email1: "",
      Email2: "",
      BrokerName: this.Broker.value.toString(),
      PAN_NO: this.PAN,
      PAN_PHOTO: PanFileName,
      GST_NO: this.GST,
      GST_PHOTO: gstfilename,
      PHOTO_ID_NO: "",
      PHOTO_ID_PHOTO: "",
      Office_plot_Or_Office_No: "",
      Office_Society_Or_Apartment: "",
      Office_Road: "",
      Office_Area: "",
      Office_Country: "",
      Office_State: "",
      Office_City: "",
      Office_Zip: "",
      Office_Map_Link: "",
      Office_Phone: "",
      Residence_Flat_No: "",
      Residence_Society: "",
      Residence_Road: "",
      Residence_Area: "",
      Residence_Country: "",
      Residence_State: "",
      Residence_City: "",
      Residence_Zip: "",
      Residence_Map_Link: "",
      Residence_Phone: "",
      ProfileImage: Profilename,
      EntryBy: this.decodedTkn.UserId,
      C_Type: "S",
      P_Type: "",
      IsWhatsApp1: false,
      IsWhatsApp2: false,
    }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.success("Saved Successfully!!!!!!!!")
          this.uploadimage(this.PanfilePicBlob, PanFileName);
          this.uploadimage(this.GstfilePicBlob, gstfilename);
          this.uploadimage(this.ProfilePicBlob, Profilename);
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
  Clear() {
    this.CLIENTID = "";
    this.COMPANYNAME = "";
    this.PAN = "";
    this.PanfileUplaodURL = "";
    this.GST = "";
    this.GstfileUplaodURL = "";
    this.ProfileUplaodURL = "";
    this.Broker.setValue("");
    this.LoadGridAdd();
    this.LoadGridBank();
    this.LoadGridKeyPer();
  }
  validEmailcheck(e) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.toastr.clear();
    if (e == "EMAIL1") {
      if (re.test(this.EMAIL1)) {
      } else {
        this.toastr.warning("Enter Valid Email Address", "E-maill");
        this.EMAIL1 = "";
      }
    }
    if (e == "EMAIL2") {
      if (re.test(this.EMAIL2)) {
      } else {
        this.toastr.warning("Enter Valid Email Address", "E-maill");
        this.EMAIL2 = "";
      }
    }
  }
  OPENIMAGE(content, e) {
    if (e == "PAN") {
      this.ModelImage = this.PanfileUplaodURL;
    } else if (e == "GST") {
      this.ModelImage = this.GstfileUplaodURL;
    } else if (e == "PANKEY") {
      this.ModelImage = this.PanKeyfileUplaodURL;
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
    this.PanKeyfileUplaodURL = "./../../../assets/images/No-Image.jpg";
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

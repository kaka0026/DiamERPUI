import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ClientServiceService } from "../../Services/Transaction/client-service.service";
import { CalrityMastService } from "../../Services/Masters/calrity-mast.service";
import { DesignOprationService } from "../../Services/DesignOperation/design-opration.service";
import { ShapeMastService } from "../../Services/Masters/shape-mast.service";
import { ColMastService } from "../../Services/Masters/col-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe, formatDate } from "@angular/common";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { OtpCheckComponent } from "../otp-check/otp-check.component";
import { ClientAddressComponent } from "../client-address/client-address.component";
import { ClienContactComponent } from "../clien-contact/clien-contact.component";
import { ShowImageComponent } from "../show-image/show-image.component";
import { ShowFrameComponent } from "../show-frame/show-frame.component";
import * as $ from "jquery";
import PerfectScrollbar from "perfect-scrollbar";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../../../environments/environment';
import { PermissionService } from 'src/app/Services/Access/permission.service';
import { ReplaySubject, Subject, Observable, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _moment from 'moment';
import { map, startWith } from 'rxjs/operators';
import { PurchaseService } from 'src/app/Services/Transaction/purchase.service';
import { LoginService } from 'src/app/Services/login.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OtpCheckMobileComponent } from '../otp-check-mobile/otp-check-mobile.component';
var PhoneNumber = require("awesome-phonenumber");
// const config = {
//   apiKey: "c77070ba643cf1b79b0565e7208878b016896afa",
//   authDomain: "fir-auth-d1e96.firebaseapp.com",
//   projectId: "fir-auth-d1e96",
//   storageBucket: "fir-auth-d1e96.appspot.com",
//   messagingSenderId: "1089984436552",
//   appId: "1:1089984436552:web:bf889b86e849f289277b7d",
//   measurementId: "G-QE1PEYS3BP"
// };
// import { WindowsService } from '../../Services/windows.service';
// import firebase from 'firebase';
// export class PhoneNumber {
//   country: string;
//   area: string;
//   prefix: string;
//   line: string;
//   get e164() {
//     const num = this.country + this.area + this.prefix + this.line
//     return `+${num}`
//   }
// }

const moment = _moment;

export interface Lot1 {
  name: string;
  code: string;
}

export interface Lot {
  id: string;
  name: string;
}

@Component({
  selector: 'app-save-update-client',
  templateUrl: './save-update-client.component.html',
  styleUrls: ['./save-update-client.component.css']
})
export class SaveUpdateClientComponent implements OnInit, OnDestroy {
  @ViewChild('CMPANYID') CompnyIdElement: ElementRef;

  mask: string;
  example: string;

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  timer: number;
  destroy = new Subject();
  rxjsTimer = timer(1000, 1000);
  resend = false;
  TIMER = true;

  timermobile: number;
  destroymobile = new Subject();
  rxjsTimermobile = timer(1000, 1000);
  resendmobile = false;
  TIMERmobile = true;

  public columnDefs;
  public gridApi;
  public gridColumnApi;
  public defaultColDef;
  public noRowsTemplate;
  public loadingTemplate;

  phone: any;
  emailotp: any = "";
  mobileotp: any = "";

  verificationCode: string;

  user: any;
  mootp: string;
  otp: string;
  showOtpComponentmobile = true;
  showOtpComponent = true;
  @ViewChild('ngOtpInputmobile', { static: false }) ngOtpInputmobile: any;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  configmobile = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  form: FormGroup;
  private ImageUrl = environment.ImageUrl;
  StateCode: any = "";
  Broker: FormControl;
  filteredBroker: Observable<any[]>;
  BrokerCode: any = "";
  BrokerArr: Lot1[] = [];
  BrokerName: any = '';
  Addresslist: [];
  Addresslistprimary: [];
  windowRef: any;
  tomorrow = new Date();
  GRID: boolean = false;
  UPDATESUP: boolean = false;
  ID: number = 0;
  AddressID: number = 0;
  ContactID: number = 0;
  WHATSAPP2: boolean = false;
  disable: boolean = false;
  WHATSAPP1: boolean = false;
  CWHATSAPP: boolean = false;
  EDIT: boolean = false;
  EMAIL2VERI: boolean = false;
  EMAIL1VERI: boolean = false;
  ProfileUplaodURL: any = "";
  ProfilePicBlob: File = null;
  profilrname: any = "";
  GstName: any = "";
  PanName: any = "";
  ModelImage: any = "";
  PhotoIdName: any = "";
  AdharName: any = "";
  ProfilevalidPicName = null;
  ProfileImageName: any = "";
  GstfileUplaodURL: any = "";
  GstfileUplaodURLframe: any = "";
  GstfilePicBlob: File = null;
  GstfilevalidPicName = null;
  GstfileImageName: any = "";
  AdharfileUplaodURL: any = "";
  AdharfileUplaodURLframe: any = "";
  AdharfilePicBlob: File = null;
  AdharfilevalidPicName = null;
  AdharfileImageName: any = "";
  PhotoIdfileUplaodURL: any = "";
  PhotoIdfileUplaodURLframe: any = "";
  PhotoIdfilePicBlob: File = null;
  PhotoIdfilevalidPicName = null;
  PhotoIdfileImageName: any = "";
  PanfileUplaodURL: any = "";
  PanfileUplaodURLframe: any = "";
  PAN: any = "";
  PHOTOID: any = "";
  GST: any = "";
  ADHAR: any = "";
  PanfilePicBlob: File = null;
  PanfilevalidPicName = null;
  PanfileImageName: any = "";
  FIRSTNAME: any = "";
  PREFIX: any = "";
  LASTNAME: any = "";
  NICKNAME: any = "";
  CLIENTID: any = "";
  ResCityName: any = "";
  ResCountryName: any = "";
  ResStateName: any = "";
  DOB: any = "";
  GENDER: any = "";
  CONTACTPERSONE: any = "";
  MIDDLENAME: any = "";
  ANNIVERSARYDATE: any = "";
  SPOUSEDOB: any = "";
  SPOUSENAME: any = "";
  MOB1: any = "";
  MOB2: any = "";
  MOB1VAL: any = "";
  MOB2VAL: any = "";
  EMAIL1: any = "";
  EmailId: any = "";
  FLATNO: any = "";
  PLOTNO: any = "";
  EMAIL2: any = "";
  RESSOS: any = "";
  OFFSOS: any = "";
  OFFROAD: any = "";
  OFFAREA: any = "";
  RESROAD: any = "";
  RESAREA: any = "";
  OffCountryName: any = "";
  OffCountryList = [];
  SourceList = [];
  MARITIAL: any = "";
  PHOTOTYPE: any = "";
  INDCORPRADIO: any = "Individual";
  RESCOUNTRY: any = "";
  ResCountryFill = [];
  ResStateFill = [];
  RESSTATE: any = "";
  RESCITY: any = "";
  ResCityFill = [];
  ResZIPFill = [];
  mobile1List = [];
  mobile2List = [];
  RESZIP: any = "";
  OffCountryFill = [];
  OffStateFill = [];
  OFFSTATE: any = "";
  OFFCITY: any = "";
  OffCityFill = [];
  OffZIPFill = [];
  OFFZIP: any = "";
  OFFCOUNTRY: any = "";
  OFFPHONE: any = "";
  RESPHONE: any = "";
  OFFPHONECODE: any = "";
  RESLiveLoc: any = "";
  RESLiveLoc1: any = "";
  OFFLiveLoc: any = "";
  OFFLiveLoc1: any = "";
  UNIT: any = "";
  LRING: number = 0;
  LINDEX: number = 0;
  LPINKY: number = 0;
  LMIDDLE: number = 0;
  LTHUMB: number = 0;
  RRING: number = 0;
  RINDEX: number = 0;
  RPINKY: number = 0;
  RMIDDLE: number = 0;
  RTHUMB: number = 0;
  NARNECK: number = 0;
  NLock: number = 0;
  BSlip: number = 0;
  BOpenable: number = 0;
  BFixed: number = 0;
  NLong: number = 0;
  MOBILEVERIFY: boolean = false;
  CHOKER: any = "";
  BRACELET: any = "";
  SPECIALREMARK: any = "";
  PRODUCREMARK: any = "";
  JWELLERYTYPE: any = "";
  COLORTYPE: any = "";
  ColorClarrityArr = [];
  ColorTypeArr = [];
  COLORCLARITY: any = "";
  DiamondColorArr = [];
  DCOLORTYPE: any = "";
  DiamondClaArr = [];
  DCLARITY: any = "";
  EaringArr = [];
  NecklaceArr = [];
  EaringStyle: any = "";
  NecklaceStyle: any = "";
  REFERENCES: any = "";
  REMARK: any = "";
  HISTORY: any = "";
  OffCityName: any = "";
  OffStateName: any = "";
  CNAME: any = "";
  CDESIGNATION: any = "";
  CONPHONE: any = "";
  CONPHONECODE: any = "";
  MOBILETYPE: any = "";
  photoidextention: any = "";
  gstextention: any = "";
  adharextention: any = "";
  panextention: any = "";
  profileextention: any = "";
  CEMAIL: any = "";
  CADDRESS: any = "";
  Name: any = "";
  ContactCountryCode: any = "";
  MOBCODE1: any = "";
  NeckStyle = new FormControl();
  EarStyle = new FormControl();
  DiaClarity = new FormControl();
  Mob1CODE = new FormControl();
  Mob2CODE = new FormControl();
  ApartmentOP: any = "";
  Address: any = "";
  AddressName: any = "";
  //phoneNumber = new PhoneNumber()

  @ViewChild('Grid') Grid;


  ColStyleList: Lot[] = [];
  ColStyle: FormControl = new FormControl();
  ColorStyleMultiFilterCtrl: FormControl = new FormControl();
  filteredColorStyleMulti: ReplaySubject<Lot[]> = new ReplaySubject<Lot[]>(1);

  @ViewChild('multiSelect') multiSelect: MatSelect;
  _onDestroy = new Subject<void>();

  ColClarityList: Lot[] = [];
  ColClarity: FormControl = new FormControl();
  ColorClarityMultiFilterCtrl: FormControl = new FormControl();
  filteredColorClarityMulti: ReplaySubject<Lot[]> = new ReplaySubject<Lot[]>(1);
  @ViewChild('multiSelect') multiSelect1: MatSelect;

  DiamondColorList: Lot[] = [];
  DiaCol: FormControl = new FormControl();
  DiamondColorMultiFilterCtrl: FormControl = new FormControl();
  filteredDiamondColorMulti: ReplaySubject<Lot[]> = new ReplaySubject<Lot[]>(1);
  @ViewChild('multiSelect') multiSelect2: MatSelect;
  animalForm: any;

  constructor(
    private ClientServiceSer: ClientServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private ShapeMastSer: ShapeMastService,
    private ColMastSer: ColMastService,
    private CalrityMastSer: CalrityMastService,
    private DesignOprationSer: DesignOprationService,
    private PermissionSer: PermissionService,
    private PurchaseSer: PurchaseService,
    private LoginSer: LoginService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder
    // private win: WindowsService
  ) {
    this.form = this.fb.group({
      phone: '',
      regionCode: 'US',
      phoneNumber: '',
      countryCode: '1',
    });
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>no rows to show</span>`;

    this.filteredColorStyleMulti.next(this.ColStyleList.slice());
    this.ColorStyleMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterColorStyleMulti();
      });

    this.filteredColorClarityMulti.next(this.ColClarityList.slice());
    this.ColorClarityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterColorClarityMulti();
      });
    this.filteredDiamondColorMulti.next(this.DiamondColorList.slice());
    this.DiamondColorMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDiamondColorMulti();
      });
    this.Broker = new FormControl();
    this.filteredBroker = this.Broker.valueChanges.pipe(
      startWith(""),
      map(lot => (lot ? this.filteredBrokers(lot) : this.BrokerArr.slice()))
    );
    this.PurchaseSer.BrokerFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.BrokerArr = Result.Data.map(item => {
            return {
              code: item.BrokerName,
              name: item.BrokerName
            };
          });
        } else {
          this.toastr.info("Data not found");
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

    let ObjResult25 = {
      USERID: this.decodedTkn.UserId,
      PAGENAME: "ClientList.aspx"
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

    this.ShapeMastSer.MaterialMastDDL({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ColorTypeArr = Result.Data.map(item => {
            return {
              id: item.M_Code.toString(),
              name: item.M_Name
            }

          });
          this.ColStyleList = this.ColorTypeArr;
          this.filterColorStyleMulti();
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.ClientServiceSer.GetEaringStyle({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.EaringArr = Result.Data.map(item => {
            return {
              NAME: item.NAME,
              STYLE_ID: item.STYLE_ID.toString()
            }

          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.ClientServiceSer.GetNecklaceStyle({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.NecklaceArr = Result.Data.map(item => {
            return {
              NAME: item.NAME,
              STYLE_ID: item.STYLE_ID.toString()
            }
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.CalrityMastSer.CalMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.DiamondClaArr = Result.Data.map(item => {
            return {
              Q_Code: item.Q_Code.toString(),
              Q_Name: item.Q_Name
            }
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.ShapeMastSer.ShapMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.ColorClarrityArr = Result.Data.map(item => {
            return {
              id: item.S_Code.toString(),
              name: item.S_Name
            }
          });
          this.ColClarityList = this.ColorClarrityArr;
          this.filterColorClarityMulti();
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
    this.ColMastSer.ColMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.DiamondColorArr = Result.Data.map(item => {
            return {
              id: item.C_Code.toString(),
              name: item.C_Name
            }
          });
          this.DiamondColorList = this.DiamondColorArr;
          this.filterDiamondColorMulti();
        } else {
        }
      } catch (err) {
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
              ConCodeName: item.ConCodeName,
              CON_SORTNAME: item.CON_SORTNAME,
              flag: 'https://flagcdn.com/' + item.CON_SORTNAME.toLowerCase() + '.svg'
            }
          });
          this.mobile2List = Result.Data.map(item => {
            return {
              CON_NAME: item.CON_NAME,
              CON_EXTNO: item.CON_EXTNO,
              ConCodeName: item.ConCodeName,
              flag: 'https://flagcdn.com/' + item.CON_SORTNAME.toLowerCase() + '.svg'
            }
          });
        } else {
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });

    this.columnDefs = [
      {
        headerName: "Action",
        field: "ClientID",
        cellStyle: { "text-align": "center" },
        width: 230,
        cellRenderer: function (params) {
          var html = '<div style="display:flex !important; " class="grid-btn-group">'
          html += '<div class="updateuser"><button type="button" title="click here for update record" value="Update" class="la la-pencil-square-o" data-action-type="UpdateUser"></button></div>'
          html += '<div class="delete"> <button  type="button" title="click here for delete record" class="la la-trash" value="Delete" data-action-type="DeleteUser"></button></div>'
          return html + '</div>';
        }
      },
      {
        headerName: "Name",
        field: "Name",
        cellStyle: { "text-align": "center" },
        width: 300
      },
      {
        headerName: "Designation",
        field: "Designation",
        cellStyle: { "text-align": "center" },
        width: 300
      },
      {
        headerName: "Mobile No",
        field: "MobileNo",
        cellStyle: { "text-align": "center" },
        width: 300
      }
    ];
    this.defaultColDef = {
      resizable: true,
      filter: true,
      sortable: true
    };
  }

  ngOnInit(): void {


    if (localStorage.getItem("ClientID")) {
      let addressobj = {
        ClientID: localStorage.getItem("ClientID"),
        ID: 0,
        primary: 0
      };
      this.ClientServiceSer.ClientAdd(addressobj).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.Addresslist = Result.Data;
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
      let addressprmaryobj = {
        ClientID: localStorage.getItem("ClientID"),
        ID: 0,
        primary: 1
      };
      this.ClientServiceSer.ClientAdd(addressprmaryobj).subscribe(Result => {
        try {
          if (Result.Success == 1) {

            this.Addresslistprimary = Result.Data;
            this.Address = Result.Data[0].Address;
            this.AddressName = Result.Data[0].Address_Name;
            this.ApartmentOP = Result.Data[0].Apartment_OP;
            this.AddressID = Result.Data[0].ID;
            if (Result.Data.Country != 0) {
              this.RESCOUNTRY = Result.Data[0].Country;
              this.RescountryChanged();
            }
            if (Result.Data.State != 0) {
              this.RESSTATE = Result.Data[0].State;
              this.ResstateChanged();
            }
            if (Result.Data.City != 0) {
              this.RESCITY = Result.Data[0].City
              this.ResCityChanged();
            }
            if (Result.Data.Zip != 0) {
              this.RESZIP = Result.Data[0].Zip;
            }
            this.ResCountryName = Result.Data[0].Country_Name;
            this.ResStateName = Result.Data[0].State_Name;
            this.ResCityName = Result.Data[0].City_Name;
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
      this.spinner.show();
      let ResObj = {
        ClientID: localStorage.getItem("ClientID"),
        Name: "",
        C_Type: "C"
      };
      this.ClientServiceSer.ClientFill(ResObj).subscribe(FillRes => {
        localStorage.removeItem("ClientID");
        try {
          if (FillRes.Success == 1) {
            this.UPDATESUP = true;
            this.ID = FillRes.Data[0].ID;
            this.Name = FillRes.Data[0].Name;
            this.EmailId = FillRes.Data[0].Email1;
            this.FIRSTNAME = FillRes.Data[0].Name;
            this.PREFIX = FillRes.Data[0].Prefix;
            this.MIDDLENAME = FillRes.Data[0].MiddleName;
            this.LASTNAME = FillRes.Data[0].LastName;
            this.CLIENTID = FillRes.Data[0].ClientID;
            this.CONTACTPERSONE = FillRes.Data[0].ContactPerson;
            this.DOB = this.datePipe.transform(FillRes.Data[0].ContactPersonDOB, "yyyy-MM-dd");
            if (FillRes.Data[0].Gender == "M") {
              this.GENDER = "Male";
            }
            else if (FillRes.Data[0].Gender == "F") {
              this.GENDER = "Female";
            }
            this.MARITIAL = FillRes.Data[0].Maritial;
            this.ANNIVERSARYDATE = this.datePipe.transform(FillRes.Data[0].AnniversaryDate, "yyyy-MM-dd");
            this.SPOUSENAME = FillRes.Data[0].SpouseName;
            this.SPOUSEDOB = this.datePipe.transform(FillRes.Data[0].SpouseNameDOB, "yyyy-MM-dd");

            this.NICKNAME = FillRes.Data[0].NickName;
            this.ADHAR = FillRes.Data[0].ADHAR_NO;
            this.AdharName = FillRes.Data[0].ADHAR_ID_PHOTO;
            this.BFixed = FillRes.Data[0].Bangle_Fixed;
            this.NLong = FillRes.Data[0].Long;
            this.MOBILEVERIFY = FillRes.Data[0].MobileVerify;
            this.EMAIL1VERI = FillRes.Data[0].EmailVerify;
            if (this.EMAIL1VERI == true) {
              $("#emailverification").hide();
            }
            if (this.MOBILEVERIFY == true) {
              $("#mobileverification").hide();
            }
            this.MOB2VAL = FillRes.Data[0].Mobile_2_NO;
            this.EMAIL1 = FillRes.Data[0].Email1;
            this.EMAIL2 = FillRes.Data[0].Email2;
            this.PAN = FillRes.Data[0].PAN_NO;
            this.GST = FillRes.Data[0].GST_NO;
            this.PHOTOID = FillRes.Data[0].PHOTO_ID_NO;
            this.PHOTOTYPE = FillRes.Data[0].PHOTO_ID_TYPE;


            var panpdforimg = FillRes.Data[0].PAN_PHOTO.split('.').pop().toUpperCase();
            if (panpdforimg == 'JPG' || panpdforimg == 'JPEG') {
              $("#panfrm").css("display", "none");
              $("#panimg").css("display", "block");
              this.PanfileUplaodURL = this.ImageUrl + FillRes.Data[0].PAN_PHOTO;
            } else if (panpdforimg == 'PDF') {
              $("#panimg").css("display", "none");
              $("#panfrm").css("display", "block");
              this.PanfileUplaodURLframe = this.ImageUrl + FillRes.Data[0].PAN_PHOTO;
            }

            var gstpdforimg = FillRes.Data[0].GST_PHOTO.split('.').pop().toUpperCase();
            if (gstpdforimg == 'JPG' || gstpdforimg == 'JPEG') {
              $("#gstfrm").css("display", "none");
              $("#gstimg").css("display", "block");
              this.GstfileUplaodURL = this.ImageUrl + FillRes.Data[0].GST_PHOTO;
            } else if (gstpdforimg == 'PDF') {
              $("#gstimg").css("display", "none");
              $("#gstfrm").css("display", "block");
              this.GstfileUplaodURLframe = this.ImageUrl + FillRes.Data[0].GST_PHOTO;
            }

            var adharpdforimg = FillRes.Data[0].ADHAR_ID_PHOTO.split('.').pop().toUpperCase();
            if (adharpdforimg == 'JPG' || adharpdforimg == 'JPEG') {
              $("#adharfrm").css("display", "none");
              $("#adharimg").css("display", "block");
              this.AdharfileUplaodURL = this.ImageUrl + FillRes.Data[0].ADHAR_ID_PHOTO;
            } else if (adharpdforimg == 'PDF') {
              $("#adharimg").css("display", "none");
              $("#adharfrm").css("display", "block");
              this.AdharfileUplaodURLframe = this.ImageUrl + FillRes.Data[0].ADHAR_ID_PHOTO;
            }

            var photoidpdforimg = FillRes.Data[0].PHOTO_ID_PHOTO.split('.').pop().toUpperCase();
            if (photoidpdforimg == 'JPG' || photoidpdforimg == 'JPEG') {
              $("#photoidfrm").css("display", "none");
              $("#photoidimg").css("display", "block");
              this.PhotoIdfileUplaodURL = this.ImageUrl + FillRes.Data[0].PHOTO_ID_PHOTO;
            } else if (photoidpdforimg == 'PDF') {
              $("#photoidimg").css("display", "none");
              $("#photoidfrm").css("display", "block");
              this.PhotoIdfileUplaodURLframe = this.ImageUrl + FillRes.Data[0].PHOTO_ID_PHOTO;
            }

            this.ProfileUplaodURL = this.ImageUrl + FillRes.Data[0].ProfileImage;
            this.profilrname = FillRes.Data[0].ProfileImage;
            this.GstName = FillRes.Data[0].GST_PHOTO;
            this.PanName = FillRes.Data[0].PAN_PHOTO;
            this.PhotoIdName = FillRes.Data[0].PHOTO_ID_PHOTO;
            this.UNIT = FillRes.Data[0].Unit;
            this.LRING = FillRes.Data[0].Left_Ring;
            this.LINDEX = FillRes.Data[0].Left_Index;
            this.LPINKY = FillRes.Data[0].Left_Pinky;
            this.LMIDDLE = FillRes.Data[0].Left_Middle;
            this.LTHUMB = FillRes.Data[0].Left_Thumb;
            this.RRING = FillRes.Data[0].Right_Ring;
            this.RINDEX = FillRes.Data[0].Right_Index;
            this.RPINKY = FillRes.Data[0].Right_Pinky;
            this.RMIDDLE = FillRes.Data[0].Right_Middle;
            this.RTHUMB = FillRes.Data[0].Right_Thumb;
            this.NARNECK = FillRes.Data[0].Necklace_Around_the_Neck;
            this.NLock = FillRes.Data[0].Necklace_Lock;
            this.BSlip = FillRes.Data[0].Bangle_Slip;
            this.BOpenable = FillRes.Data[0].Bangle_Openable;
            this.BRACELET = FillRes.Data[0].Bracelet;
            this.CHOKER = FillRes.Data[0].Choker;
            this.PRODUCREMARK = FillRes.Data[0].Production_Remark;
            this.SPECIALREMARK = FillRes.Data[0].Special_Remark;
            this.REFERENCES = FillRes.Data[0].Reference;
            this.REMARK = FillRes.Data[0].Remark;
            this.HISTORY = FillRes.Data[0].History;
            this.JWELLERYTYPE = FillRes.Data[0].StyleOfjewellary;
            if (FillRes.Data[0].P_Type == "I") {
              this.INDCORPRADIO = "Individual";
            } else if (FillRes.Data[0].P_Type == "CO") {
              this.INDCORPRADIO = "Corporate";
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
            this.NeckStyle = new FormControl(
              FillRes.Data[0].NecklaceStyle ? FillRes.Data[0].NecklaceStyle.split(",") : ""
            );
            this.EarStyle = new FormControl(
              FillRes.Data[0].EaringStyle ? FillRes.Data[0].EaringStyle.split(",") : ""
            );
            this.ColStyle.setValue(FillRes.Data[0].ColorStoneType ? FillRes.Data[0].ColorStoneType.split(",") : "");
            this.ColClarity.setValue(FillRes.Data[0].DiamondShape ? FillRes.Data[0].DiamondShape.split(",") : "");
            this.DiaCol.setValue(FillRes.Data[0].DiamondColor ? FillRes.Data[0].DiamondColor.split(",") : "");
            this.DiaClarity.setValue(FillRes.Data[0].DiamondClarity ? FillRes.Data[0].DiamondClarity.split(",") : "");
            this.MOB1VAL = FillRes.Data[0].Mobile_1_NO;
            if (FillRes.Data[0].Mobile_1_CC_Code != 0) {
              setTimeout(() => {
                const toSelect1 = this.mobile1List.find(c => c.CON_EXTNO == FillRes.Data[0].Mobile_1_CC_Code);
                setTimeout(() => {
                  this.MOB1 = toSelect1.ConCodeName;
                  setTimeout(() => {
                    // this.formatPhone()
                  }, 1000);
                }, 1000);
              }, 1000);
            } if (FillRes.Data[0].Mobile_2_CC_Code != 0) {
              setTimeout(() => {
                const toSelect2 = this.mobile2List.find(c => c.CON_EXTNO == FillRes.Data[0].Mobile_2_CC_Code);
                setTimeout(() => {
                  this.MOB2 = toSelect2.ConCodeName;
                }, 1000);
              }, 1000);
            }
            this.maritalselect();
            this.addstatecode();

            this.GRID = true;
            $("#clear").hide();
            this.LoadGridData();
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.toastr.info("New party code not found.");
          }
        } catch (err) {
          this.spinner.hide();
          this.toastr.error(err);
        }
      });
    }
    this.spinner.hide();
    this.Mob1CODE.valueChanges.subscribe((value) => {
      if (value && value !== 'ZZ') {
        const toSelect1 = this.mobile1List.find(c => c.ConCodeName == value);
        const CON_SORTNAME = toSelect1.CON_SORTNAME
        this.setMaskAndExample(CON_SORTNAME);
        this.form.get('countryCode').setValue(this.getCountryCodeForRegionCode(CON_SORTNAME), {
          emitEvent: false,
        });
      }
    });

    // this.form.get('countryCode').valueChanges.subscribe((value) => {
    //   if (value) {
    //   this.form.get('regionCode').setValue(this.getRegionCodeForCountryCode(value));
    //   }
    // });

    // this.windowRef = this.win.windowRef;
    // firebase.initializeApp(config);
    // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {

    //   'size': 'invisible',
    //   'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //   }
    // });
    // this.windowRef.recaptchaVerifier.render().then(widgetId => {
    //   this.windowRef.recaptchaWidgetId = widgetId;
    // });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filterColorStyleMulti() {
    if (!this.ColStyleList) {
      return;
    }
    let search = this.ColorStyleMultiFilterCtrl.value;
    if (!search) {
      this.filteredColorStyleMulti.next(this.ColStyleList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredColorStyleMulti.next(
      this.ColStyleList.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  filterDiamondColorMulti() {
    if (!this.DiamondColorList) {
      return;
    }
    let search = this.DiamondColorMultiFilterCtrl.value;
    if (!search) {
      this.filteredDiamondColorMulti.next(this.DiamondColorList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDiamondColorMulti.next(
      this.DiamondColorList.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  filterColorClarityMulti() {
    if (!this.ColClarityList) {
      return;
    }
    let search = this.ColorClarityMultiFilterCtrl.value;
    if (!search) {
      this.filteredColorClarityMulti.next(this.ColClarityList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredColorClarityMulti.next(
      this.ColClarityList.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  ProPicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {

      let ProfilePicExt = fileList[0].name.split('.').pop().toUpperCase();
      this.profileextention = fileList[0].name.split('.').pop();
      if (ProfilePicExt == 'PNG' || ProfilePicExt == 'JPG' || ProfilePicExt == 'JPEG') {
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
  AdharPicChanged(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.adharextention = fileList[0].name.split('.').pop();
      let AdharPicExt = fileList[0].name.split('.').pop().toUpperCase();
      let DateFOrmate = formatDate(new Date(), 'dd_MM_yyyy_hh_mm_ss', 'en_US')
      let adharfilename = "ADHAR_CARD_" + DateFOrmate + '.' + this.adharextention;
      this.AdharName = adharfilename;
      if (AdharPicExt == 'JPG' || AdharPicExt == 'JPEG') {
        $("#adharfrm").css("display", "none");
        $("#adharimg").css("display", "block");
        this.AdharfileUplaodURLframe = "";
        this.AdharfilevalidPicName = fileList[0].name;
        this.AdharfilePicBlob = fileList[0];
        this.AdharfileImageName = fileList[0].name;
        this.uploadimage(this.AdharfilePicBlob, adharfilename);
        setTimeout(() => {
          this.AdharfileUplaodURL = this.ImageUrl + this.AdharName;
        }, 1000);
      }
      else if (AdharPicExt == 'PDF') {
        $("#adharimg").css("display", "none");
        $("#adharfrm").css("display", "block");
        this.AdharfileUplaodURL = "./../../../assets/images/No-Image.jpg";
        this.AdharfilevalidPicName = fileList[0].name;
        this.AdharfilePicBlob = fileList[0];
        this.AdharfileImageName = fileList[0].name;
        this.uploadimage(this.AdharfilePicBlob, adharfilename);
        setTimeout(() => {
          this.AdharfileUplaodURLframe = this.ImageUrl + this.AdharName;
        }, 1000);
      } else {
        this.toastr.clear();
        this.toastr.warning(AdharPicExt + " file is not acceptable");
      }
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.AdharfileUplaodURL = reader.result;

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
      let DateFOrmate = formatDate(new Date(), 'dd_MM_yyyy_hh_mm_ss', 'en_US')
      let gstfilename = "GST_" + DateFOrmate + '.' + this.gstextention;
      this.GstName = gstfilename;
      if (GstPicExt == 'JPG' || GstPicExt == 'JPEG') {
        $("#gstfrm").css("display", "none");
        $("#gstimg").css("display", "block");
        this.GstfileUplaodURLframe = "";
        this.GstfilevalidPicName = fileList[0].name;
        this.GstfilePicBlob = fileList[0];
        this.GstfileImageName = fileList[0].name;
        this.uploadimage(this.GstfilePicBlob, gstfilename);
        setTimeout(() => {
          this.GstfileUplaodURL = this.ImageUrl + this.GstName;
        }, 1000);
      } else if (GstPicExt == 'PDF') {
        $("#gstimg").css("display", "none");
        $("#gstfrm").css("display", "block");
        this.GstfileUplaodURL = "./../../../assets/images/No-Image.jpg";
        this.GstfilevalidPicName = fileList[0].name;
        this.GstfilePicBlob = fileList[0];
        this.GstfileImageName = fileList[0].name;
        this.uploadimage(this.GstfilePicBlob, gstfilename);
        setTimeout(() => {
          this.GstfileUplaodURLframe = this.ImageUrl + this.GstName;
        }, 1000);
      } else {
        this.toastr.clear();
        this.toastr.warning(GstPicExt + " file is not acceptable");
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
      let DateFOrmate = formatDate(new Date(), 'dd_MM_yyyy_hh_mm_ss', 'en_US')
      let photoidfilename = "PHOTO_PROOF_" + DateFOrmate + '.' + this.photoidextention;
      this.PhotoIdName = photoidfilename;
      if (PhotoIdPicExt == 'JPG' || PhotoIdPicExt == 'JPEG') {
        $("#photoidfrm").css("display", "none");
        $("#photoidimg").css("display", "block");
        this.PhotoIdfileUplaodURLframe = "";
        this.PhotoIdfilevalidPicName = fileList[0].name;
        this.PhotoIdfilePicBlob = fileList[0];
        this.PhotoIdfileImageName = fileList[0].name;
        this.uploadimage(this.PhotoIdfilePicBlob, photoidfilename);
        setTimeout(() => {
          this.PhotoIdfileUplaodURL = this.ImageUrl + this.PhotoIdName;
        }, 1000);
      } else if (PhotoIdPicExt == 'PDF') {
        $("#photoidimg").css("display", "none");
        $("#photoidfrm").css("display", "block");
        this.PhotoIdfileUplaodURL = "./../../../assets/images/No-Image.jpg";
        this.PhotoIdfilevalidPicName = fileList[0].name;
        this.PhotoIdfilePicBlob = fileList[0];
        this.PhotoIdfileImageName = fileList[0].name;
        this.uploadimage(this.PhotoIdfilePicBlob, photoidfilename);
        setTimeout(() => {
          this.PhotoIdfileUplaodURLframe = this.ImageUrl + this.PhotoIdName;
        }, 1000);
      } else {
        this.toastr.clear();
        this.toastr.warning(PhotoIdPicExt + " file is not acceptable");
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
      let DateFOrmate = formatDate(new Date(), 'dd_MM_yyyy_hh_mm_ss', 'en_US')
      let panfilename = "PAN_" + DateFOrmate + '.' + this.panextention;
      this.PanName = "PAN_" + DateFOrmate + '.' + this.panextention;
      if (PanPicExt == 'JPG' || PanPicExt == 'JPEG') {
        $("#panfrm").css("display", "none");
        $("#panimg").css("display", "block");
        this.PanfileUplaodURLframe = "";
        this.PanfilevalidPicName = fileList[0].name;
        this.PanfilePicBlob = fileList[0];
        this.PanfileImageName = fileList[0].name;
        this.uploadimage(this.PanfilePicBlob, panfilename);
        setTimeout(() => {
          this.PanfileUplaodURL = this.ImageUrl + this.PanName;
        }, 1000);
      } else if (PanPicExt == 'PDF') {
        $("#panimg").css("display", "none");
        $("#panfrm").css("display", "block");
        this.PanfileUplaodURL = "./../../../assets/images/No-Image.jpg";
        this.PanfilevalidPicName = fileList[0].name;
        this.PanfilePicBlob = fileList[0];
        this.PanfileImageName = fileList[0].name;
        this.uploadimage(this.PanfilePicBlob, panfilename);
        setTimeout(() => {
          this.PanfileUplaodURLframe = this.ImageUrl + this.PanName;
        }, 1000);
      } else {
        this.toastr.clear();
        this.toastr.warning(PanPicExt + " file is not acceptable");
      }
    }
  }

  IndCorpChange() {
    if (this.INDCORPRADIO == "Corporate") {
      $("#GENDERHIDE").css("display", "none");
      $("#ANNIHIDE").css("display", "none");
      $("#DOBHIDE").css("display", "none");
    } else {
      $("#DOBHIDE").css("display", "block");
      $("#ANNIHIDE").css("display", "block");
      $("#GENDERHIDE").css("display", "block");
    }
  }
  delete(E: any, Element) {
    if (E == "gst") {
      this.GstfileUplaodURL = "";
      this.GstfileUplaodURLframe = "";
      this.GstfilePicBlob = null;
      this.GstfilevalidPicName = null;
      this.GstfileImageName = "";
      this.GstName = "";
      Element.value = "";
      $("#gstfrm").css("display", "none");
      $("#gstimg").css("display", "block");
    }
    if (E == "Adhar") {
      this.AdharfileUplaodURL = "";
      this.AdharfileUplaodURLframe = "";
      this.AdharfilePicBlob = null;
      this.AdharfilevalidPicName = null;
      this.AdharfileImageName = "";
      this.AdharName = "";
      Element.value = "";
      $("#adharfrm").css("display", "none");
      $("#adharimg").css("display", "block");
    }
    if (E == "pan") {
      this.PanfileUplaodURL = "";
      this.PanfileUplaodURLframe = "";
      this.PanfilePicBlob = null;
      this.PanfilevalidPicName = null;
      this.PanfileImageName = "";
      Element.value = "";
      this.PanName = ""
      $("#panfrm").css("display", "none");
      $("#panimg").css("display", "block");
    }
    if (E == "PhotoId") {
      this.PhotoIdfileUplaodURL = "";
      this.PhotoIdfileUplaodURLframe = "";
      this.PhotoIdfilePicBlob = null;
      this.PhotoIdfilevalidPicName = null;
      this.PhotoIdfileImageName = "";
      this.PhotoIdName = "";
      Element.value = "";
      $("#photoidfrm").css("display", "none");
      $("#photoidimg").css("display", "block");
    }
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

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.LoadGridData();
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

  LoadGridData() {
    this.spinner.show();
    if (this.GRID == false) {
      this.gridColumnApi.setColumnVisible('ClientID', false);
    } else {
      this.gridColumnApi.setColumnVisible('ClientID', true);
    }
    this.ClientServiceSer.getClientDetailGrid({ ClientID: this.CLIENTID }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.gridApi.setRowData(Result.Data);
          this.spinner.hide();
        } else {
          this.gridApi.setRowData();
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  uploadimage(blob, filename) {
    this.spinner.hide();
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
  add() {
    if (this.FIRSTNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter First-Name", "First Name");
      return;
    }
    const PRF = this.dialog.open(ClienContactComponent, {
      width: "35%",
      data: {
        clientid: this.CLIENTID,
        contactid: 0,
        CCODE: "",
        CNO: "",
        CNAME: "",
        CDESIGNATION: "",
        diplayname: ""
      }
    });
    PRF.afterClosed().subscribe(result => {
      this.LoadGridData();
    });
  }
  validEmailcheck(e) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    this.toastr.clear();
    if (e == "CEMAIL") {
      if (re.test(this.CEMAIL)) {
      } else {
        this.toastr.warning("Enter Valid Email Address", "E-maill");
        this.CEMAIL = "";
      }
    }
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
  Save() {
    if (this.CLIENTID.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter First-Name", "First Name");
      return;
    }
    if (this.INDCORPRADIO == "Individual") {
      if (this.DOB == "") {
        this.toastr.clear()
        this.toastr.warning("Select Date Of Date Of Birth", "DOB");
        return;
      }
      if (this.GENDER == "") {
        this.toastr.clear()
        this.toastr.warning("Select Gender", "Gender");
        return;
      }
    }
    if (this.MOB1 == "") {
      this.toastr.clear()
      this.toastr.warning("Select Mobile CC Code", "Mobile 1");
      return;
    }
    if (this.MOB1VAL.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Mobile No.", "Mobile 1");
      return;
    }
    if (this.EMAIL1.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter Email Address", "Email 1");
      return;
    }
    this.spinner.show();
    let DateFOrmate = formatDate(new Date(), 'dd_MM_yyyy_hh_mm_ss', 'en_US')
    let profilefilename
    if (this.ProfilePicBlob) {
      profilefilename = "Profile_" + DateFOrmate + '.' + this.profileextention;
    } else {
      profilefilename = this.profilrname;
    }
    let ObjRes;
    ObjRes = {
      ID: this.ID,
      ClientID: this.CLIENTID,
      Name: this.FIRSTNAME,
      ContactPersonDOB: this.datePipe.transform(this.DOB, "MM/dd/y"),
      Gender: this.GENDER == "Male" ? "M" : "F",
      Maritial: this.MARITIAL,
      AnniversaryDate: this.datePipe.transform(this.ANNIVERSARYDATE, "MM/dd/y"),
      SpouseName: this.SPOUSENAME,
      SpouseNameDOB: this.datePipe.transform(this.SPOUSEDOB, "MM/dd/y"),
      Mobile_1_CC_Code_Name: this.MOB1,
      Mobile_1_NO: this.MOB1VAL,
      Mobile_2_CC_Code_Name: this.MOB2,
      Mobile_2_NO: this.MOB2VAL,
      Email1: this.EMAIL1,
      Email2: this.EMAIL2,
      PAN_NO: this.PAN,
      PAN_PHOTO: this.PanName,
      GST_NO: this.GST,
      GST_PHOTO: this.GstName,
      PHOTO_ID_NO: this.PHOTOID,
      PHOTO_ID_PHOTO: this.PhotoIdName,
      Left_Thumb: this.LTHUMB,
      Left_Index: this.LINDEX,
      Left_Middle: this.LMIDDLE,
      Left_Ring: this.LRING,
      Left_Pinky: this.LPINKY,
      Right_Thumb: this.RTHUMB,
      Right_Index: this.RINDEX,
      Right_Middle: this.RMIDDLE,
      Right_Ring: this.RRING,
      Right_Pinky: this.RPINKY,
      Bangle_Openable: this.BOpenable,
      Necklace_Around_the_Neck: this.NARNECK,
      Bracelet: this.BRACELET,
      Choker: this.CHOKER,
      DiamondColor: this.DiaCol.value.toString(),
      DiamondClarity: this.DiaClarity.value.toString(),
      EaringStyle: this.EarStyle.value.toString(),
      NecklaceStyle: this.NeckStyle.value.toString(),
      ProfileImage: profilefilename,
      EntryBy: this.decodedTkn.UserId,
      C_Type: "C",
      P_Type: "",
      Unit: this.UNIT,
      PHOTO_ID_TYPE: this.PHOTOTYPE,
      Prefix: this.PREFIX,
      MiddleName: this.MIDDLENAME,
      LastName: this.LASTNAME,
      NickName: this.NICKNAME,
      ADHAR_NO: this.ADHAR,
      ADHAR_ID_PHOTO: this.AdharName,
      Bangle_Fixed: this.BFixed,
      Long: this.NLong,
      DiamondShape: this.ColClarity.value.toString(),
      MobileVerify: this.MOBILEVERIFY == true ? 1 : 0,
      EmailVerify: this.EMAIL1VERI == true ? 1 : 0,
      StyleOfjewellary: this.JWELLERYTYPE
    };
    this.ClientServiceSer.FUllClientDetailSave(ObjRes).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.uploadimage(this.ProfilePicBlob, profilefilename);
          let ResultObj = {
            ID: this.AddressID == 0 ? 0 : this.AddressID,
            ClientID: this.CLIENTID,
            Address_Name: this.AddressName,
            Address: this.Address,
            Apartment_OP: this.ApartmentOP,
            Country_Name: this.ResCountryName,
            State_Name: this.ResStateName,
            City_Name: this.ResCityName,
            Zip: this.RESZIP,
            primary: 1
          };
          this.ClientServiceSer.ClientAddSave(ResultObj).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear()
                this.toastr.success("Saved SuccessFully");
              } else {
                this.toastr.clear()
                this.toastr.warning("Something Went Wrong");
              }
            } catch (err) {
              this.toastr.clear()
              this.toastr.error(err);
            }
          });
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
  ContryCodeChange(e) {
    this.ContactCountryCode = e.source.triggerValue;
  }
  GetClientId() {
    if (this.UPDATESUP == false) {
      if (this.FIRSTNAME.trim() != "") {
        this.spinner.show();
        this.ClientServiceSer.VerifySupplier({ NAME: this.FIRSTNAME, Type: "C" }).then((Res) => {
          try {
            if (Res.data == 'TRUE') {
              this.ClientServiceSer.GetUserCode({ name: this.FIRSTNAME, Type: "" }).subscribe(Result => {
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


      }
    }
  }
  Clear() {
    this.INDCORPRADIO = "Individual";
    this.PREFIX = "";
    this.FIRSTNAME = "";
    this.MIDDLENAME = "";
    this.LASTNAME = "";
    this.CLIENTID = "";
    this.CONTACTPERSONE = "";
    this.DOB = "";
    this.GENDER = "";
    this.MARITIAL = "";
    this.ANNIVERSARYDATE = "";
    this.SPOUSENAME = "";
    this.SPOUSEDOB = "";
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
    this.PanfileUplaodURLframe = ""
    this.GST = "";
    this.GstfileUplaodURL = "";
    this.GstfileUplaodURLframe = "";
    this.ADHAR = "";
    this.AdharfileUplaodURL = "";
    this.AdharfileUplaodURLframe = "";
    this.PHOTOID = "";
    this.PhotoIdfileUplaodURL = "";
    this.PhotoIdfileUplaodURLframe = "";
    this.PHOTOTYPE = "";
    this.ProfileUplaodURL = "";
    this.Broker.setValue("");
    this.FLATNO = "";
    this.RESSOS = "";
    this.RESROAD = "";
    this.RESAREA = "";
    this.RESCOUNTRY = "";
    this.ContactID = 0;
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
    this.UNIT = "";
    this.LTHUMB = 0;
    this.LINDEX = 0;
    this.LMIDDLE = 0;
    this.LRING = 0;
    this.LPINKY = 0;
    this.RTHUMB = 0;
    this.RINDEX = 0;
    this.RMIDDLE = 0;
    this.RRING = 0;
    this.RPINKY = 0;
    this.BOpenable = 0;
    this.BSlip = 0;
    this.NLock = 0;
    this.NARNECK = 0;
    this.BRACELET = "";
    this.CHOKER = "";
    this.PRODUCREMARK = "";
    this.SPECIALREMARK = "";
    this.JWELLERYTYPE = "";
    this.COLORTYPE = "";
    this.COLORCLARITY = "";
    this.DCOLORTYPE = "";
    this.DCLARITY = "";
    this.EaringStyle = "";
    this.NecklaceStyle = "";
    this.REFERENCES = "";
    this.REMARK = "";
    this.HISTORY = "";
    this.MOBILETYPE = "";
    this.CNAME = "";
    this.CDESIGNATION = "";
    this.CONPHONECODE = "";
    this.CONPHONE = "";
    this.CADDRESS = "";
    this.CEMAIL = "";
    this.ID = 0;
    this.ColStyle.setValue('');
    this.ColClarity.setValue('');
    this.DiaCol.setValue('');
    this.DiaClarity.setValue('');
    this.EarStyle.setValue('');
    this.NeckStyle.setValue('');
    this.gridApi.setRowData("");
    this.LoadGridData();
  }

  onGridRowClicked(eve: any) {
    let actionType = eve.event.target.getAttribute("data-action-type");
    if (actionType == "UpdateUser") {
      if (this.FIRSTNAME.trim() == "") {
        this.toastr.clear()
        this.toastr.warning("Enter First-Name", "First Name");
        return;
      }
      const PRF = this.dialog.open(ClienContactComponent, {
        width: "35%",
        data: {
          clientid: this.CLIENTID,
          contactid: eve.data.ID,
          CCODE: eve.data.Mobile_CC_Code_Country,
          CNO: eve.data.MobileNo,
          CNAME: eve.data.Name,
          CDESIGNATION: eve.data.Designation,
          diplayname: eve.data.DispName
        }
      });
      PRF.afterClosed().subscribe(result => {
        this.LoadGridData();
      });
    }
    if (actionType == "DeleteUser") {
      Swal.fire({
        title: "Are you sure you want to delete " + eve.data.Name + "?",
        icon: "warning",
        cancelButtonText: "No",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then(result => {
        this.spinner.show();
        if (result.value) {
          this.ClientServiceSer.ClientContactDelete({ Id: eve.data.ID }).subscribe(Result => {
            try {
              if (Result.Success == 1) {
                this.toastr.clear();
                this.toastr.success("Deleted Successfully", "SUCCESS");
                this.LoadGridData();
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
          this.spinner.hide();
        }
      });
      this.spinner.hide();
    }
    else {
      this.spinner.hide();
    }
  }
  setDefaultPic() { this.ModelImage = "./../../../assets/images/No-Image.jpg"; }
  setDefaultPic5() { this.AdharfileUplaodURL = "./../../../assets/images/No-Image.jpg"; }
  setDefaultPic1() { this.PhotoIdfileUplaodURL = "./../../../assets/images/No-Image.jpg"; }
  setDefaultPic2() { this.GstfileUplaodURL = "./../../../assets/images/No-Image.jpg"; }
  setDefaultPic3() { this.PanfileUplaodURL = "./../../../assets/images/No-Image.jpg"; }
  setDefaultPic4() { this.ProfileUplaodURL = "./../../../assets/images/No-Image.jpg"; }
  filteredBrokers(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.BrokerArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  AddAddress() {
    if (this.FIRSTNAME.trim() == "") {
      this.toastr.clear()
      this.toastr.warning("Enter First-Name", "First Name");
      return;
    }
    const PRF = this.dialog.open(ClientAddressComponent, {
      width: "35%",
      data: { clientid: this.CLIENTID, DATARESULT: "" }
    });
    PRF.afterClosed().subscribe(result => {
      if (result == "SAVE") {
        let addressobj = {
          ClientID: this.CLIENTID,
          ID: 0
        };
        this.ClientServiceSer.ClientAdd(addressobj).subscribe(Result => {
          try {
            if (Result.Success == 1) {
              this.Addresslist = Result.Data;
            } else {
            }
          } catch (err) {
            this.toastr.error(err);
          }
        });
      }
    });
  }
  UpdateAddress(e: any) {
    const PRF = this.dialog.open(ClientAddressComponent, {
      width: "35%",
      data: { clientid: this.CLIENTID, DATARESULT: e }
    });
    PRF.afterClosed().subscribe(result => {
      if (result == "SAVE") {
        let addressobj = {
          ClientID: this.CLIENTID,
          ID: 0,
          primary: 0
        };
        this.ClientServiceSer.ClientAdd(addressobj).subscribe(Result => {
          try {
            if (Result.Success == 1) {
              this.Addresslist = Result.Data;
            } else {
            }
          } catch (err) {
            this.toastr.error(err);
          }
        });
      }
    });
  }
  DeleteAddress(e: any, m: any) {
    Swal.fire({
      title: "Are you sure you want to delete " + e + "?",
      icon: "warning",
      cancelButtonText: "No",
      showCancelButton: true,
      confirmButtonText: "Yes"
    }).then(result => {
      this.spinner.show();
      if (result.value) {
        this.ClientServiceSer.ClientAddDelete({ ClientID: m, ID: e }).subscribe(Result => {
          try {
            if (Result.Success == 1) {
              this.toastr.clear()
              this.toastr.success("Delete Successfully");
              this.spinner.hide();
              let addressobj = {
                ClientID: this.CLIENTID,
                ID: 0,
                primary: 0
              };
              this.ClientServiceSer.ClientAdd(addressobj).subscribe(Result => {
                try {
                  if (Result.Success == 1) {
                    this.Addresslist = Result.Data;
                  } else {
                    this.Addresslist = Result.Data;
                  }
                } catch (err) {
                  this.toastr.error(err);
                }
              });
              let addressobj1 = {
                ClientID: this.CLIENTID,
                ID: 0,
                primary: 1
              };
              this.ClientServiceSer.ClientAdd(addressobj1).subscribe(Result => {
                try {
                  if (Result.Success == 1) {
                    this.Addresslistprimary = Result.Data;
                  } else {
                  }
                } catch (err) {
                  this.toastr.error(err);
                }
              });
            } else {
              this.spinner.hide();
              this.toastr.clear()
              this.toastr.warning("Something Went Wrong");
            }
          } catch (err) {
            this.spinner.hide();
            this.toastr.clear()
            this.toastr.error(err);
          }
        });
      } else {
        this.spinner.hide();
      }
    });
  }
  UpdatePrimaryAddress(e: any) {
    const PRF = this.dialog.open(ClientAddressComponent, {
      width: "35%",
      data: { clientid: this.CLIENTID, DATARESULT: e }
    });
    PRF.afterClosed().subscribe(result => {
      if (result == "SAVE") {
        let addressobj = {
          ClientID: this.CLIENTID,
          ID: 0,
          primary: 1
        };
        this.ClientServiceSer.ClientAdd(addressobj).subscribe(Result => {
          try {
            if (Result.Success == 1) {
              this.Addresslistprimary = Result.Data;
            } else {
            }
          } catch (err) {
            this.toastr.error(err);
          }
        });
      }
    });

  }
  maritalselect() {
    if (this.MARITIAL == "UnMarried" || this.MARITIAL == "Widow") {
      $("#spname").hide();
      $("#spdob").hide();
      $("#anndate").hide();
    } else if (this.MARITIAL == "Married") {
      $("#spname").show();
      $("#spdob").show();
      $("#anndate").show();
    }
  }
  addstatecode() {
    this.StateCode = this.GST.substring(0, 2);
  }
  // formatPhone() {
  //   if (this.MOB1VAL) {
  //     const toSelect1 = this.mobile1List.find(c => c.ConCodeName == this.Mob1CODE.value);
  //     const countryCode = toSelect1.CON_SORTNAME;
  //     const parsedValue = parse(this.MOB1VAL, countryCode);
  //     if (Object.keys(parsedValue).length === 0 && parsedValue.constructor === Object) {
  //     }
  //     if (isValidNumber(parsedValue) == false) {
  //       this.toastr.clear()
  //       this.toastr.warning("Please Enter Valid Number");
  //     }
  //     const formatedValue = format(parsedValue, 'International');
  //     this.MOB1VAL = formatedValue;
  //   }
  // }
  sendLoginCode() {
    if (this.MOB1VAL == "") {
      this.toastr.clear()
      this.toastr.info("Please Enter Mobile Number.");
      return;
    }
    this.resendmobile = false;
    this.TIMERmobile = true;
    this.mobileotp = Math.floor(1000 + Math.random() * 9000);
    const PRF = this.dialog.open(OtpCheckMobileComponent, {
      width: "35%",
      data: { OTP: this.mobileotp, MOBILE: this.MOB1VAL }
    });
    PRF.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.MOBILEVERIFY = true;
      }
      else {
        this.MOBILEVERIFY = false;
      }
    });
  }
  sendLoginCodeemail() {
    if (this.EMAIL1 == "") {
      this.toastr.clear()
      this.toastr.info("Please Enter EmailId");
      return;
    }
    this.resend = false;
    this.TIMER = true;
    this.emailotp = Math.floor(1000 + Math.random() * 9000);
    const PRF = this.dialog.open(OtpCheckComponent, {
      width: "35%",
      data: { OTP: this.emailotp, EMAIL: this.EMAIL1 }
    });
    PRF.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.EMAIL1VERI = true;
      }
      else {
        this.EMAIL1VERI = false;
      }
    });
  }
  getCountryCodeForRegionCode(regionCode: string): string {
    return PhoneNumber.getCountryCodeForRegionCode(regionCode);
  }

  getExample(regionCode: string, format = 'national'): string {
    const example = PhoneNumber.getExample(regionCode);
    const countryCode = PhoneNumber.getCountryCodeForRegionCode(regionCode);

    return example.getNumber(format);
  }

  getMask(regionCode: string, format = 'national'): string {
    return this.getExample(regionCode, format).replace(/\d/g, '0');
  }

  getRegionCodeForCountryCode(regionCode: string): string {
    return PhoneNumber.getRegionCodeForCountryCode(regionCode);
  }

  setMaskAndExample(regionCode: string) {
    this.example = this.getExample(regionCode);
    this.mask = this.getMask(regionCode);
  }

  stringify(json: any): string {
    return JSON.stringify(json, null, 2);
  }
  Panshow() {
    if (this.PanfileUplaodURL != "./../../../assets/images/No-Image.jpg") {
      const PRF = this.dialog.open(ShowImageComponent, {
        width: "35%",
        data: { Url: this.PanfileUplaodURL }
      });
      PRF.afterClosed().subscribe(result => { });
    } else if (this.PanfileUplaodURLframe != "") {
      const PRF = this.dialog.open(ShowFrameComponent, {
        width: "50%",
        height: "50%",
        data: { Url: this.PanfileUplaodURLframe }
      });
      PRF.afterClosed().subscribe(result => { });
    }
  }
  PhotoIdshow() {
    if (this.PhotoIdfileUplaodURL != "./../../../assets/images/No-Image.jpg") {
      const PRF = this.dialog.open(ShowImageComponent, {
        width: "35%",
        data: { Url: this.PhotoIdfileUplaodURL }
      });
      PRF.afterClosed().subscribe(result => { });
    } else if (this.PhotoIdfileUplaodURLframe != "") {
      const PRF = this.dialog.open(ShowFrameComponent, {
        width: "50%",
        height: "50%",
        data: { Url: this.PhotoIdfileUplaodURLframe }
      });
      PRF.afterClosed().subscribe(result => { });
    }
  }
  Gstshow() {
    if (this.GstfileUplaodURL != "./../../../assets/images/No-Image.jpg") {
      const PRF = this.dialog.open(ShowImageComponent, {
        width: "35%",
        data: { Url: this.GstfileUplaodURL }
      });
      PRF.afterClosed().subscribe(result => { });
    } else if (this.GstfileUplaodURLframe != "") {
      const PRF = this.dialog.open(ShowFrameComponent, {
        width: "50%",
        height: "50%",
        data: { Url: this.GstfileUplaodURLframe }
      });
      PRF.afterClosed().subscribe(result => { });
    }
  }
  Adharshow() {
    if (this.AdharfileUplaodURL != "./../../../assets/images/No-Image.jpg") {
      const PRF = this.dialog.open(ShowImageComponent, {
        width: "35%",
        data: { Url: this.AdharfileUplaodURL }
      });
      PRF.afterClosed().subscribe(result => { });
    } else if (this.AdharfileUplaodURLframe != "") {
      const PRF = this.dialog.open(ShowFrameComponent, {
        width: "50%",
        height: "50%",
        data: { Url: this.AdharfileUplaodURLframe }
      });
      PRF.afterClosed().subscribe(result => { });
    }
  }
  ZIPCHANGE() {
    this.ClientServiceSer.ZipCodeFillstart({ ZIP_CODE: this.RESZIP }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.RESCOUNTRY = Result.Data.CON_CODE;
          this.RescountryChanged();
          this.RESSTATE = Result.Data.REG_CODE;
          this.ResstateChanged();
          this.RESCITY = Result.Data.CITY_CODE;
          this.ResStateName = Result.Data.REG_NAME;
          this.ResCityName = Result.Data.CITY_NAME;
          this.ResCountryName = Result.Data.CON_NAME;
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
}

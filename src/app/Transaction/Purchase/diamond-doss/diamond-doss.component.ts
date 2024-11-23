import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PermissionService } from 'src/app/Services/Access/permission.service';
import { ColMastService } from 'src/app/Services/Masters/col-mast.service';
import { LabMastService } from 'src/app/Services/Masters/lab-mast.service';
import { PurmastService } from 'src/app/Services/Masters/purmast.service';
import { MemoInService } from 'src/app/Services/Transaction/memo-in.service';
import * as $ from "jquery";
import { JwtHelperService } from '@auth0/angular-jwt';
import { PurchaseService } from 'src/app/Services/Transaction/purchase.service';

export interface Lot1 {
  name: string;
  code: string;
}
@Component({
  selector: 'app-diamond-doss',
  templateUrl: './diamond-doss.component.html',
  styleUrls: ['./diamond-doss.component.css']
})
export class DiamondDossComponent implements OnInit {

  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  PurchaseType: FormControl;
  filteredPurchaseType: Observable<any[]>;
  PURCHASETYPE: any = "";
  PurchaseArr: Lot1[] = [];
  PurchaseTypeName: any = '';

  MemoNumber: FormControl;
  filteredMemoNumber: Observable<any[]>;
  MemoNumberCode: any = "";
  MemoNumberArr: Lot1[] = [];
  MemoNumberName: any = '';

  MaterialFlag: boolean = false;
  Material: FormControl;
  filteredMaterial: Observable<any[]>;
  MaterialCode: any = "";
  MaterialArr: Lot1[] = [];
  MaterialName: any = '';

  ShapeFlag: boolean = false;
  Shape: FormControl;
  filteredShape: Observable<any[]>;
  ShapeCode: any = "";
  ShapeArr: Lot1[] = [];
  ShapeName: any = '';

  Clarity: FormControl;
  filteredClarity: Observable<any[]>;
  ClarityCode: any = "";
  ClarityArr: Lot1[] = [];
  ClarityName: any = '';

  Origin: FormControl;
  filteredOrigin: Observable<any[]>;
  OriginCode: any = "";
  OriginArr: Lot1[] = [];
  OriginName: any = '';

  Color: FormControl;
  filteredColor: Observable<any[]>;
  ColorCode: any = "";
  ColorArr: Lot1[] = [];
  ColorName: any = '';

  Category: any = "";
  selectedStatus: any = "";
  SGTo: number = 0;
  SGFrom: number = 0;
  SGRang: any = "";
  Pcs: number = 0;
  selectedPriceUnit: any = "Pec";
  TAmount: number = 0;
  PRUN: number = 0;
  Weight: number = 0;
  AvgWt: number = 0;
  Unit: any = "";
  SELLERSMARK: any = "";
  CURRENCY: any = "INR";
  Conversion: number = 0.00;
  USDPrice: number = 0.00;
  PurPcs: number = 0;
  PurWeight: number = 0;
  PurAvgWt: number = 0;
  PurUnit: any = "";
  PurTAmount: number = 0;
  SelectionPer: number = 0
  PurCURRENCY: any = "INR";
  PurConversion: number = 0.00;
  EXPRE: number = 0
  NETCONV: number = 0
  USDPRICE: number = 0
  FINALPRUN: number = 0;
  FINALAMOUNT: number = 0.00;
  ADDISC1: number = 0.00;
  DISC1: number = 0.00;
  DISCDET1: number = 0.00;
  ADDISC2: number = 0.00;
  DISC2: number = 0.00;
  DISCDET2: number = 0.00;
  BROKERAGEPER: number = 0.00;
  BROKERAGEAMT: number = 0.00;
  ERLPAYDISCPER: number = 0.00;
  ERLPAYDISCAMT: number = 0.00;
  NETAMTPAYABLE: number = 0.00;
  selectedPurpose: any = "STOCK";
  Comment: any = "";
  OrdnerNo: any = "";
  Colourshade: any = "";
  SIZE: any = "";
  categoryarr = []
  MemoNo: any = ""

  Disbled: boolean = false

  constructor(
    private spinner: NgxSpinnerService,
    private ColMastSer: ColMastService,
    private PurchaseSer: PurchaseService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<DiamondDossComponent>,
    private PermissionSer: PermissionService,
    private PurmastSer: PurmastService,
    private MemoInSer: MemoInService,
    @Inject(MAT_DIALOG_DATA) public valdata: any
  ) {
    this.PurchaseType = new FormControl();
    this.MemoNumber = new FormControl();
    this.Material = new FormControl();
    this.Shape = new FormControl();
    this.Clarity = new FormControl();
    this.Origin = new FormControl();
    this.Color = new FormControl();
    this.categoryarr = [{ code: 'DOSNAT', name: 'Natural' }, { code: 'DOSCVD', name: 'CVD' }]
    this.Category = valdata.sortname;
    this.MemoNo = valdata.MemoNo;

    if (valdata.SrNo != "") {
      let ObjResult = {
        USERID: this.decodedTkn.UserId,
        PAGENAME: "purchaseEntry.aspx"
      }
      this.PermissionSer.PageWisePermissionFill(ObjResult).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            if (Result.Data[0].ISEDIT == "False") {
              this.PurchaseSer.PurchaseLFillModel(
                { TrnNo: valdata.trnno, SrNo: valdata.SrNo }
              ).subscribe(Result => {
                try {
                  if (Result.Success == 1) {

                    $("#save").hide();
                    this.MaterialCode = Result.Data[0].MaterialName;
                    this.SelectMaterialOption();
                    this.ShapeCode = Result.Data[0].ShapeName;
                    this.SelectShapeOption()
                    this.OriginCode = Result.Data[0].originName;
                    this.SelectOriginOption()
                    this.ClarityCode = Result.Data[0].ClarityName;
                    this.SelectClarityOption()
                    this.ColorCode = Result.Data[0].ColorName;
                    this.SelectColorOption()
                    this.Colourshade = Result.Data[0].COLORSHADE;
                    if (Result.Data[0].TYPEOFPUR == "1") {
                      this.PURCHASETYPE = "NEW"
                    } else {
                      this.PURCHASETYPE = "MEMO"
                    }
                    this.MemoNumberCode = Result.Data[0].MEMONO;
                    this.DISALEMEMO(Result.Data[0].TYPEOFPUR)
                    this.selectedStatus = Result.Data[0].SieveGuage;
                    this.SGFrom = Result.Data[0].FSIGI;
                    this.SGTo = Result.Data[0].TSIGI;
                    this.SGRang = Result.Data[0].SIGIRANGE
                    this.ChnageRangeFormat()
                    this.Pcs = Result.Data[0].OPCS
                    this.Weight = Result.Data[0].OWEIGHT
                    this.ChnagePriceCal()
                    this.Unit = Result.Data[0].OUNIT
                    this.AvgWt = Result.Data[0].OAVGWEIGHT
                    this.SELLERSMARK = Result.Data[0].OSELLERMARK
                    this.CURRENCY = Result.Data[0].OCURRENCY
                    this.SIZE = Result.Data[0].MANSIZE
                    this.ChnageRangeFormat1()
                    this.USDPrice = Result.Data[0].OUSD
                    this.Conversion = Result.Data[0].OCONVRATE
                    this.selectedPriceUnit = Result.Data[0].OPCWT
                    this.PRUN = Result.Data[0].OASKPRICE
                    this.ChnagePriceCal()
                    this.TAmount = Result.Data[0].OTOTAMT
                    this.PurPcs = Result.Data[0].PPCS
                    this.PurWeight = Result.Data[0].PWEIGHT
                    this.PurChnagePriceCal()
                    this.PurChangeForSelection()
                    this.PurUnit = Result.Data[0].PUNIT
                    this.PurAvgWt = Result.Data[0].PAVGWEIGHT
                    this.SelectionPer = Result.Data[0].PSELECTION
                    this.PurCURRENCY = Result.Data[0].PCURRENCY
                    this.PurConversion = Result.Data[0].PCONVRATE
                    this.EXPRE = Result.Data[0].PEXCPRE
                    this.PurChnageRangeFormat1()
                    this.NETCONV = Result.Data[0].PNETCONVRATE
                    this.USDPRICE = Result.Data[0].PUSD
                    this.FINALPRUN = Result.Data[0].PFINALPRICE
                    this.PurTAmount = Result.Data[0].PTOTAMT
                    this.FINALAMOUNT = Result.Data[0].PAYFAMT
                    this.ADDISC1 = Result.Data[0].ADDDISC1
                    this.ADDISC2 = Result.Data[0].ADDDISC2
                    this.DISC1 = Result.Data[0].DISC1
                    this.DISC2 = Result.Data[0].DISC2
                    this.DISCDET1 = Result.Data[0].DISCDET1
                    this.DISCDET2 = Result.Data[0].DISCDET2
                    this.BROKERAGEPER = Result.Data[0].BROKRAGE
                    this.BROKERAGEAMT = Result.Data[0].BROKRAGEAMT
                    this.ERLPAYDISCPER = Result.Data[0].ERLYPAYPER
                    this.ERLPAYDISCAMT = Result.Data[0].ERLYPAYAMT
                    this.NETAMTPAYABLE = Result.Data[0].NETAMTPAY
                    this.selectedPurpose = Result.Data[0].Purpose
                    this.ChnagePurpose()
                    this.OrdnerNo = Result.Data[0].STKORD
                    this.Comment = Result.Data[0].COMMENT
                    this.Disbled = true;

                    this.Material.disable();
                    this.Material.disabled

                    this.Shape.disable();
                    this.Shape.disabled

                    this.Origin.disable();
                    this.Origin.disabled

                    this.Clarity.disable();
                    this.Clarity.disabled

                    this.Color.disable();
                    this.Color.disabled

                    this.PurchaseType.disable();
                    this.PurchaseType.disabled
                  } else {
                  }
                } catch (err) {
                  this.toastr.error(err);
                }
              });
            } else {
              this.PurchaseSer.PurchaseLFillModel(
                { TrnNo: valdata.trnno, SrNo: valdata.SrNo }
              ).subscribe(Result => {
                try {
                  if (Result.Success == 1) {
                    this.MaterialCode = Result.Data[0].MaterialName;
                    this.SelectMaterialOption();
                    this.ShapeCode = Result.Data[0].ShapeName;
                    this.SelectShapeOption()
                    this.OriginCode = Result.Data[0].originName;
                    this.SelectOriginOption()
                    this.ClarityCode = Result.Data[0].ClarityName;
                    this.SelectClarityOption()
                    this.ColorCode = Result.Data[0].ColorName;
                    this.SelectColorOption()
                    this.Colourshade = Result.Data[0].COLORSHADE;
                    if (Result.Data[0].TYPEOFPUR == "1") {
                      this.PURCHASETYPE = "NEW"
                    } else {
                      this.PURCHASETYPE = "MEMO"
                    }
                    this.MemoNumberCode = Result.Data[0].MEMONO;
                    this.DISALEMEMO(Result.Data[0].TYPEOFPUR)
                    this.selectedStatus = Result.Data[0].SieveGuage;
                    this.SGFrom = Result.Data[0].FSIGI;
                    this.SGTo = Result.Data[0].TSIGI;
                    this.SGRang = Result.Data[0].SIGIRANGE
                    this.ChnageRangeFormat()
                    this.Pcs = Result.Data[0].OPCS
                    this.Weight = Result.Data[0].OWEIGHT
                    this.ChnagePriceCal()
                    this.SIZE = Result.Data[0].MANSIZE
                    this.Unit = Result.Data[0].OUNIT
                    this.AvgWt = Result.Data[0].OAVGWEIGHT
                    this.SELLERSMARK = Result.Data[0].OSELLERMARK
                    this.CURRENCY = Result.Data[0].OCURRENCY
                    this.ChnageRangeFormat1()
                    this.USDPrice = Result.Data[0].OUSD
                    this.Conversion = Result.Data[0].OCONVRATE
                    this.selectedPriceUnit = Result.Data[0].OPCWT
                    this.PRUN = Result.Data[0].OASKPRICE
                    this.ChnagePriceCal()
                    this.TAmount = Result.Data[0].OTOTAMT
                    this.PurPcs = Result.Data[0].PPCS
                    this.PurWeight = Result.Data[0].PWEIGHT
                    this.PurChnagePriceCal()
                    this.PurChangeForSelection()
                    this.PurUnit = Result.Data[0].PUNIT
                    this.PurAvgWt = Result.Data[0].PAVGWEIGHT
                    this.SelectionPer = Result.Data[0].PSELECTION
                    this.PurCURRENCY = Result.Data[0].PCURRENCY
                    this.PurConversion = Result.Data[0].PCONVRATE
                    this.EXPRE = Result.Data[0].PEXCPRE
                    this.PurChnageRangeFormat1()
                    this.NETCONV = Result.Data[0].PNETCONVRATE
                    this.USDPRICE = Result.Data[0].PUSD
                    this.FINALPRUN = Result.Data[0].PFINALPRICE
                    this.PurTAmount = Result.Data[0].PTOTAMT
                    this.FINALAMOUNT = Result.Data[0].PAYFAMT
                    this.ADDISC1 = Result.Data[0].ADDDISC1
                    this.ADDISC2 = Result.Data[0].ADDDISC2
                    this.DISC1 = Result.Data[0].DISC1
                    this.DISC2 = Result.Data[0].DISC2
                    this.DISCDET1 = Result.Data[0].DISCDET1
                    this.DISCDET2 = Result.Data[0].DISCDET2
                    this.BROKERAGEPER = Result.Data[0].BROKRAGE
                    this.BROKERAGEAMT = Result.Data[0].BROKRAGEAMT
                    this.ERLPAYDISCPER = Result.Data[0].ERLYPAYPER
                    this.ERLPAYDISCAMT = Result.Data[0].ERLYPAYAMT
                    this.NETAMTPAYABLE = Result.Data[0].NETAMTPAY
                    this.selectedPurpose = Result.Data[0].Purpose
                    this.ChnagePurpose()
                    this.OrdnerNo = Result.Data[0].STKORD
                    this.Comment = Result.Data[0].COMMENT
                  } else {
                  }
                } catch (err) {
                  this.toastr.error(err);
                }
              });
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
    }

    this.PurmastSer.PurchaseFillDrop({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.PurchaseArr = Result.Data.map(item => {
            return {
              code: item.Purchase_Code,
              name: item.Purchase_Name
            };
          });
          this.filteredPurchaseType = this.PurchaseType.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredPurchaseTypes(lot) : this.PurchaseArr.slice()))
          );
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
    this.PurmastSer.GetMemoByProcess({ MemoNo: this.MemoNo, Category: this.Category }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.MemoNumberArr = Result.Data.map(item => {
            return {
              code: item.ID,
              name: item.TrnNo
            };
          });
          this.filteredMemoNumber = this.MemoNumber.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredMemoNumbers(lot) : this.MemoNumberArr.slice()))
          );
        } else {
          this.toastr.info("Data not found");
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
  }

  ngOnInit(): void {
    this.MemoInSer.MaterialFillbyMemoName({ M_cat_SortName: this.Category }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.MaterialArr = Result.Data.map(item => {
            return {
              code: item.NAME,
              name: item.CODE
            };
          });
          this.filteredMaterial = this.Material.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredmaterials(lot) : this.MaterialArr.slice()))
          );
          this.Material.valueChanges.subscribe(value => this.autocompletevalidation("Material"));
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });
  }
  SelectMaterialOption() {
    if (this.Material.value != "") {
      this.MemoInSer.GetShapebyMaterial(
        { M_Sortname: this.MaterialCode }
      ).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.ShapeArr = Result.Data.map(item => {
              return {
                code: item.S_Name,
                name: item.S_SortName
              };
            });
            this.filteredShape = this.Shape.valueChanges.pipe(
              startWith(""),
              map(lot => (lot ? this.filteredShapes(lot) : this.ShapeArr.slice()))
            );
            this.Shape.valueChanges.subscribe(value => this.autocompletevalidation("Shape"));
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });

      this.MemoInSer.GetOriginbyMaterial({ M_Sortname: this.MaterialCode }).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.OriginArr = Result.Data.map(item => {
              return {
                code: item.O_COUNTRY,
                name: item.O_SORTNAME
              };
            });
            this.filteredOrigin = this.Origin.valueChanges.pipe(
              startWith(""),
              map(lot => (lot ? this.filteredOrigins(lot) : this.OriginArr.slice()))
            );
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });

      this.MemoInSer.GetColorbyMaterial({ M_SortName: this.MaterialCode }).subscribe(Result => {

        try {
          if (Result.Success == 1) {
            this.ColorArr = Result.Data.map(item => {
              return {
                C_Code: item.C_Code,
                code: item.C_SortName,
                name: item.C_Name
              };
            });
            this.filteredColor = this.Color.valueChanges.pipe(
              startWith(""),
              map(lot => (lot ? this.filteredColors(lot) : this.ColorArr.slice()))
            );
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
      this.MemoInSer.GetClaritybyMaterial(
        { M_SortName: this.MaterialCode }
      ).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            this.ClarityArr = Result.Data.map(item => {
              return {
                code: item.Q_Name,
                name: item.Q_Name
              };
            });
            this.filteredClarity = this.Clarity.valueChanges.pipe(
              startWith(""),
              map(lot => (lot ? this.filteredClaritys(lot) : this.ClarityArr.slice()))
            );
          } else {
          }
        } catch (err) {
          this.toastr.error(err);
        }
      });
    }
  }
  SelectShapeOption() {
    if (this.Shape.value != "") {
    }
  }
  SelectOriginOption() {
    if (this.Origin.value != "") {
    }
  }
  SelectClarityOption() {
    if (this.Clarity.value != "") {
    }
  }
  SelectColorOption() {
    if (this.Color.value != "") {
    }
  }
  Close() {
    this._mdr.close();
  }
  filteredmaterials(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.MaterialArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredPurchaseTypes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.PurchaseArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredMemoNumbers(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.MemoNumberArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredShapes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ShapeArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredOrigins(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.OriginArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredClaritys(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ClarityArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  filteredColors(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ColorArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  DISALEMEMO(e: any) {
    if (e == '1') {
      this.MemoNumber.disable()
      this.MemoNumber.disabled
    } else {
      this.MemoNumber.enable()
      this.MemoNumber.enabled
    }
  }
  autocompletevalidation(auto) {
    if (auto == "Material") {
      const country = this.MaterialArr.find(c => c.name == this.Material.value);
      if (country) {
        this.MaterialFlag = true;
      } else {
        this.MaterialFlag = false;
      }
    }
    if (auto == "Shape") {
      const country = this.ShapeArr.find(c => c.name == this.Shape.value);
      if (country) {
        this.ShapeFlag = true;
      } else {
        this.ShapeFlag = false;
      }
    }
  }
  ChnageRangeFormat() {
    if (this.selectedStatus == "SIEVE") {
      $("#fsigi").css("display", "block");
      $("#tsigi").css("display", "block");
      $("#sigirange").css("display", "block");
      this.SGRang = "+" + this.SGFrom + "-" + this.SGTo;
    } else if (this.selectedStatus == "GAGUE") {
      $("#fsigi").css("display", "block");
      $("#tsigi").css("display", "block");
      $("#sigirange").css("display", "block");
      this.SGRang = Number(this.SGFrom).toFixed(2) + "mm-" + Number(this.SGTo).toFixed(2) + "mm";
    } else if (this.selectedStatus == "NONE") {
      $("#fsigi").css("display", "none");
      $("#tsigi").css("display", "none");
      $("#sigirange").css("display", "none");
      this.SGFrom = 0
      this.SGTo = 0
      this.SGRang = ""
    } else if (this.selectedStatus = "BY") {
      $("#fsigi").css("display", "block");
      $("#tsigi").css("display", "block");
      $("#sigirange").css("display", "block");
      this.SGRang = this.SGFrom + "X" + this.SGTo + " mm";
    }
  }
  ChnagePriceCal() {
    if (this.Weight != 0 || this.Pcs != 0) {
      this.AvgWt = Math.round((this.Weight / this.Pcs) * 100) / 100;
    }
    else {
      this.AvgWt = 0
    }
    if (this.Pcs == 0 || this.Pcs == null) {
    } else {
    }
    if (this.selectedPriceUnit == "Piece") {
      this.TAmount = Math.round((this.PRUN * this.Pcs) * 100) / 100;
    } else if (this.selectedPriceUnit == "Weight") {
      this.TAmount = Math.round((this.PRUN * this.Weight) * 100) / 100;
    }
    else {
      this.TAmount = 0
    }
  }

  PurChnagePriceCal() {
    if (this.PurWeight != 0 || this.PurPcs != 0) {
      this.PurAvgWt = Math.round((this.PurWeight / this.PurPcs) * 100) / 100;
    }
    else {
      this.PurAvgWt = 0
    }
    if (this.PurPcs == 0 || this.PurPcs == null) {
    } else {
    }
    if (this.selectedPriceUnit == "Piece") {
      this.PurTAmount = Math.round((this.FINALPRUN * this.PurPcs) * 100) / 100;
    } else if (this.selectedPriceUnit == "Weight") {
      this.PurTAmount = Math.round((this.FINALPRUN * this.PurWeight) * 100) / 100;
    }
    else {
      this.PurTAmount = 0
    }
    this.CHANGETOTALAMT()
  }
  PurChangeForSelection() {
    if (this.PurWeight != 0 || this.Weight != 0) {
      this.SelectionPer = this.PurWeight / this.Weight * 100
    } else {
      this.SelectionPer = 0
    }
  }
  ChnageRangeFormat1() {
    if (this.CURRENCY == "USD") {
      $("#conversation").css("display", "block");
    } else {
      $("#conversation").css("display", "none");
    }
  }
  PurChnageRangeFormat1() {
    if (this.PurCURRENCY == "USD") {
      $("#purConversation").css("display", "block");
      $("#netconv").css("display", "block");
      $("#expre").css("display", "block");
      this.NETCONV = parseFloat(this.PurConversion.toString()) + parseFloat(this.EXPRE.toString())
    } else {
      $("#purConversation").css("display", "none");
      $("#netconv").css("display", "none");
      $("#expre").css("display", "none");
      this.NETCONV = 0
    }
  }
  ChnagePurpose() {
    if (this.selectedPurpose == "ORDER") {
      $("#ord").css("display", "block");
    }
    else if (this.selectedPurpose == "STOCK") {
      $("#ord").css("display", "none");
    }
  }
  Save() {
    if (this.PURCHASETYPE.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Type Of Purchase", "Warning");
      return;
    }
    if (this.PURCHASETYPE == "MEMO") {
      if (this.MemoNumberCode.trim() == "") {
        this.toastr.clear();
        this.toastr.warning("Select Memo Number", "Warning");
        return;
      }
    }
    if (this.Colourshade.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Color Shade", "Warning");
      return;
    }
    if (this.ColorCode.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Color", "Warning");
      return;
    }
    if (this.ClarityCode.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Clarity", "Warning");
      return;
    }
    if (this.MaterialCode.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Material", "Warning");
      return;
    }
    if (this.ShapeCode.trim() == "") {
      this.toastr.clear();
      this.toastr.warning("Select Shape", "Warning");
      return;
    }
    if (this.Pcs == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Pcs", "Warning");
      return;
    }
    if (this.PurPcs == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Purchase Pcs", "Warning");
      return;
    }
    if (this.Weight == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Weight", "Warning");
      return;
    }
    if (this.PurWeight == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Purchase Weight", "Warning");
      return;
    }
    if (this.Unit == "") {
      this.toastr.clear();
      this.toastr.warning("select Unit", "Warning");
      return;
    }
    if (this.PurUnit == "") {
      this.toastr.clear();
      this.toastr.warning("select Purchase Unit", "Warning");
      return;
    }
    if (this.CURRENCY == "") {
      this.toastr.clear();
      this.toastr.warning("select CURRENCY", "Warning");
      return;
    }
    if (this.CURRENCY == 'USD') {
      if (this.USDPrice == 0) {
        this.toastr.clear();
        this.toastr.warning("select USD Price", "Warning");
        return;
      }
    }
    if (this.PurCURRENCY == "") {
      this.toastr.clear();
      this.toastr.warning("select Purchase CURRENCY", "Warning");
      return;
    }
    if (this.PurCURRENCY == 'USD') {
      if (this.PurConversion == 0) {
        this.toastr.clear();
        this.toastr.warning("select Purchase Conversation", "Warning");
        return;
      }
      if (this.EXPRE == 0) {
        this.toastr.clear();
        this.toastr.warning("select Exchange Premium", "Warning");
        return;
      }
    }
    if (this.USDPRICE == 0) {
      this.toastr.clear();
      this.toastr.warning("select Purchsae USD Price", "Warning");
      return;
    }
    if (this.FINALPRUN == 0) {
      this.toastr.clear();
      this.toastr.warning("select Purchsae Final Price", "Warning");
      return;
    }
    if (this.selectedPriceUnit == "") {
      this.toastr.clear();
      this.toastr.warning("select Price by Pc/Price by Wt", "Warning");
      return;
    }
    if (this.selectedPurpose == "") {
      this.toastr.clear();
      this.toastr.warning("select Purpose", "Warning");
      return;
    }
    if (this.CURRENCY == "USD") {
      if (this.Conversion == 0 || this.Conversion == null) {
        this.toastr.clear();
        this.toastr.warning("Enter Conversion", "Warning");
        return;
      }
      if (this.USDPrice == null || this.USDPrice == 0) {
        this.toastr.clear();
        this.toastr.warning("Enter USDPrice", "Warning");
        return;
      }
      if (this.PRUN == null || this.PRUN == 0) {
        this.toastr.clear();
        this.toastr.warning("Enter PRUN", "Warning");
        return;
      }
    }
    this.spinner.show();
    let resultobj = {
      TrnNo: this.valdata.trnno,
      SrNo: this.valdata.SrNo,
      PktNo: "",
      Category: this.Category,
      Material: this.Material.value.toString(),
      Shape: this.Shape.value.toString(),
      Size: this.SIZE,
      MM: 0,
      Origin: 0,
      Color: this.Color.value.toString(),
      Clarity: this.Clarity.value.toString(),
      Weight: this.Weight,
      Selection: 0,
      Rate: 0,
      Conv: 0,
      Amount: 0,
      Less1: 0,
      Less2: 0,
      Less3: "",
      Remark: "",
      CreateBy: this.decodedTkn.UserId,
      TYPEOFPUR: this.PurchaseArr.filter(option => option.name == this.PurchaseType.value.toString())[0].code,
      MEMONO: this.MemoNumberCode,
      SieveGuage: this.selectedStatus,
      FSIGI: this.SGFrom,
      TSIGI: this.SGTo,
      SIGIRANGE: this.SGRang,
      OPCS: this.Pcs,
      OWEIGHT: this.Weight,
      OUNIT: this.Unit,
      OAVGWEIGHT: this.AvgWt,
      OSELLERMARK: this.SELLERSMARK,
      OCURRENCY: this.CURRENCY,
      OUSD: this.USDPrice,
      OCONVRATE: this.Conversion,
      OPCWT: this.selectedPriceUnit,
      OASKPRICE: this.PRUN,
      OTOTAMT: this.TAmount,
      PPCS: this.PurPcs,
      PWEIGHT: this.PurWeight,
      PUNIT: this.PurUnit,
      PAVGWEIGHT: this.PurAvgWt,
      PSELECTION: this.SelectionPer,
      PCURRENCY: this.PurCURRENCY,
      PCONVRATE: this.PurConversion,
      PEXCPRE: this.EXPRE,
      PNETCONVRATE: this.NETCONV,
      PUSD: this.USDPRICE,
      PFINALPRICE: this.FINALPRUN,
      PTOTAMT: this.PurTAmount,
      PAYFAMT: this.FINALAMOUNT,
      ADDDISC1: this.ADDISC1,
      ADDDISC2: this.ADDISC2,
      DISC1: this.DISC1,
      DISC2: this.DISC2,
      DISCDET1: this.DISCDET1,
      DISCDET2: this.DISCDET2,
      BROKRAGE: this.BROKERAGEPER,
      BROKRAGEAMT: this.BROKERAGEAMT,
      ERLYPAYPER: this.ERLPAYDISCPER,
      ERLYPAYAMT: this.ERLPAYDISCAMT,
      NETAMTPAY: this.NETAMTPAYABLE,
      Purpose: this.selectedPurpose,
      STKORD: this.OrdnerNo,
      COMMENT: this.Comment,
      DRILLSTATUS: '',
      GOODSSTATUS: '',
      LAB: '',
      CERTNO: '',
      COLORSHADE: this.Colourshade,
      COLORSCALE: '',
      SIZE: '',
      PURRAPPRICE: 0,
      PURRAPDISC: 0,
      PURRAPVAL: 0,
      PURRAPAMT: 0,
      PURADDDISCRAP: 0,
      PURADDDISCRAPVAL: 0,
      PURADDDISCRAPAMT: 0,
      PREMIUM: 0,
      PREMIUMVAL: 0,
      PREMIUMAMT: 0,
      PURADDDISC: 0,
      PURADDDISCVAL: 0,
      PURADDDISCAMT: 0,
      NETRAPDISC: 0,
      NETPRICEWT: 0,
      NETPRICPCS: 0,
      Intensity: 0,
      OverTone: 0
    };

    this.PurchaseSer.BillLSave(resultobj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.toastr.clear();
          this.toastr.success("Saved Successfully");
          this.spinner.hide();
          this._mdr.close();
        } else {
          this.toastr.clear();
          this.toastr.success("Something is wrong");
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  GETMEMODETAIL(e: any) {
    this.PurchaseSer.GETMEMODETAILBYPURCHASE({ MEMONO: e, TRNNOPUR: this.valdata.trnno }).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          if (Result.Data[0].MaterialName) {
            this.MaterialCode = Result.Data[0].MaterialName;
          }
          this.SelectMaterialOption();
          this.ShapeCode = Result.Data[0].ShapeName;
          this.SelectShapeOption()
          this.OriginCode = Result.Data[0].originName;
          this.SelectOriginOption()
          this.ClarityCode = Result.Data[0].ClarityName;
          this.SelectClarityOption()
          this.ColorCode = Result.Data[0].ColorName;
          this.SelectColorOption()
          this.Colourshade = Result.Data[0].COLORSHADE;
          this.selectedStatus = Result.Data[0].SIGA;
          this.SGFrom = Result.Data[0].FromGague;
          this.SGTo = Result.Data[0].ToGague;
          this.SGRang = Result.Data[0].SIGIRng
          this.ChnageRangeFormat()
          this.selectedPurpose = Result.Data[0].Purpose
          this.ChnagePurpose()
          this.OrdnerNo = Result.Data[0].OrdNo
          this.Comment = Result.Data[0].COMMENT
          this.Pcs = Result.Data[0].Pcs
          this.Weight = Result.Data[0].Weight
          this.SIZE = Result.Data[0].SizeDESC
          this.ChnagePriceCal()
          this.Unit = Result.Data[0].Unit
          if (Result.Data[0].Currency) {
            this.CURRENCY = Result.Data[0].Currency
          }
          this.ChnageRangeFormat1()
          this.USDPrice = Result.Data[0].Price
          this.Conversion = Result.Data[0].Conv
          if (Result.Data[0].PPW) {
            this.selectedPriceUnit = Result.Data[0].PPW
          }
          this.PRUN = Result.Data[0].Price
          this.ChnagePriceCal()
          // this.FINALAMOUNT = Result.Data[0].PAYFAMT
          this.ADDISC1 = Result.Data[0].DISC1
          this.ADDISC2 = Result.Data[0].DISC2
          // this.DISC1 = Result.Data[0].DISC1
          // this.DISC2 = Result.Data[0].DISC2
          // this.DISCDET1 = Result.Data[0].DISCDET1
          // this.DISCDET2 = Result.Data[0].DISCDET2
          this.BROKERAGEPER = Result.Data[0].BROKERAGE
          // this.BROKERAGEAMT = Result.Data[0].BROKRAGEAMT
          // this.ERLPAYDISCPER = Result.Data[0].ERLYPAYPER
          // this.ERLPAYDISCAMT = Result.Data[0].ERLYPAYAMT
          // this.NETAMTPAYABLE = Result.Data[0].NETAMTPAY
        } else {
          this.toastr.clear();
          this.toastr.success("Something is wrong");
          this.spinner.hide();
        }
      } catch (err) {
        this.spinner.hide();
        this.toastr.error(err);
      }
    });
  }
  CHANGETOTALAMT() {
    this.FINALAMOUNT = this.PurTAmount
    this.DISC1 = this.FINALAMOUNT * this.ADDISC1 / 100
    this.DISC2 = this.FINALAMOUNT * this.ADDISC2 / 100
    this.BROKERAGEAMT = this.FINALAMOUNT * this.BROKERAGEPER / 100
  }
}


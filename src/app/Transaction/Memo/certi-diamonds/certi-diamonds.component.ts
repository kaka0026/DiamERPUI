import { Component, OnInit, Inject } from "@angular/core";
import { MemoInService } from "../../../Services/Transaction/memo-in.service";
import { LabMastService } from "../../../Services/Masters/lab-mast.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import * as $ from "jquery";
import { ColMastService } from "../../../Services/Masters/col-mast.service";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PermissionService } from 'src/app/Services/Access/permission.service';

export interface Lot1 {
  name: string;
  code: string;
}
export interface Lot2 {
  name: string;
  code: string;
  C_Code: number;
}

export interface Lot3 {
  name: string;
  code: string;
  Q_Code: number;
}

@Component({
  selector: 'app-certi-diamonds',
  templateUrl: './certi-diamonds.component.html',
  styleUrls: ['./certi-diamonds.component.css']
})
export class CertiDiamondsComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

  Color: FormControl;
  filteredColor: Observable<any[]>;
  ColorCode: any = "";
  ColorArr: Lot2[] = [];
  ColorName: any = '';

  Material: FormControl;
  filteredMaterial: Observable<any[]>;
  MaterialCode: any = "";
  MaterialArr: Lot1[] = [];
  MaterialName: any = '';

  Shape: FormControl;
  filteredShape: Observable<any[]>;
  ShapeCode: any = "";
  ShapeArr: Lot1[] = [];
  ShapeName: any = '';

  Lab: FormControl;
  filteredLab: Observable<any[]>;
  LabCode: any = "";
  LabArr: Lot1[] = [];
  LabName: any = '';

  Clarity: FormControl;
  filteredClarity: Observable<any[]>;
  ClarityCode: any = "";
  ClarityArr: Lot3[] = [];
  ClarityName: any = '';

  Origin: FormControl;
  filteredOrigin: Observable<any[]>;
  OriginCode: any = "";
  OriginArr: Lot1[] = [];
  OriginName: any = '';

  Category: any = "";
  Size: any = "";
  selectedStatus: any = "";
  SGTo: number = 0;
  SGFrom: number = 0;
  SGRang: any = "";
  selectedYN: any = "Yes";
  CertificateNo: any = "";
  Weight: number = 0;
  AvgWt: number = 0;
  Pcs: number = 1;
  selectedPriceUnit: any = "Pec";
  TAmount: number = 0;
  PRUN: number = 0;
  selectedPurpose: any = "STOCK";
  Comment: any = "";
  OrdnerNo: any = "";
  Disbled1: boolean = false;
  Disbled: boolean = false;
  Disbled2: boolean = true;
  Disbled3: boolean = true;
  ShapeFlag: boolean = false;
  MaterialFlag: boolean = false;
  SELLERSMARK: any = "";
  CURRENCY: any = "USD";
  COLOURSCALE: any = "";
  Conversion: number = 0.00;
  USDPrice: number = 0.00;
  RAPDISC: number = 0.00;
  RAPPRICE: any = '';
  colorcodeforrap: number = 0;
  claritycodeforrap: number = 0;
  Unit: any = "CTS";

  constructor(
    private MemoInSer: MemoInService,
    private spinner: NgxSpinnerService,
    private ColMastSer: ColMastService,
    private LabMastSer: LabMastService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _mdr: MatDialogRef<CertiDiamondsComponent>,
    private PermissionSer: PermissionService,
    @Inject(MAT_DIALOG_DATA) public valdata: any
  ) {
    this.Color = new FormControl();
    this.Material = new FormControl();
    this.Shape = new FormControl();
    this.Lab = new FormControl();
    this.Clarity = new FormControl();
    this.Origin = new FormControl();

    this.Category = valdata.sortname;
    if (valdata.SrNo != "") {
      let ObjResult = {
        USERID: this.decodedTkn.UserId,
        PAGENAME: "MemoIn.aspx"
      }
      this.PermissionSer.PageWisePermissionFill(ObjResult).subscribe(Result => {
        try {
          if (Result.Success == 1) {
            if (Result.Data[0].ISEDIT == "False") {
              this.MemoInSer.AllMemoLFill(
                { TrnNo: valdata.trnno, SrNo: valdata.SrNo }
              ).subscribe(Result => {
                try {
                  if (Result.Success == 1) {
                    $("#save").hide();
                    this.MaterialCode = Result.Data[0].M_SortName;
                    this.SelectMaterialOption();
                    this.ShapeCode = Result.Data[0].S_SortName;
                    this.OriginCode = Result.Data[0].O_SORTNAME;
                    this.ClarityCode = Result.Data[0].ClarityName;
                    this.ColorCode = Result.Data[0].ColorName;
                    this.LabCode = Result.Data[0].CR_SORTNAME;
                    this.selectedStatus = Result.Data[0].SIGA;
                    this.SGRang = Result.Data[0].SIGARng;
                    this.SGTo = Result.Data[0].ToGague;
                    this.SGFrom = Result.Data[0].FromGague;
                    this.Size = Result.Data[0].SizeDESC
                    this.Pcs = Result.Data[0].Pcs;
                    this.Weight = Result.Data[0].Weight;
                    this.Unit = Result.Data[0].Unit;
                    this.selectedPriceUnit = Result.Data[0].FromGague;
                    this.CertificateNo = Result.Data[0].CertiNo;
                    this.selectedPriceUnit = Result.Data[0].PPW;
                    this.selectedYN = Result.Data[0].Cirtified;
                    this.ChnageYesNoFormat();
                    this.PRUN = Result.Data[0].Price;
                    this.TAmount = Result.Data[0].Amount;
                    if (Result.Data[0].OrdNo) {
                      this.selectedPurpose = "ORDER";
                    } else {
                      this.selectedPurpose = "STOCK";
                    }
                    this.OrdnerNo = Result.Data[0].OrdNo;
                    this.Comment = Result.Data[0].Comment;
                    this.SELLERSMARK = Result.Data[0].SellersMark;
                    this.AvgWt = Result.Data[0].AvgWt;
                    this.CURRENCY = Result.Data[0].Currency;
                    this.ChnageRangeFormat1();
                    this.USDPrice = Result.Data[0].USDPrice;
                    this.Conversion = Result.Data[0].Conv
                    this.COLOURSCALE = Result.Data[0].Color_Scale
                    this.RAPPRICE = Result.Data[0].Rap
                    this.RAPDISC = Result.Data[0].Disc
                    this.ChnagePurpose();
                    this.Disbled = true;
                    this.Disbled1 = true;
                    this.Disbled2 = true;
                    this.Disbled3 = true;

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

                    this.Lab.disable();
                    this.Lab.disabled
                  } else {
                  }
                } catch (err) {
                  this.toastr.error(err);
                }
              });
            } else {
              this.MemoInSer.AllMemoLFill(
                { TrnNo: valdata.trnno, SrNo: valdata.SrNo }
              ).subscribe(Result => {
                try {
                  if (Result.Success == 1) {
                    this.MaterialCode = Result.Data[0].M_SortName;
                    this.SelectMaterialOption();
                    this.ShapeCode = Result.Data[0].S_SortName;
                    this.OriginCode = Result.Data[0].O_SORTNAME;
                    this.ClarityCode = Result.Data[0].ClarityName;
                    this.ColorCode = Result.Data[0].ColorName;
                    this.LabCode = Result.Data[0].CR_SORTNAME;
                    this.selectedStatus = Result.Data[0].SIGA;
                    this.SGRang = Result.Data[0].SIGARng;
                    this.SGTo = Result.Data[0].ToGague;
                    this.SGFrom = Result.Data[0].FromGague;
                    this.Size = Result.Data[0].SizeDESC
                    this.Pcs = Result.Data[0].Pcs;
                    this.Weight = Result.Data[0].Weight;
                    this.Unit = Result.Data[0].Unit;
                    this.selectedPriceUnit = Result.Data[0].FromGague;
                    this.CertificateNo = Result.Data[0].CertiNo;
                    this.selectedPriceUnit = Result.Data[0].PPW;
                    this.selectedYN = Result.Data[0].Cirtified;
                    this.ChnageYesNoFormat();
                    this.PRUN = Result.Data[0].Price;
                    this.TAmount = Result.Data[0].Amount;
                    if (Result.Data[0].OrdNo) {
                      this.selectedPurpose = "ORDER";
                    } else {
                      this.selectedPurpose = "STOCK";
                    }
                    this.OrdnerNo = Result.Data[0].OrdNo;
                    this.Comment = Result.Data[0].Comment;
                    this.SELLERSMARK = Result.Data[0].SellersMark;
                    this.AvgWt = Result.Data[0].AvgWt;
                    this.CURRENCY = Result.Data[0].Currency;
                    this.ChnageRangeFormat1();
                    this.USDPrice = Result.Data[0].USDPrice;
                    this.Conversion = Result.Data[0].Conv
                    this.COLOURSCALE = Result.Data[0].Color_Scale
                    this.RAPPRICE = Result.Data[0].Rap
                    this.RAPDISC = Result.Data[0].Disc
                    this.ChnagePurpose();
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
  }

  ngOnInit(): void {
    this.ChnageYesNoFormat();
    this.ChnagePurpose();
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



    this.MemoInSer.OriginFill({}).subscribe(Result => {
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

    this.LabMastSer.LBMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.LabArr = Result.Data.map(item => {
            return {
              code: item.CR_SORTNAME,
              name: item.CR_NAME
            };
          });
          this.filteredLab = this.Lab.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredLabs(lot) : this.LabArr.slice()))
          );
        } else {
        }
      } catch (err) {
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
      this.GetOrgRap();
    }
  }
  SelectOriginOption() {
    if (this.Origin.value != "") {
    }
  }
  SelectClarityOption(e) {
    const toSelect1 = this.ClarityArr.find(c => c.name == e);
    this.claritycodeforrap = toSelect1.Q_Code;
    this.GetOrgRap();
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
  GetOrgRap() {
    let resultobj = {
      Carat: this.Weight,
      S_CODE: this.ShapeCode,
      C_CODE: this.ColorCode,
      Q_CODE: this.ClarityCode
    };
    this.MemoInSer.GetOrgRap(resultobj).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.RAPPRICE = Result.Data[0].GRapAt;
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
  Save() {
    if (this.MaterialCode.trim() == "" || this.MaterialFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Material", "Warning");
      return;
    }
    if (this.ShapeCode.trim() == "" || this.ShapeFlag == false) {
      this.toastr.clear();
      this.toastr.warning("Select Shape", "Warning");
      return;
    }
    // if (this.Pcs == undefined || this.Pcs == 0) {
    //   this.toastr.clear();
    //   this.toastr.warning("Enter Pcs", "Warning");
    //   return;
    // }
    if (this.Weight == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Weight", "Warning");
      return;
    }
    if (this.Unit == "") {
      this.toastr.clear();
      this.toastr.warning("select Unit", "Warning");
      return;
    }
    if (this.CURRENCY == "") {
      this.toastr.clear();
      this.toastr.warning("select CURRENCY", "Warning");
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
      Category: this.Category,
      MaterialName: this.MaterialCode,
      ShapeName: this.ShapeCode,
      FSize: 0.00,
      TSize: 0.00,
      SIGA: this.selectedStatus,
      FromGague: this.SGFrom,
      ToGague: this.SGTo,
      SIGARng: this.SGRang,
      Certi_Name: this.LabCode,
      ColorName: this.ColorCode,
      ColorToName: "",
      ClarityName: this.ClarityCode,
      ClarityToName: "",
      SUPCode: "",
      Pcs: this.Pcs,
      Unit: this.Unit,
      Weight: this.Weight,
      Price: this.PRUN == undefined ? 0.00 : this.PRUN,
      Amount: this.TAmount,
      Conv: this.Conversion,
      Purpose: this.selectedPurpose,
      OrderNo: this.OrdnerNo,
      Comment: this.Comment,
      CreateBy: this.decodedTkn.UserId,
      CertiNo: "",
      Flo_Name: "0",
      Disc: this.RAPDISC,
      Origin: this.OriginCode,
      SizeDESC: this.Size,
      Cirtified: this.selectedYN,
      PPW: this.selectedPriceUnit,
      DrStatus: "0",
      SellersMark: this.SELLERSMARK,
      AvgWt: this.AvgWt,
      Currency: this.CURRENCY,
      USDPrice: this.USDPrice,
      GoodStatus: "",
      Color_Scale: this.COLOURSCALE,
      Rap: parseInt(this.RAPPRICE)
    };
    this.MemoInSer.MemoSaveCSImm(resultobj).subscribe(Result => {
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
  Close() {
    this._mdr.close();
  }
  ChnageRangeFormat() {
    if (this.SGTo) {
      if (this.selectedStatus == "SIEVE") {
        this.Disbled1 = false;
        this.SGRang = "+" + this.SGFrom + "-" + this.SGTo;
      } else if (this.selectedStatus == "GAGUE") {
        this.Disbled1 = false;
        if (this.SGFrom > this.SGTo) {
          this.SGRang = this.SGFrom + "X" + this.SGTo + " mm";
        }
        else {
          this.SGRang = Number(this.SGFrom).toFixed(2) + "mm-" + Number(this.SGTo).toFixed(2) + "mm";
        }
      } else if (this.selectedStatus == "NONE") {
        this.Disbled1 = true;
      }
    } else {
      if (this.selectedStatus == "SIEVE") {
        this.Disbled1 = false;
        this.SGRang = "+" + this.SGFrom + "-" + this.SGTo;
      } else if (this.selectedStatus == "GAGUE") {
        this.Disbled1 = false;
        if (this.SGFrom > this.SGTo) {
          this.SGRang = this.SGFrom + "X" + this.SGTo + " mm";
        }
        else {
          this.SGRang = Number(this.SGFrom).toFixed(2) + "mm-" + Number(this.SGTo).toFixed(2) + "mm";
        }
      } else if (this.selectedStatus == "NONE") {
        this.Disbled1 = true;
      }
    }
  }
  ChnageYesNoFormat() {
    if (this.selectedYN == "Yes") {
      $("#lb").css("opacity", "1");
      $("#certno").css("opacity", "1");
    } else {
      $("#lb").css("opacity", "0");
      $("#certno").css("opacity", "0");
    }
  }

  filteredmaterials(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.MaterialArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredLabs(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.LabArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  filteredShapes(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.ShapeArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }

  // filteredClaritys(name: string) {
  //   const filterValue = name.toLowerCase();
  //   const a = this.ClarityArr.filter(option => option.name.toLowerCase().includes(filterValue));
  //   return a;
  // }

  filteredOrigins(name: string) {
    const filterValue = name.toLowerCase();
    const a = this.OriginArr.filter(option => option.name.toLowerCase().includes(filterValue));
    return a;
  }
  SelectColorOption(e: any) {
    const toSelect1 = this.ColorArr.find(c => c.name == e);
    this.colorcodeforrap = toSelect1.C_Code;
    this.GetOrgRap();
  }

  // filteredColors(name: string) {
  //   const filterValue = name.toLowerCase();
  //   const a = this.ColorArr.filter(option => option.name.toLowerCase().includes(filterValue));
  //   return a;
  // }
  ChnageRangeFormat1() {
    if (this.CURRENCY == "USD") {
      $("#conversation").css("display", "block");
      this.Disbled3 = false;
    } else {
      $("#conversation").css("display", "none");
      this.Disbled3 = true;
    }
  }
  AskpriceCal() {
    this.GetOrgRap();
    this.PRUN = this.USDPrice * this.Conversion;
    this.TAmount = this.Weight * this.PRUN;
  }
  ChnagePurpose() {
    if (this.selectedPurpose == "ORDER") {
      $("#ord").css("display", "block");
    }
    else if (this.selectedPurpose == "STOCK") {
      $("#ord").css("display", "none");
    }
  }
}

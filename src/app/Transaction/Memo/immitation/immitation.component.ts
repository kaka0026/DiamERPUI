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

@Component({
  selector: 'app-immitation',
  templateUrl: './immitation.component.html',
  styleUrls: ['./immitation.component.css']
})
export class ImmitationComponent implements OnInit {
  decodeHelper = new JwtHelperService();
  decodedTkn = this.decodeHelper.decodeToken(localStorage.getItem("token"));

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

  Color: FormControl;
  filteredColor: Observable<any[]>;
  ColorCode: any = "";
  ColorArr: Lot1[] = [];
  ColorName: any = '';

  Clarity: FormControl;
  filteredClarity: Observable<any[]>;
  ClarityCode: any = "";
  ClarityArr: Lot1[] = [];
  ClarityName: any = '';

  Category: any = "";
  Size: any = "";
  selectedStatus: any = "";
  SGTo: number = 0;
  SGFrom: number = 0;
  SGRang: any = "";
  selectedYN: any = "Yes";
  CertificateNo: any = "";
  Weight: number = 0;
  Pcs: number = 0;
  selectedPriceUnit: any = "Pec";
  TAmount: number = 0;
  PRUN: number = 0;
  selectedPurpose: any = "STOCK";
  Comment: any = "";
  OrdnerNo: any = "";
  DrStatus1: any = "";
  GoodStatus1: any = "";
  SupCode: any = "";
  Unit: any = "";
  Disbled1: boolean = false;
  Disbled: boolean = false;
  Disbled2: boolean = true;
  Disbled3: boolean = true;
  MaterialFlag: boolean = false;
  ShapeFlag: boolean = false;
  SELLERSMARK: any = "";
  CURRENCY: any = "INR";
  Conversion: number = 0.00;
  USDPrice: number = 0.00;
  AvgWt: number = 0;

  constructor(
    private MemoInSer: MemoInService,
    private spinner: NgxSpinnerService,
    private ColMastSer: ColMastService,
    private LabMastSer: LabMastService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private PermissionSer: PermissionService,
    private _mdr: MatDialogRef<ImmitationComponent>,
    @Inject(MAT_DIALOG_DATA) public valdata: any
  ) {
    this.Material = new FormControl();
    this.Shape = new FormControl();
    this.Lab = new FormControl();
    this.Color = new FormControl();
    this.Clarity = new FormControl();

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
                    this.ClarityCode = Result.Data[0].ClarityName;
                    this.DrStatus1 = Result.Data[0].DrStatus
                    this.GoodStatus1 = Result.Data[0].GoodStatus
                    this.LabCode = Result.Data[0].CR_SORTNAME;
                    this.ColorCode = Result.Data[0].ColorName;
                    this.selectedStatus = Result.Data[0].SIGA;
                    this.SGRang = Result.Data[0].SIGARng;
                    this.SGTo = Result.Data[0].ToGague;
                    this.SGFrom = Result.Data[0].FromGague;
                    this.Size = Result.Data[0].SizeDESC
                    this.Pcs = Result.Data[0].Pcs;
                    this.Weight = Result.Data[0].Weight;
                    this.Unit = Result.Data[0].Unit;
                    this.SupCode = Result.Data[0].SUPCode;
                    this.selectedPriceUnit = Result.Data[0].FromGague;
                    this.CertificateNo = Result.Data[0].CertiNo;
                    this.selectedPriceUnit = Result.Data[0].PPW;
                    this.ChnagePriceCal();
                    this.selectedYN = Result.Data[0].Cirtified;
                    this.ChnageYesNoFormat();
                    this.PRUN = Result.Data[0].Price;
                    this.TAmount = Result.Data[0].Amount;
                    if (Result.Data[0].OrdNo) {
                      this.selectedPurpose = "ORDER";
                    } else {
                      this.selectedPurpose = "STOCK";
                    }
                    this.ChnagePricePurpose();
                    this.OrdnerNo = Result.Data[0].OrdNo;
                    this.Comment = Result.Data[0].Comment;
                    this.SELLERSMARK = Result.Data[0].SellersMark;
                    this.AvgWt = Result.Data[0].AvgWt;
                    this.ChnagePriceCal();
                    this.CURRENCY = Result.Data[0].Currency;
                    this.ChnageRangeFormat1();
                    this.USDPrice = Result.Data[0].USDPrice;
                    this.Conversion = Result.Data[0].Conv;
                    this.ChnageRangeFormat();
                    this.ChnagePurpose();
                    this.Disbled = true;
                    this.Disbled1 = true;
                    this.Disbled2 = true;
                    this.Disbled3 = true;

                    this.Material.disable();
                    this.Material.disabled

                    this.Shape.disable();
                    this.Shape.disabled

                    this.Color.disable();
                    this.Color.disabled

                    this.Clarity.disable();
                    this.Clarity.disabled

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
                    this.ClarityCode = Result.Data[0].ClarityName;
                    this.DrStatus1 = Result.Data[0].DrStatus
                    this.GoodStatus1 = Result.Data[0].GoodStatus
                    this.LabCode = Result.Data[0].CR_SORTNAME;
                    this.ColorCode = Result.Data[0].ColorName;
                    this.selectedStatus = Result.Data[0].SIGA;
                    this.SGRang = Result.Data[0].SIGARng;
                    this.SGTo = Result.Data[0].ToGague;
                    this.SGFrom = Result.Data[0].FromGague;
                    this.Size = Result.Data[0].SizeDESC
                    this.Pcs = Result.Data[0].Pcs;
                    this.Weight = Result.Data[0].Weight;
                    this.Unit = Result.Data[0].Unit;
                    this.SupCode = Result.Data[0].SUPCode;
                    this.selectedPriceUnit = Result.Data[0].FromGague;
                    this.CertificateNo = Result.Data[0].CertiNo;
                    this.selectedPriceUnit = Result.Data[0].PPW;
                    this.ChnagePriceCal();
                    this.selectedYN = Result.Data[0].Cirtified;
                    this.ChnageYesNoFormat();
                    this.PRUN = Result.Data[0].Price;
                    this.TAmount = Result.Data[0].Amount;
                    if (Result.Data[0].OrdNo) {
                      this.selectedPurpose = "ORDER";
                    } else {
                      this.selectedPurpose = "STOCK";
                    }
                    this.ChnagePricePurpose();
                    this.OrdnerNo = Result.Data[0].OrdNo;
                    this.Comment = Result.Data[0].Comment;
                    this.SELLERSMARK = Result.Data[0].SellersMark;
                    this.AvgWt = Result.Data[0].AvgWt;
                    this.ChnagePriceCal();
                    this.CURRENCY = Result.Data[0].Currency;
                    this.ChnageRangeFormat1();
                    this.USDPrice = Result.Data[0].USDPrice;
                    this.Conversion = Result.Data[0].Conv;
                    this.ChnageRangeFormat();
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
          this.Material.valueChanges.subscribe(value => this.autocompletevalidation("Material"));
          this.filteredMaterial = this.Material.valueChanges.pipe(
            startWith(""),
            map(lot => (lot ? this.filteredmaterials(lot) : this.MaterialArr.slice()))
          );
        } else {
          this.toastr.clear();
          this.toastr.error("Somthing Went Wrong");
        }
      } catch (err) {
        this.toastr.clear();
        this.toastr.error(err);
      }
    });



    this.LabMastSer.LBMastFill({}).subscribe(Result => {
      try {
        if (Result.Success == 1) {
          this.LabArr = Result.Data.map(item => {
            return {
              code: item.CR_SORTNAME,
              name: item.CR_SORTNAME
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
      this.MemoInSer.GetColorbyMaterial({ M_SortName: this.MaterialCode }).subscribe(Result => {

        try {
          if (Result.Success == 1) {
            this.ColorArr = Result.Data.map(item => {
              return {
                code: item.C_Name,
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
    }
  }
  SelectShapeOption() {
    if (this.Shape.value != "") {
    }
  }
  SelectColorOption() {
    if (this.Color.value != "") {
    }
  }
  SelectClarityOption() {
    if (this.Clarity.value != "") {
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
  Save() {
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
    if (this.Weight == undefined) {
      this.toastr.clear();
      this.toastr.warning("Enter Weight", "Warning");
      return;
    }
    if (this.Unit == "") {
      this.toastr.clear();
      this.toastr.warning("Enter Unit", "Warning");
      return;
    } if (this.CURRENCY == "") {
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
      SUPCode: this.SupCode,
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
      CertiNo: this.CertificateNo,
      Flo_Name: "0",
      Disc: 0.00,
      Origin: "",
      SizeDESC: this.Size,
      Cirtified: this.selectedYN,
      PPW: this.selectedPriceUnit,
      DrStatus: this.DrStatus1,
      GoodStatus: this.GoodStatus1,
      SellersMark: this.SELLERSMARK,
      AvgWt: this.AvgWt,
      Currency: this.CURRENCY,
      USDPrice: this.USDPrice,
      Color_Scale: ""
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
    if (this.selectedStatus == "SIEVE") {
      this.Disbled1 = false;
      this.SGRang = "+" + this.SGFrom + "-" + this.SGTo;
      $("#fsigi").css("display", "block");
      $("#tsigi").css("display", "block");
      $("#sigirange").css("display", "block");
    } else if (this.selectedStatus == "GAGUE") {
      this.Disbled1 = false;
      $("#fsigi").css("display", "block");
      $("#tsigi").css("display", "block");
      $("#sigirange").css("display", "block");
      if (this.SGFrom > this.SGTo) {
        this.SGRang = this.SGFrom + "X" + this.SGTo + " mm";
      }
      else {
        this.SGRang = Number(this.SGFrom).toFixed(2) + "mm-" + Number(this.SGTo).toFixed(2) + "mm";
      }
    } else if (this.selectedStatus == "NONE") {
      this.Disbled1 = true;
      $("#fsigi").css("display", "none");
      $("#tsigi").css("display", "none");
      $("#sigirange").css("display", "none");
    } else if (this.selectedStatus = "BY") {
      this.Disbled1 = true;
      $("#fsigi").css("display", "block");
      $("#tsigi").css("display", "block");
      $("#sigirange").css("display", "block");
      this.SGRang = this.SGFrom + "X" + this.SGTo;
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
  ChnagePriceCal() {
    if (this.Weight != 0 || this.Pcs != 0) {
      this.AvgWt = Math.round((this.Weight / this.Pcs) * 100) / 100;
    }
    else {
      this.AvgWt = 0
    }
    if (this.Pcs == 0 || this.Pcs == null) {
      this.Disbled2 = true;
    } else {
      this.Disbled2 = false;
    }
    if (this.selectedPriceUnit == "Piece") {
      this.TAmount = Math.round((this.PRUN * this.Pcs) * 100) / 100;
    } else if (this.selectedPriceUnit == "Weight") {
      this.TAmount = Math.round((this.PRUN * this.Weight) * 100) / 100;
    } else {
      this.TAmount = 0
    }
  }
  ChnagePricePurpose() {
    if (this.selectedPurpose == "ORDER") {
      $("#ord").css("display", "block");
    } else {
      $("#ord").css("display", "none");
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
  ChnageRangeFormat1() {
    if (this.CURRENCY == "USD") {
      $("#conversation").css("display", "block");
      this.Disbled3 = false;
    } else {
      $("#conversation").css("display", "none");
      this.Disbled3 = true;
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
}
